import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import ChatMessage from '../../../../../models/ChatMessage';


export async function GET() {
  try {
    await connectDB();

    // Get count of pending questions
    const pendingCount = await ChatMessage.countDocuments({ 
      isQuestion: true,
      status: 'pending'
    });

    return NextResponse.json({ pendingCount });
  } catch (error) {
    console.error('Get pending count error:', error);
    return NextResponse.json({ error: 'Failed to get pending count' }, { status: 500 });
  }
}
