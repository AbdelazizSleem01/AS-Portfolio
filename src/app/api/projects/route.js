import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectDB from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import sanitizeHtml from 'sanitize-html';

let dbConnection;
async function getDBConnection() {
  if (!dbConnection) {
    dbConnection = await connectDB();
  }
  return dbConnection;
}

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

    if (!title?.trim() || !rawDescription?.trim() || !imageFile || !category?.trim()) {
      return NextResponse.json({ error: 'Title, description, image, and category are required.' }, { status: 400 });
    }

    const dbPromise = getDBConnection();

    const description = sanitizeHtml(rawDescription, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'span', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'br', 'u', 'mark'],
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
          color: [/^#[0-9A-Fa-f]{6}$/, /^rgb\((\s*\d{1,3}%?,\s*){2}\d{1,3}%?\)$/],
          'background-color': [/^#[0-9A-Fa-f]{6}$/, /^rgb\((\s*\d{1,3}%?,\s*){2}\d{1,3}%?\)$/],
          'text-decoration': [/^underline$/],
        },
      },
    });

    const [imageResult, videoResult] = await Promise.all([
      (async () => {
        if (!imageFile.type.startsWith('image/')) {
          throw new Error('Invalid image format.');
        }
        const buffer = await imageFile.arrayBuffer();
        return put(`projectsImages/${Date.now()}-${imageFile.name}`, Buffer.from(buffer), { access: 'public', contentType: imageFile.type });
      })(),
      videoFile ? (async () => {
        if (!videoFile.type.startsWith('video/')) {
          throw new Error('Invalid video format.');
        }
        const buffer = await videoFile.arrayBuffer();
        return put(`projectsVideos/${Date.now()}-${videoFile.name}`, Buffer.from(buffer), { access: 'public', contentType: videoFile.type });
      })() : null,
    ]);

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

    return NextResponse.json({ message: 'Project Created Successfully', project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await getDBConnection();
    const limit = parseInt(req.nextUrl.searchParams.get('limit')) || 10;
    const skip = parseInt(req.nextUrl.searchParams.get('skip')) || 0;

    const projects = await Project.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
