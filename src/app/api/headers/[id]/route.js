import { NextResponse } from 'next/server'; // Add this import
import connectDB from "../../../../../lib/mongodb";
import fs from 'fs';
import path from 'path';
import sanitizeHtml from 'sanitize-html';
import Header from '../../../../../models/Header';

const uploadsDir = path.join(process.cwd(), 'public/uploads');
const imagesDir = path.join(uploadsDir, '/images/HeadersImages');

fs.mkdirSync(imagesDir, { recursive: true });


export async function GET(req, { params }) {
    const { id } = await params;

    try {
        await connectDB();

        const header = await Header.findById(id);

        if (!header) {
            return NextResponse.json({ error: 'Header not found' }, { status: 404 });
        }

        return NextResponse.json(header, { status: 200 });
    } catch (error) {
        console.error('Error fetching header:', error);
        return NextResponse.json({ error: 'Failed to fetch header' }, { status: 500 });
    }
}


export async function PUT(req, { params }) {
    const { id } = params;

    try {
        const formData = await req.formData();
        const title = formData.get('title');
        const rawDescription = formData.get('description');
        const linkedInLink = formData.get('linkedInLink');
        const githubLink = formData.get('githubLink');
        const imageFile = formData.get('image');

        if (!id) {
            throw new Error("Header ID is required for updating.");
        }

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
                    'color': [/^#[0-9A-Fa-f]{6}$/, /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/],
                    'background-color': [/^#[0-9A-Fa-f]{6}$/, /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/],
                    'text-decoration': [/^underline$/],
                },
            },
        });

        await connectDB();

        const existingHeader = await Header.findById(id);
        if (!existingHeader) {
            throw new Error("Header not found.");
        }

        let imageUrl = existingHeader.imageUrl;

        if (imageFile) {
            // Handle Image Upload
            const imageFilename = `${Date.now()}-${imageFile.name}`;
            const imagePath = path.join(imagesDir, imageFilename);

            const imageBuffer = await imageFile.arrayBuffer();
            fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
            imageUrl = `/uploads/images/HeadersImages/${imageFilename}`;

            // Optionally, delete the old image file
            if (existingHeader.imageUrl) {
                const oldImagePath = path.join(uploadsDir, existingHeader.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedHeader = await Header.findByIdAndUpdate(
            id,
            {
                title,
                description,
                linkedInLink,
                githubLink,
                imageUrl,
            },
            { new: true }
        );

        return NextResponse.json(
            { message: "Header Updated Successfully", Header: updatedHeader },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in PUT /api/Headers:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update Header" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        await connectDB();

        const deletedHeader = await Header.findByIdAndDelete(id);

        if (!deletedHeader) {
            return NextResponse.json({ error: 'Header not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Header deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Header:', error);
        return NextResponse.json({ error: 'Failed to delete Header' }, { status: 500 });
    }
}