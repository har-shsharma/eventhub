import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const updateEventSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(), 
  location: z.string().optional(),
  customFields: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const event = await Event.findById(id).select(
      'title date location description customFields ownerId'
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    if (
      event.ownerId.toString() !== user.userId &&
      !['admin', 'staff'].includes(user.role)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const parsed = updateEventSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const updateData = parsed.data;

    if (updateData.title !== undefined) event.title = updateData.title;
    if (updateData.description !== undefined) event.description = updateData.description;
    if (updateData.date !== undefined) event.date = new Date(updateData.date);
    if (updateData.location !== undefined) event.location = updateData.location;
    if (updateData.customFields !== undefined) event.customFields = updateData.customFields;

    await event.save();

    return NextResponse.json({ event }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    if (
      event.ownerId.toString() !== user.userId &&
      !['admin', 'staff'].includes(user.role)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await event.deleteOne();

    return NextResponse.json({ message: 'Event deleted' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
