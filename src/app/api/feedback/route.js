import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Feedback from '../../../../models/Feedback';
import fs from 'fs';
import path from 'path';

// Define the directory for storing feedback images
const uploadsDir = path.join(process.cwd(), 'public/uploads');
const imagesDir = path.join(uploadsDir, 'images/FeedbackImages');

// Ensure the directory exists
fs.mkdirSync(imagesDir, { recursive: true });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const comment = formData.get('comment');
    const rating = formData.get('rating');
    const imageFile = formData.get('image');

    // Validate required fields
    if (!name || !email || !comment || !rating || !imageFile) {
      throw new Error("All fields are required, including the image.");
    }

    // Handle Image Upload
    const imageFilename = `${Date.now()}-${imageFile.name}`;
    const imagePath = path.join(imagesDir, imageFilename);

    // Convert image file to buffer and save it
    const imageBuffer = await imageFile.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(imageBuffer));

    // Generate the URL for the saved image
    const imageUrl = `/uploads/images/FeedbackImages/${imageFilename}`;

    // Connect to MongoDB and save feedback
    await connectDB();
    const newFeedback = await Feedback.create({
      name,
      email,
      comment,
      imageUrl,
      rating: parseInt(rating),
    });

    return NextResponse.json(
      { message: "Feedback Submitted Successfully", feedback: newFeedback },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/feedback:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    // Fetch all feedback from the database
    const feedbacks = await Feedback.find({});

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Error in GET /api/feedback:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}