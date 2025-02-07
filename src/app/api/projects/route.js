import { NextResponse } from 'next/server';
import { put } from '@vercel/blob'; // Import Vercel Blob's put method
import connectDB from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import sanitizeHtml from 'sanitize-html';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const rawDescription = formData.get('description');
    const liveLink = formData.get('liveLink');
    const githubLink = formData.get('githubLink');
    const videoFile = formData.get('video');
    const imageFile = formData.get('image');
    const category = formData.get('category');

    if (!title || !rawDescription || !imageFile || !category) {
      throw new Error('Title, description, image, and category are required.');
    }

    // Sanitize HTML description
    const description = sanitizeHtml(rawDescription, {
      allowedTags: [
        'b',
        'i',
        'em',
        'strong',
        'a',
        'p',
        'span',
        'img',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'div',
        'br',
        'u',
        'mark',
      ],
      allowedAttributes: {
        span: ['style', 'class'],
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height'],
        p: ['style', 'class'],
        h1: ['style', 'class'],
        h2: ['style', 'class'],
        h3: ['style', 'class'],
        h4: ['style', 'class'],
        h5: ['style', 'class'],
        h6: ['style', 'class'],
        div: ['style', 'class'],
        mark: ['style', 'class'],
        u: ['style', 'class'],
      },
      allowedStyles: {
        '*': {
          'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
          'font-size': [/^[0-9]+(px|em|%)$/],
          'line-height': [/^[0-9]+(px|em|%)$/],
          color: [
            /^#[0-9A-Fa-f]{6}$/,
            /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
          ],
          'background-color': [
            /^#[0-9A-Fa-f]{6}$/,
            /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
          ],
          'text-decoration': [/^underline$/],
        },
      },
    });

    // Handle Image Upload to Vercel Blob
    const { url: imageUrl } = await put(
      `projectsImages/${Date.now()}-${imageFile.name}`, 
      Buffer.from(await imageFile.arrayBuffer()), 
      {
        access: 'public', 
        contentType: imageFile.type, 
      }
    );

    // Handle Video Upload to Vercel Blob (if provided)
    let videoUrl = null;
    if (videoFile) {
      const { url } = await put(
        `projectsVideos/${Date.now()}-${videoFile.name}`, 
        Buffer.from(await videoFile.arrayBuffer()), 
        {
          access: 'public', 
          contentType: videoFile.type, 
        }
      );
      videoUrl = url;
    }

    // Connect to DB and save project
    await connectDB();

    const newProject = await Project.create({
      title,
      description,
      liveLink,
      githubLink,
      videoLink: videoUrl,
      imageUrl,
      category,
    });

    return NextResponse.json(
      { message: 'Project Created Successfully', project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}

// Get All Projects
export async function GET(req) {
  try {
    await connectDB();

    const projects = await Project.find().sort({ createdAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}