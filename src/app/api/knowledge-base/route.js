import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import Skill from '../../../../models/Skills';
import Certificate from '../../../../models/Certificate';
import Category from '../../../../models/Category';
import Header from '../../../../models/Header';
import Post from '../../../../models/Post';
import Experience from '../../../../models/Experience';

export async function GET() {
  try {
    await connectDB();

    // Fetch all data from database
    const [projects, skills, certificates, posts, categories, headers, experiences] = await Promise.all([
      Project.find({}).populate('category', 'name').lean(),
      Skill.find({}).lean(),
      Certificate.find({}).lean(),
      Post.find({}).select('title content excerpt tags').lean(),
      Category.find({}).lean(),
      Header.find({}).lean(),
      Experience.find({}).sort({ order: 1 }).lean(),
    ]);

    // Format knowledge base for AI
    const knowledgeBase = {
      owner: {
        name: "Abdelaziz Sleem",
        nameArabic: "عبد العزيز سليم",
        title: "Fullstack Developer / Software Engineer",
        experienceYears: "3+ years",
        location: "Benha, Qalubia, Egypt",
        phone: "+20 101 210 5407",
        altPhone: "+20 111 926 8163",
        email: "abdelazizsleem957@gmail.com",
        github: "https://github.com/AbdelazizSleem01",
        linkedin: "https://www.linkedin.com/in/abdelaziz-sleem-600a1027a/",
        facebook: "https://www.facebook.com/profile.php?id=100028557526450",
        bio: "Passionate Fullstack Developer with 3+ years of experience crafting responsive, performant web applications. Dedicated to delivering innovative tech solutions, mentoring developers, and providing high quality freelance services globally.",
        services: [
          "Frontend Development (React, Next.js, TypeScript, Tailwind CSS, DaisyUI, ShadCn)",
          "Backend Development (Node.js, Express, MongoDB, RESTful APIs, Auth & Security)",
          "Fullstack Solutions (End-to-end web application design & development)",
          "UI/UX Design (Figma wireframing, interactive prototyping & design-to-code)",
          "Freelance Consulting & Technical Guidance",
          "Custom Web Solutions & Maintenance"
        ],
        siteLinks: {
          home: "/",
          about: "/aboutMe",
          projects: "/projects-page",
          services: "/My-Service",
          blog: "/blog",
          contact: "/ContactMe"
        }
      },
      projects: projects.map(p => ({
        title: p.title,
        description: p.description,
        category: p.category?.name || 'General',
        liveLink: p.liveLink,
        githubLink: p.githubLink,
        videoLink: p.videoLink,
        imageUrl: p.imageUrl
      })),
      skills: skills.map(s => ({
        name: s.name,
        imageUrl: s.imageUrl
      })),
      certificates: certificates.map(c => ({
        title: c.title,
        imageUrl: c.imageUrl
      })),
      experiences: experiences.map(e => ({
        company: e.company,
        role: e.role,
        from: e.from,
        to: e.to,
        current: e.current,
        description: e.description
      })),
      blog: posts.map(p => ({
        title: p.title,
        excerpt: p.excerpt,
        tags: p.tags
      })),
      categories: categories.map(c => c.name),
      headers: headers.map(h => ({
        title: h.title,
        subtitle: h.subtitle,
        description: h.description
      }))
    };

    return NextResponse.json(knowledgeBase);
  } catch (error) {
    console.error('Knowledge base error:', error);
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 });
  }
}

