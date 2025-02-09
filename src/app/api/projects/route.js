import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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

    // Start DB connection early
    const dbPromise = connectDB();

    // Sanitize HTML description
    const description = sanitizeHtml(rawDescription, {
      allowedTags: [
        'b', 'i', 'em', 'strong', 'a', 'p', 'span', 'img',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'br', 'u', 'mark'
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

    // Process files in parallel
    const [imageResult, videoResult] = await Promise.all([
      (async () => {
        const buffer = await imageFile.arrayBuffer();
        return put(
          `projectsImages/${Date.now()}-${imageFile.name}`,
          Buffer.from(buffer),
          { access: 'public', contentType: imageFile.type }
        );
      })(),
      videoFile ? (async () => {
        const buffer = await videoFile.arrayBuffer();
        return put(
          `projectsVideos/${Date.now()}-${videoFile.name}`,
          Buffer.from(buffer),
          { access: 'public', contentType: videoFile.type }
        );
      })() : null
    ]);

    // Wait for DB connection
    await dbPromise;

    const newProject = await Project.create({
      title,
      description,
      liveLink,
      githubLink,
      videoLink: videoResult?.url || null,
      imageUrl: imageResult.url,
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

export async function GET() {
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