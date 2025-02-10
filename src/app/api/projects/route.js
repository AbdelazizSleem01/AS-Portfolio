import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectDB from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import sanitizeHtml from 'sanitize-html';

// Configuration constants
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'image', 'category'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Process form data
    const title = formData.get('title');
    const rawDescription = formData.get('description');
    const imageFile = formData.get('image');
    const videoFile = formData.get('video');
    const category = formData.get('category');

    // Validate file sizes and types
    if (imageFile.size > MAX_IMAGE_SIZE) {
      throw new Error('Image size exceeds 5MB limit');
    }
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      throw new Error('Invalid image file type');
    }

    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > MAX_VIDEO_SIZE) {
        throw new Error('Video size exceeds 50MB limit');
      }
      if (!ALLOWED_VIDEO_TYPES.includes(videoFile.type)) {
        throw new Error('Invalid video file type');
      }
    }

    // Sanitize HTML description
    const description = sanitizeHtml(rawDescription, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'img', 'h1-h6', 'div', 'br'],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt']
      },
      allowedIframeHostnames: ['www.youtube.com']
    });

    // Connect to database early
    await connectDB();

    // Prepare upload promises
    const uploadPromises = [
      put(`projects/images/${Date.now()}-${imageFile.name}`, 
        imageFile.stream(), 
        { access: 'public', contentType: imageFile.type }
      )
    ];

    if (videoFile && videoFile.size > 0) {
      uploadPromises.push(
        put(`projects/videos/${Date.now()}-${videoFile.name}`, 
          videoFile.stream(), 
          { access: 'public', contentType: videoFile.type }
        )
      );
    }

    // Execute uploads in parallel
    const [imageResult, videoResult] = await Promise.all(uploadPromises);

    // Create project record
    const newProject = await Project.create({
      title,
      description,
      imageUrl: imageResult.url,
      videoUrl: videoResult?.url || null,
      category,
      liveLink: formData.get('liveLink'),
      githubLink: formData.get('githubLink')
    });

    return NextResponse.json(
      { message: 'Project created', project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Optimized GET handler
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}