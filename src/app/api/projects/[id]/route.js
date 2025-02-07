import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '../../../../../lib/mongodb';
import Project from '../../../../../models/Project';

const uploadsDir = path.join(process.cwd(), 'public/uploads');

const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');

export async function GET(req, { params }) {
    // Destructure `id` directly from `params`

    try {
        const { id } = await params;
        await connectDB();
        console.log("Already connected to MongoDB");

        // Fetch the project by `id`
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
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

        if (imageFile) {
            const imageFilename = `${Date.now()}-${imageFile.name}`;
            const imagePath = path.join(imagesDir, imageFilename);
            const imageBuffer = await imageFile.arrayBuffer();
            fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
            updateData.imageUrl = `/uploads/images/${imageFilename}`;
        }

        if (videoFile) {
            const videoFilename = `${Date.now()}-${videoFile.name}`;
            const videoPath = path.join(videosDir, videoFilename);
            const videoBuffer = await videoFile.arrayBuffer();
            fs.writeFileSync(videoPath, Buffer.from(videoBuffer));
            updateData.videoLink = `/uploads/videos/${videoFilename}`;
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project updated successfully', project: updatedProject }, { status: 200 });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}


// DELETE

export async function DELETE(req, { params }) {

    try {
        const { id } = await params;
        await connectDB();

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}