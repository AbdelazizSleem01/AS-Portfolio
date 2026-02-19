import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ChatMessage from '../../../../models/ChatMessage';


// Simple AI response generator based on knowledge base

// Helper function to strip HTML tags
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function generateAIResponse(userMessage, knowledgeBase) {
  const message = userMessage.toLowerCase();
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('السلام') || message.includes('hi there')) {
    return `Hello! Welcome to ${knowledgeBase.owner.name}'s portfolio! I'm here to help you learn about this website and the developer's work. Feel free to ask me anything about projects, skills, certifications, services, or blog posts!`;
  }
  
  // About the developer - Full Info
  if (message.includes('who are you') || message.includes('about you') || message.includes('من انت') || message.includes('عنك') || message.includes('about developer') || message.includes('who is') || message.includes('tell me about')) {
    return `I'm an AI assistant for ${knowledgeBase.owner.name}'s portfolio website.

👨‍💻 ABOUT ABDELAZIZ SLEEM:
• Fullstack Developer with 2.5+ years of experience
• Specializes in modern web technologies
• Created 12+ projects with 99% client satisfaction
• Expert in: React, Next.js, TypeScript, Tailwind CSS, Node.js, MongoDB, DaisyUI, ShadCn
• Vision: To become a leading influencer in tech industry, delivering innovative solutions while mentoring next generation of developers

I can provide information about their projects, skills, certificates, and blog posts. What would you like to know?`;
  }
  
  // Experience & Stats
  if (message.includes('experience') || message.includes('خبرة') || message.includes('years') || message.includes('exp')) {
    return `Abdelaziz Sleem has 2.5+ years of experience as a Fullstack Developer. He has completed 12+ projects with 99% client satisfaction rating. His expertise spans frontend (React, Next.js, TypeScript, Tailwind CSS) and backend (Node.js, MongoDB, REST APIs) development.`;
  }
  
  // Skills & Technologies
  if (message.includes('skill') || message.includes('technology') || message.includes('tech') || message.includes('مهارات') || message.includes('تقنيات') || message.includes('know') || message.includes('stack')) {
    const skills = knowledgeBase.skills;
    if (skills.length > 0) {
      return `The developer has ${skills.length} skill(s): ${skills.map(s => s.name).join(', ')}.

🔧 MAIN TECHNOLOGIES:
• Frontend: React, Next.js, TypeScript, Tailwind CSS
• Backend: Node.js, MongoDB, REST APIs
• Tools: DaisyUI, ShadCn, Git, Figma

Would you like more information about any specific skill?`;
    }
    return "There are currently no skills displayed on the website.";
  }
  
  // Projects
  if (message.includes('project') || message.includes('work') || message.includes('projects') || message.includes('مشاريع') || message.includes('عمل') || message.includes('portfolio')) {
    const projects = knowledgeBase.projects;
    if (projects.length > 0) {
      let response = `The developer has ${projects.length} project(s) in their portfolio:\n\n`;
      projects.forEach((p, i) => {
        const cleanDescription = stripHtml(p.description).substring(0, 80);
        response += `${i + 1}. ${p.title}: ${cleanDescription}...\n`;
      });
      response += `\nWould you like more details about any specific project?`;
      return response;
    }
    return "There are currently no projects displayed on the website.";
  }
  
  // Certificates
  if (message.includes('certificate') || message.includes('certification') || message.includes('شهادة') || message.includes('شهادات')) {
    const certs = knowledgeBase.certificates;
    if (certs.length > 0) {
      let response = `The developer has ${certs.length} certificate(s):\n`;
      certs.forEach((c, i) => {
        response += `${i + 1}. ${c.title}\n`;
      });
      return response;
    }
    return "There are currently no certificates displayed on the website.";
  }
  
  // Blog/Posts
  if (message.includes('blog') || message.includes('post') || message.includes('article') || message.includes('مدونة') || message.includes('مقال')) {
    const posts = knowledgeBase.blog;
    if (posts.length > 0) {
      let response = `The developer has ${posts.length} blog post(s):\n`;
      posts.forEach((p, i) => {
        response += `${i + 1}. ${p.title} - ${p.excerpt ? p.excerpt.substring(0, 80) : 'No description'}...\n`;
      });
      return response;
    }
    return "There are currently no blog posts on the website.";
  }
  
  // Contact
  if (message.includes('contact') || message.includes('email') || message.includes('تواصل') || message.includes('اتصال') || message.includes('hire') || message.includes('توظيف')) {
    return "You can contact the developer through the Contact Me page on this website. Fill out the form and they'll get back to you as soon as possible! You can also hire him for your next project.";
  }
  
  // Services
  if (message.includes('service') || message.includes('services') || message.includes('خدمة') || message.includes('خدمات') || message.includes('what do you do') || message.includes('what can you do')) {
    return `Abdelaziz Sleem offers the following services:

1. 💻 Frontend Development
   - React, Next.js, Tailwind CSS, Bootstrap
   - Responsive Design, UI/UX Optimization

2. 🛠️ Backend Development
   - Node.js, MongoDB
   - RESTful APIs, Database Design, Authentication

3. 🌐 Fullstack Development
   - End-to-End Solutions
   - Performance Optimization, Deployment

4. 🎨 UI/UX Design
   - Figma, Wireframing, Prototyping
   
5. 📈 Freelance Consulting
   - Project Planning, Technical Guidance

6. 🔧 Custom Solutions
   - Tailored Development, Innovative Features

Would you like more details about any specific service?`;
  }
  
  // Categories
  if (message.includes('category') || message.includes('categories') || message.includes('تصنيف') || message.includes('تصنيفات')) {
    if (knowledgeBase.categories.length > 0) {
      return `Project categories: ${knowledgeBase.categories.join(', ')}.`;
    }
    return "There are no categories defined yet.";
  }
  
  // Vision
  if (message.includes('vision') || message.includes('goal') || message.includes(' ambition') || message.includes('رؤية') || message.includes('طموح')) {
    return "Abdelaziz Sleem's vision is to become a leading influencer in the tech industry, delivering innovative solutions while mentoring the next generation of developers through open-source contributions and knowledge sharing.";
  }
  
  // Price/Rate/Hiring
  if (message.includes('price') || message.includes('rate') || message.includes('cost') || message.includes('سعر') || message.includes('تكلفة') || message.includes(' hire ') || message.includes('توظيف')) {
    return "For pricing and hiring information, please contact Abdelaziz Sleem directly through the Contact Me page. He'll be happy to discuss your project requirements and provide a custom quote.";
  }
  
  // Location
  if (message.includes('location') || message.includes('where') || message.includes('موقع') || message.includes(' Egypt ') || message.includes('egypt')) {
    return "Abdelaziz Sleem is based in Egypt and works with clients globally. He's available for remote work and can collaborate with clients from anywhere in the world.";
  }
  
  // Availability
  if (message.includes('available') || message.includes('free') || message.includes('مشغول') || message.includes('متاح')) {
    return "For availability information, please contact Abdelaziz Sleem through the Contact Me page. He'll let you know his current schedule and availability for new projects.";
  }
  
  // Can't find answer
  return null;
}

export async function POST(request) {
  try {
    const { message, sessionId, userEmail, userName, knowledgeBase } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Message and sessionId are required' }, { status: 400 });
    }

    await connectDB();

    const userMsg = await ChatMessage.create({
      sessionId,
      role: 'user',
      content: message,
      userEmail,
      userName,
      status: 'answered'
    });

    let aiResponse = generateAIResponse(message, knowledgeBase);
    let isQuestion = false;
    
    if (!aiResponse) {
      isQuestion = true;
      aiResponse = "Thank you for your question! I'm currently learning and don't have enough information to answer this specific question. The owner will be notified and will respond to you shortly. Please check back later or provide your email for notification!";
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
