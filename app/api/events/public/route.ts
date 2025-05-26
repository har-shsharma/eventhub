import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find()
      .sort({ date: 1 }) 
      .select('title date location description ownerId customFields'); 

    return NextResponse.json({ events }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
