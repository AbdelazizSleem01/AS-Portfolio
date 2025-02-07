import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import fs from 'fs';
import path from 'path';
import sanitizeHtml from 'sanitize-html';

const uploadsDir = path.join(process.cwd(), 'public/uploads');
const imagesDir = path.join(uploadsDir, '/images/projectsImages');
const videosDir = path.join(uploadsDir, 'videos');

fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(videosDir, { recursive: true });

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
            throw new Error("Title, description, image, and category are required.");
        }

        const description = sanitizeHtml(rawDescription, {
            allowedTags: [
                'b', 'i', 'em', 'strong', 'a', 'p', 'span', 'img',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'br', 'u', 'mark' // Added 'u' for underline and 'mark' for highlight
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
                mark: ['style', 'class'], // Allow 'mark' for highlights
                u: ['style', 'class'], // Allow 'u' for underline
            },
            allowedStyles: {
                '*': {
                    'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
                    'font-size': [/^[0-9]+(px|em|%)$/],
                    'line-height': [/^[0-9]+(px|em|%)$/],
                    'color': [/^#[0-9A-Fa-f]{6}$/, /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/],
                    'background-color': [/^#[0-9A-Fa-f]{6}$/, /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/],
                    'text-decoration': [/^underline$/], // Allow underline
                    
                },
            },
        });

        // Handle Image Upload
        const imageFilename = `${Date.now()}-${imageFile.name}`;
        const imagePath = path.join(imagesDir, imageFilename);

        const imageBuffer = await imageFile.arrayBuffer();
        fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
        const imageUrl = `/uploads/images/projectsImages/${imageFilename}`;

        // Handle Video Upload (if provided)
        let videoUrl = null;
        if (videoFile) {
            const videoFilename = `${Date.now()}-${videoFile.name}`;
            const videoPath = path.join(videosDir, videoFilename);

            const videoBuffer = await videoFile.arrayBuffer();
            fs.writeFileSync(videoPath, Buffer.from(videoBuffer));
            videoUrl = `/uploads/videos/${videoFilename}`;
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
            { message: "Project Created Successfully", project: newProject },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /api/projects:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create project" },
            { status: 500 }
        );
    }
}

// Get All Projects
export async function GET(req) {
    try {
        await connectDB();

        const projects = await Project.find().sort({ createdAt: -1 });

        return NextResponse.json(
            { projects },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET /api/projects:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch projects" },
            { status: 500 }
        );
    }
}