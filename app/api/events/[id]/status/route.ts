import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';
import User from '@/models/User';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/mail';

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
    status: z.string().optional(),
});

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const event = await Event.findById(id);
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

        const wasPending = event.status !== 'approved';
        const isNowApproved = updateData.status === 'approved';
        const wasNotRejected = event.status !== 'rejected';
        const isNowRejected = updateData.status === 'rejected';


        if (updateData.title !== undefined) event.title = updateData.title;
        if (updateData.description !== undefined) event.description = updateData.description;
        if (updateData.date !== undefined) event.date = new Date(updateData.date);
        if (updateData.location !== undefined) event.location = updateData.location;
        if (updateData.customFields !== undefined) event.customFields = updateData.customFields;
        if (updateData.status !== undefined) event.status = updateData.status;

        await event.save();

        if (updateData.status !== undefined && ['approved', 'rejected'].includes(updateData.status)) {
            try {
                const owner = await User.findById(event.ownerId);
                if (owner?.email) {
                    if (wasPending && isNowApproved) {
                        await sendApprovalEmail(owner.email, event.title);
                    }
                    if (wasNotRejected && isNowRejected) {
                        await sendRejectionEmail(owner.email, event.title);
                    }
                }
            } catch (emailErr) {
                console.error('Failed to send status email:', emailErr);
            }
        }


        return NextResponse.json({ event }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}