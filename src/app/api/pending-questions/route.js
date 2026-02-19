import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ChatMessage from '../../../../models/ChatMessage';


// GET - Fetch all pending questions (for admin)
export async function GET(request) {
  try {
    await connectDB();

    const pendingQuestions = await ChatMessage.find({ 
      isQuestion: true,
      status: 'pending'
    })
    .sort({ createdAt: -1 })
    .lean();

    // Get unique sessions with their questions
    const sessionsMap = new Map();
    
    pendingQuestions.forEach(msg => {
      const sessionId = msg.sessionId;
      if (!sessionsMap.has(sessionId)) {
        sessionsMap.set(sessionId, {
          sessionId,
          userEmail: msg.userEmail,
          userName: msg.userName,
          question: msg.content,
          questionId: msg._id,
          createdAt: msg.createdAt,
          hasReply: false
        });
      }
    });

    // Check if any messages in the session have admin replies
    const sessionIds = Array.from(sessionsMap.keys());
    const replies = await ChatMessage.find({
      sessionId: { $in: sessionIds },
      role: 'admin',
      status: 'replied'
    }).lean();

    const repliedSessionIds = new Set(replies.map(r => r.sessionId));

    // Update hasReply status
    sessionsMap.forEach((value, key) => {
      if (repliedSessionIds.has(key)) {
        value.hasReply = true;
      }
    });

    const questions = Array.from(sessionsMap.values());

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Get pending questions error:', error);
    return NextResponse.json({ error: 'Failed to fetch pending questions' }, { status: 500 });
  }
}

// POST - Admin responds to a question
export async function POST(request) {
  try {
    const { sessionId, response, questionId } = await request.json();

    if (!sessionId || !response) {
      return NextResponse.json({ error: 'SessionId and response are required' }, { status: 400 });
    }

    await connectDB();

    // Save admin's response
    const adminMsg = await ChatMessage.create({
      sessionId,
      role: 'admin',
      content: response,
      status: 'replied'
    });

    // Update the question status to 'replied'
    if (questionId) {
      await ChatMessage.findByIdAndUpdate(questionId, { status: 'replied' });
    }

    // Also update all pending messages in this session
    await ChatMessage.updateMany(
      { sessionId, status: 'pending' },
      { status: 'replied' }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Response sent successfully',
      responseId: adminMsg._id 
    });
  } catch (error) {
    console.error('Respond to question error:', error);
    return NextResponse.json({ error: 'Failed to respond to question' }, { status: 500 });
  }
}
