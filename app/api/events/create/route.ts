import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  const user = token ? verifyToken(token) : null;
  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, date, location, customFields } = await req.json();
    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
    }

    await connectDB();

    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      customFields,
      ownerId: user.userId,
    });

    return NextResponse.json({ message: 'Event created', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
