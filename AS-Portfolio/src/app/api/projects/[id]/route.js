import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import connectDB from '../../../../../lib/mongodb';
import Project from '../../../../../models/Project';
import sanitizeHtml from 'sanitize-html';

// Configuration constants
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const project = await Project.findById(id).lean();
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    return NextResponse.json(project);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    // Validate required fields
    const requiredFields = ['title', 'description', 'category'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Process form data
    const title = formData.get('title');
    const rawDescription = formData.get('description');
    const category = formData.get('category');
    const liveLink = formData.get('liveLink');
    const githubLink = formData.get('githubLink');
    const imageFile = formData.get('image');
    const videoFile = formData.get('video');
    const videoLink = formData.get('videoLink');

    // Connect to database
    await connectDB();

    // Fetch existing project
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
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
          // white space
          'white-space': [
            /^normal$/,
            /^nowrap$/,
            /^pre$/,
            /^pre-wrap$/,
            /^pre-line$/,
            /^inherit$/,
          ],
          'break-word': [
            /^normal$/,
            /^all$/,
            /^strict$/,
            /^page$/,
            /^inherit$/,
          ],
          // break line
          
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
    // Handle image upload
    let imageUrl = existingProject.imageUrl;
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > MAX_IMAGE_SIZE) {
        throw new Error('Image size exceeds 5MB limit');
      }
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        throw new Error('Invalid image file type');
      }

      // Delete old image if it exists
      if (existingProject.imageUrl) {
        await del(existingProject.imageUrl);
      }

      // Upload new image
      const imageUploadResult = await put(`projects/images/${Date.now()}-${imageFile.name}`, imageFile.stream(), {
        access: 'public',
        contentType: imageFile.type,
      });
      imageUrl = imageUploadResult.url;
    }

    // Handle video upload or URL
    let uploadedVideoLink = videoLink || existingProject.videoLink;
    if (!videoLink && videoFile && videoFile.size > 0) {
      if (videoFile.size > MAX_VIDEO_SIZE) {
        throw new Error('Video size exceeds 100MB limit');
      }
      if (!ALLOWED_VIDEO_TYPES.includes(videoFile.type)) {
        throw new Error('Invalid video file type');
      }

      // Delete old video if it exists
      if (existingProject.videoLink) {
        await del(existingProject.videoLink);
      }

      // Upload new video
      const videoUploadResult = await put(`projects/videos/${Date.now()}-${videoFile.name}`, videoFile.stream(), {
        access: 'public',
        contentType: videoFile.type,
      });
      uploadedVideoLink = videoUploadResult.url;
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      category,
      liveLink,
      githubLink,
      imageUrl,
      videoLink: uploadedVideoLink,
    };

    // Update project in database
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(
      { message: 'Project updated', project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Delete

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}