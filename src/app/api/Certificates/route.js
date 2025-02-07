// post fun 

import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import fs from 'fs';
import path from 'path';
import Certificate from '../../../../models/Certificate';

const uploadsDir = path.join(process.cwd(), 'public/uploads');

const imagesDir = path.join(uploadsDir, '/images/CertificatesImages');

fs.mkdirSync(imagesDir, { recursive: true });

export async function POST(req) {
    try {
        const formData = await req.formData();
        const title = formData.get('title');
        const imageFile = formData.get('image');

        if (!imageFile) {
            throw new Error("Image upload failed. Make sure an image file is provided.");
        }

        // Handle Image Upload
        const imageFilename = `${Date.now()}-${imageFile.name}`;
        const imagePath = path.join(imagesDir, imageFilename);

        const imageBuffer = await imageFile.arrayBuffer();
        fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
        const imageUrl = `/uploads/images/CertificatesImages/${imageFilename}`;


        await connectDB();

        const newCertificate = await Certificate.create({
            title,
            imageUrl,
        });

        return NextResponse.json(
            { message: "Certificate Created Successfully", Certificate: newCertificate },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /api/Certificates:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create Certificate" },
            { status: 500 }
        );
    }
}

// get all Certificate

export async function GET(req) {
    try {
        await connectDB();

        const certificates = await Certificate.find({});

        return NextResponse.json(certificates);
    } catch (error) {
        console.error("Error in GET /api/Certificates:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch certificates" },
            { status: 500 }
        );
    }
}