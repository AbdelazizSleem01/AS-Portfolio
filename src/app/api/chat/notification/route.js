import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import ChatMessage from '../../../../../models/ChatMessage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const lastMessageTime = searchParams.get('lastMessageTime');

    if (!sessionId) {
      return NextResponse.json({ error: 'SessionId is required' }, { status: 400 });
    }

    await connectDB();

    // Check for new admin replies
    const query = { 
      sessionId,
      role: 'admin',
      status: 'replied'
    };

    if (lastMessageTime) {
      query.createdAt = { $gt: new Date(lastMessageTime) };
    }

    const newReplies = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    return NextResponse.json({
      hasNewReply: newReplies.length > 0,
      reply: newReplies[0] || null
    });
  } catch (error) {
    console.error('Notification check error:', error);
    return NextResponse.json({ error: 'Failed to check notifications' }, { status: 500 });
  }
}
