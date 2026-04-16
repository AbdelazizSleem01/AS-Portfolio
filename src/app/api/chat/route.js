import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ChatMessage from '../../../../models/ChatMessage';

async function getGroqResponse(message, history, knowledgeBase) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY is not defined');
    return null;
  }

  // Helper to strip HTML for the prompt
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  };

  const ownerInfo = knowledgeBase?.owner || { name: 'Abdelaziz Sleem' };
  
  const systemPrompt = `You are an AI Assistant for ${ownerInfo.name}'s portfolio website. 
Your goal is to help visitors learn about his work, skills, and experience.

👨‍💻 ABOUT ABDELAZIZ SLEEM:
- Role: Fullstack Developer with 2.5+ years of experience.
- Expertise: React, Next.js, TypeScript, Tailwind CSS, Node.js, MongoDB, DaisyUI, ShadCn.
- Achievements: Created 12+ projects with 99% client satisfaction.
- Vision: To become a leading influencer in the tech industry, delivering innovative solutions while mentoring the next generation of developers.
- Location: Based in Egypt, working with clients globally.

🔧 SERVICES OFFERED:
1. Frontend Development (React, Next.js, Tailwind)
2. Backend Development (Node.js, MongoDB, APIs)
3. Fullstack Solutions
4. UI/UX Design (Figma)
5. Freelance Consulting
6. Custom Web Solutions

PROJECTS IN PORTFOLIO:
${knowledgeBase?.projects?.map(p => `- ${p.title}: ${stripHtml(p.description).substring(0, 150)}...`).join('\n') || 'No projects listed.'}

SKILLS:
${knowledgeBase?.skills?.map(s => s.name).join(', ') || 'React, Next.js, Node.js, MongoDB'}

CERTIFICATES:
${knowledgeBase?.certificates?.map(c => c.title).join(', ') || 'Various technical certifications.'}

BLOG POSTS:
${knowledgeBase?.blog?.map(p => `- ${p.title}`).join('\n') || 'No blog posts yet.'}

GUIDELINES:
- Be professional, friendly, and helpful.
- If a user asks something very specific that you don't know based on the info above, politely suggest they contact ${ownerInfo.name} via the Contact Me page.
- You can respond in both English and Arabic as needed.
- Keep responses concise and focused on the portfolio content.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.content
    })),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { message, sessionId, userEmail, userName, knowledgeBase } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Message and sessionId are required' }, { status: 400 });
    }

    await connectDB();

    // Fetch history for context (last 5 messages)
    const history = await ChatMessage.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // Reverse to get chronological order for the model
    const chronologicalHistory = history.reverse();

    const userMsg = await ChatMessage.create({
      sessionId,
      role: 'user',
      content: message,
      userEmail,
      userName,
      status: 'answered'
    });

    let aiResponse = await getGroqResponse(message, chronologicalHistory, knowledgeBase);
    let isQuestion = false;
    
    if (!aiResponse) {
      isQuestion = true;
      aiResponse = "I'm having trouble connecting to my brain right now, but I've recorded your message. Abdelaziz will get back to you soon! Please leave your email if you haven't already.";
    }

    const aiMsg = await ChatMessage.create({
      sessionId,
      role: 'model',
      content: aiResponse,
      userEmail,
      userName,
      status: isQuestion ? 'pending' : 'answered',
      isQuestion: isQuestion,
      questionId: isQuestion ? userMsg._id : null
    });

    return NextResponse.json({
      response: aiResponse,
      messageId: aiMsg._id,
      isQuestion,
      needsEmail: isQuestion && !userEmail
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'SessionId is required' }, { status: 400 });
    }

    await connectDB();

    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).lean();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
