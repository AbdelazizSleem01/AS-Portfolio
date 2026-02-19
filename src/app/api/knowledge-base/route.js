import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import Skill from '../../../../models/Skills';
import Certificate from '../../../../models/Certificate';
import Category from '../../../../models/Category';
import Header from '../../../../models/Header';
import Post from '../../../../models/Post';


export async function GET() {
  try {
    await connectDB();

    // Fetch all data from database
    const [projects, skills, certificates, posts, categories, headers] = await Promise.all([
      Project.find({}).populate('category', 'name').lean(),
      Skill.find({}).lean(),
      Certificate.find({}).lean(),
      Post.find({}).select('title content excerpt tags').lean(),
      Category.find({}).lean(),
      Header.find({}).lean(),
    ]);

    // Format knowledge base for AI
    const knowledgeBase = {
      owner: {
        name: "Abdelaziz Sleem",
        title: "Full Stack Developer",
        description: "Professional portfolio website showcasing projects, skills, and certificates"
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
