// app/api/visit/route.js
import { NextResponse } from 'next/server';
import Visits from '../../../../models/Visits';
import connectDB from '../../../../lib/mongodb';

// POST: Record a visit
export async function POST(req) {
  await connectDB();
  
  try {
    await Visits.create({ createdAt: new Date() }); // Log visit
    return NextResponse.json(
      { message: 'Visit recorded' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch total visits
export async function GET(req) {
  await connectDB();
  try {
    const count = await Visit.countDocuments(); // Get total visits
    return NextResponse.json(
      { count },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
