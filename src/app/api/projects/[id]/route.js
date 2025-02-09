import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob'; // Import Vercel Blob methods
import connectDB from '../../../../../lib/mongodb';
import Project from '../../../../../models/Project';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    // Fetch the project by `id`
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const liveLink = formData.get('liveLink');
    const githubLink = formData.get('githubLink');
    const videoFile = formData.get('video');
    const imageFile = formData.get('image');

    const updateData = { title, description, liveLink, githubLink };

    // Fetch the existing project to check for old files
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Handle Image Upload to Vercel Blob
    if (imageFile) {
      const { url: imageUrl } = await put(
        `projectsImages/${Date.now()}-${imageFile.name}`,
        Buffer.from(await imageFile.arrayBuffer()),
        {
          access: 'public',
          contentType: imageFile.type,
        }
      );

      updateData.imageUrl = imageUrl;

      // Delete the old image from Vercel Blob
      if (existingProject.imageUrl) {
        await del(existingProject.imageUrl);
      }
    }

    // Handle Video Upload to Vercel Blob
    if (videoFile) {
      const { url: videoUrl } = await put(
        `projectsVideos/${Date.now()}-${videoFile.name}`,
        Buffer.from(await videoFile.arrayBuffer()),
        {
          access: 'public',
          contentType: videoFile.type,
        }
      );

      updateData.videoLink = videoUrl;

      // Delete the old video from Vercel Blob
      if (existingProject.videoLink) {
        await del(existingProject.videoLink);
      }
    }

    // Update the project in MongoDB
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json(
      { message: 'Project updated successfully', project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    // Fetch the project to check for associated files
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete the associated image from Vercel Blob
    if (deletedProject.imageUrl) {
      await del(deletedProject.imageUrl);
    }

    // Delete the associated video from Vercel Blob
    if (deletedProject.videoLink) {
      await del(deletedProject.videoLink);
    }

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}