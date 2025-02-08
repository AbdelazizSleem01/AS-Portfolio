// app/api/visit/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Visit from '../../../../models/Visits';

export async function GET(request) {
  try {
    await connectDB();

    let visitCounter = await Visit.findOne({ _id: 'visitCounter' });
    if (!visitCounter) {
      visitCounter = new Visit({ _id: 'visitCounter', count: 0 });
    }

    visitCounter.count += 1;
    await visitCounter.save();

    return NextResponse.json({ count: visitCounter.count });
  } catch (error) {
    console.error('Error updating visit count:', error);
    return NextResponse.json(
      { error: 'Failed to update visit count', details: error.message },
      { status: 500 }
    );
  }
}
