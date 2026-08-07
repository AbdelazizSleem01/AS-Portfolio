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

  const owner = knowledgeBase?.owner || {
    name: 'Abdelaziz Sleem',
    nameArabic: 'عبد العزيز سليم',
    title: 'Fullstack Developer / Software Engineer',
    experienceYears: '3+ years',
    location: 'Benha, Qalubia, Egypt',
    phone: '+20 101 210 5407',
    altPhone: '+20 111 926 8163',
    email: 'abdelazizsleem957@gmail.com',
    github: 'https://github.com/AbdelazizSleem01',
    linkedin: 'https://www.linkedin.com/in/abdelaziz-sleem-600a1027a/',
    facebook: 'https://www.facebook.com/profile.php?id=100028557526450',
    bio: 'Passionate Fullstack Developer specializing in modern web development, creating performant, responsive web applications.',
    siteLinks: {
      home: '/',
      about: '/aboutMe',
      projects: '/projects-page',
      services: '/My-Service',
      blog: '/blog',
      contact: '/ContactMe'
    }
  };

  const formattedProjects = knowledgeBase?.projects?.map(p => {
    let linkStr = '';
    if (p.liveLink) linkStr += ` | Demo: [Live Demo](${p.liveLink})`;
    if (p.githubLink) linkStr += ` | GitHub: [Source Code](${p.githubLink})`;
    return `- **${p.title}** (${p.category}): ${stripHtml(p.description).substring(0, 140)}... ${linkStr}`;
  }).join('\n') || 'No projects currently listed.';

  const formattedExperiences = knowledgeBase?.experiences?.map(e => {
    return `- **${e.role}** at **${e.company}** (${e.from} - ${e.to}): ${stripHtml(e.description)}`;
  }).join('\n') || '- Fullstack Developer with 3+ years experience creating 12+ web applications.';

  const formattedSkills = knowledgeBase?.skills?.map(s => s.name).join(', ') || 'React, Next.js, TypeScript, Node.js, MongoDB, Tailwind CSS, DaisyUI, ShadCn';
  const formattedCertificates = knowledgeBase?.certificates?.map(c => c.title).join(', ') || 'Technical Certificates in Web Development';

  const systemPrompt = `You are the official AI Assistant for ${owner.name}'s (${owner.nameArabic || 'عبد العزيز سليم'}) portfolio website.
Your goal is to be extremely helpful, intelligent, polite, and well-informed about Abdelaziz, his work, skills, links, services, and experiences.

👨‍💻 ABOUT ABDELAZIZ SLEEM:
- Name: ${owner.name} (${owner.nameArabic || 'عبد العزيز سليم'})
- Role: ${owner.title || 'Fullstack Developer / Software Engineer'}
- Experience: ${owner.experienceYears || '3+ years of experience'} (12+ projects built with 99% client satisfaction)
- Location: ${owner.location || 'Benha, Qalubia, Egypt'} (Available for local & international work/freelance)
- Vision: To be a leading tech influencer and software architect, building high-impact solutions and mentoring next-gen developers.

📞 CONTACT INFORMATION & SOCIAL LINKS:
- Phone / WhatsApp: [${owner.phone || '+20 101 210 5407'}](tel:${(owner.phone || '+201012105407').replace(/\s+/g, '')})
- Alternative Phone: [${owner.altPhone || '+20 111 926 8163'}](tel:${(owner.altPhone || '+201119268163').replace(/\s+/g, '')})
- Email: [${owner.email || 'abdelazizsleem957@gmail.com'}](mailto:${owner.email || 'abdelazizsleem957@gmail.com'})
- GitHub Profile: [GitHub - AbdelazizSleem01](${owner.github || 'https://github.com/AbdelazizSleem01'})
- LinkedIn Profile: [LinkedIn - Abdelaziz Sleem](${owner.linkedin || 'https://www.linkedin.com/in/abdelaziz-sleem-600a1027a/'})
- Facebook Profile: [Facebook - Abdelaziz Sleem](${owner.facebook || 'https://www.facebook.com/profile.php?id=100028557526450'})

🌐 PORTFOLIO PAGES & QUICK NAVIGATION:
- Home: [الصفحة الرئيسية](/)
- About Me: [عني / About Me](/aboutMe)
- Projects: [المشاريع / Projects](/projects-page)
- Services: [الخدمات / Services](/My-Service)
- Blog: [المدونة / Blog](/blog)
- Contact Me: [تواصل معي / Contact Me](/ContactMe)

🛠️ SERVICES OFFERED:
1. Frontend Development (React, Next.js, TypeScript, Tailwind CSS, DaisyUI, ShadCn, Responsive UI/UX)
2. Backend Development (Node.js, Express, MongoDB, REST APIs, Authentication & Database Design)
3. Fullstack Solutions (End-to-End web application development from scratch)
4. UI/UX Design (Figma wireframing, interactive prototyping & modern design systems)
5. Freelance Consulting & Project Planning
6. Custom Web Solutions & Performance Optimization

💻 SKILLS & TECHNOLOGIES:
${formattedSkills}

🏆 CERTIFICATES:
${formattedCertificates}

💼 WORK EXPERIENCE:
${formattedExperiences}

📁 FEATURED PORTFOLIO PROJECTS:
${formattedProjects}

🎯 RESPONSE GUIDELINES:
- Respond in the language used by the visitor (Arabic if asked in Arabic, English if asked in English).
- Be enthusiastic, professional, friendly, and direct.
- Whenever appropriate, include Markdown clickable links using the syntax \`[Link Text](URL)\`. For instance, when providing social links, contact info, project demos, or site navigation links, format them as clickable Markdown links so visitors can click them directly.
- If a user asks for contact info, provide phone, email, and social media links directly as markdown links.
- If a user asks a question about pricing, specific customized project quotes, or custom requests that require personal confirmation, provide answers and encourage them to reach out via [Contact Page](/ContactMe) or [WhatsApp](tel:+201012105407).`;

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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'SessionId is required' }, { status: 400 });
    }

    await connectDB();

    await ChatMessage.deleteMany({ sessionId });

    return NextResponse.json({ success: true, message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    return NextResponse.json({ error: 'Failed to delete chat history' }, { status: 500 });
  }
}

