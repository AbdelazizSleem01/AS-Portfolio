import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '../../../../../lib/mongodb';
import Certificate from '../../../../../models/Certificate';

const uploadsDir = path.join(process.cwd(), 'public/uploads');
const imagesDir = path.join(uploadsDir, 'images/CertificatesImages');

fs.mkdirSync(imagesDir, { recursive: true });

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(certificate, { status: 200 });
  } catch (error) {
    console.error('Error fetching Certificate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Certificate' },
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
    const imageFile = formData.get('image');

    const updateData = { title };

    if (imageFile) {
      const imageFilename = `${Date.now()}-${imageFile.name}`;
      const imagePath = path.join(imagesDir, imageFilename);
      const imageBuffer = await imageFile.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
      updateData.imageUrl = `/uploads/images/CertificatesImages/${imageFilename}`;
    }


    const updatedCertificate= await Certificate.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCertificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Certificate updated successfully',certificate: updatedCertificate }, { status: 200 });
  } catch (error) {
    console.error('Error updating Certificate:', error);
    return NextResponse.json({ error: 'Failed to update Certificate' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {

  try {
    const { id } = await params;
    await connectDB();
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (certificate.imageUrl) {
      const imagePath = path.join(process.cwd(), 'public', certificate.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Certificate.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Certificate deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { error: 'Failed to delete certificate' },
      { status: 500 }
    );
  }
}