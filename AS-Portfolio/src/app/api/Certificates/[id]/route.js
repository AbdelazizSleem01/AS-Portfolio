import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob'; // Import Vercel Blob methods
import connectDB from '../../../../../lib/mongodb';
import Certificate from '../../../../../models/Certificate';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
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

    // Fetch the existing certificate to check for old image
    const existingCertificate = await Certificate.findById(id);
    if (!existingCertificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Handle Image Upload to Vercel Blob
    if (imageFile) {
      const { url: imageUrl } = await put(
        `CertificatesImages/${Date.now()}-${imageFile.name}`,
        Buffer.from(await imageFile.arrayBuffer()),
        {
          access: 'public',
          contentType: imageFile.type,
        }
      );

      updateData.imageUrl = imageUrl;

      if (existingCertificate.imageUrl) {
        await del(existingCertificate.imageUrl);
      }
    }

    // Update the certificate in MongoDB
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json(
      { message: 'Certificate updated successfully', certificate: updatedCertificate },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating Certificate:', error);
    return NextResponse.json(
      { error: 'Failed to update Certificate' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    // Fetch the certificate to check for associated image
    const deletedCertificate = await Certificate.findByIdAndDelete(id);

    if (!deletedCertificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Delete the associated image from Vercel Blob
    if (deletedCertificate.imageUrl) {
      await del(deletedCertificate.imageUrl);
    }

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