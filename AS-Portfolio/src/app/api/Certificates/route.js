import { NextResponse } from 'next/server';
import { put } from '@vercel/blob'; 
import connectDB from '../../../../lib/mongodb';
import Certificate from '../../../../models/Certificate';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const imageFile = formData.get('image');

    if (!imageFile) {
      throw new Error('Image upload failed. Make sure an image file is provided.');
    }

    // Handle Image Upload to Vercel Blob
    const { url: imageUrl } = await put(
      `CertificatesImages/${Date.now()}-${imageFile.name}`,
      Buffer.from(await imageFile.arrayBuffer()), 
      {
        access: 'public',
        contentType: imageFile.type, 
      }
    );

    // Connect to MongoDB and save certificate
    await connectDB();
    const newCertificate = await Certificate.create({
      title,
      imageUrl,
    });

    return NextResponse.json(
      { message: 'Certificate Created Successfully', Certificate: newCertificate },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/Certificates:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Certificate' },
      { status: 500 }
    );
  }
}

// GET function (unchanged)
export async function GET(req) {
  try {
    await connectDB();

    const certificates = await Certificate.find({});

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error in GET /api/Certificates:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}