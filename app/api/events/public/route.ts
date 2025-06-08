import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const skip = (page - 1) * limit;
    const search = searchParams.get('search')?.trim();

    const searchQuery: any = { status: 'approved' };

    if (search) {
      const keywords = search.split(/\s+/).filter(Boolean);
      searchQuery.$or = keywords.flatMap((word) => {
        const regex = new RegExp(word, 'i');
        return [
          { title: regex },
          { description: regex },
          { 'customFields.label': regex },
          { 'customFields.value': regex },
        ];
      });
    }

    const total = await Event.countDocuments(searchQuery);
    const events = await Event.find(searchQuery)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .select('title date location description ownerId customFields');

    return NextResponse.json({ events, total }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


