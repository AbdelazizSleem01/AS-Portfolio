import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import connectDB from '../../../../../lib/mongodb';
import Project from '../../../../../models/Project';
import sanitizeHtml from 'sanitize-html';

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
    const dbPromise = connectDB();
    const formData = await req.formData();

    // Early validation
    const requiredFields = ['title', 'description', 'category'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        throw new Error(`${field} is required`);
      }
    }

    // Process data in parallel
    const [existingProject, sanitizedDescription] = await Promise.all([
      Project.findById(id),
      sanitizeHtml(formData.get('description'), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'mark', 'u']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          span: ['style', 'class'],
          img: ['src', 'alt', 'width', 'height']
        }
      })
    ]);

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // File processing
    const imageFile = formData.get('image');
    const videoFile = formData.get('video');

    const [imageResult, videoResult] = await Promise.all([
      imageFile?.arrayBuffer().then(buffer =>
        put(`projectsImages/${Date.now()}-${imageFile.name}`, Buffer.from(buffer), {
          access: 'public',
          contentType: imageFile.type
        })
      ),
      videoFile?.arrayBuffer().then(buffer =>
        put(`projectsVideos/${Date.now()}-${videoFile.name}`, Buffer.from(buffer), {
          access: 'public',
          contentType: videoFile.type
        })
      )
    ]);

    // Prepare update data
    const updateData = {
      title: formData.get('title'),
      description: sanitizedDescription,
      liveLink: formData.get('liveLink'),
      githubLink: formData.get('githubLink'),
      category: formData.get('category'),
      ...(imageResult && { imageUrl: imageResult.url }),
      ...(videoResult && { videoLink: videoResult.url })
    };

    // Delete old files after successful uploads
    const deletionPromises = [];
    if (imageResult && existingProject.imageUrl) {
      deletionPromises.push(del(existingProject.imageUrl));
    }
    if (videoResult && existingProject.videoLink) {
      deletionPromises.push(del(existingProject.videoLink));
    }
    await Promise.all(deletionPromises);

    // Update database
    await dbPromise;
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ project: updatedProject }, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const project = await Project.findByIdAndDelete(id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Parallel file deletions
    await Promise.all([
      project.imageUrl ? del(project.imageUrl) : null,
      project.videoLink ? del(project.videoLink) : null
    ]);

    return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}