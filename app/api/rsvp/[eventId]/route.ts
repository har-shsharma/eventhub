import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RSVP from '@/models/RSVP';
import { verifyToken } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const {eventId} = await params;
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    await connectDB();

    const newRSVP = await RSVP.create({
      eventId: eventId,
      name,
      email,
    });

    return NextResponse.json({ message: 'RSVP submitted', rsvp: newRSVP }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }:  { params: Promise<{ eventId: string }> }
) {
  const {eventId} = await params
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  const user = token ? verifyToken(token) : null;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const rsvps = await RSVP.find({ eventId: eventId}).sort({ submittedAt: -1 });

    return NextResponse.json({ rsvps }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
