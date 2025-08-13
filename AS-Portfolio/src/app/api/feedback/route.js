import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Feedback from '../../../../models/Feedback';
import { put } from '@vercel/blob';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const comment = formData.get('comment');
    const rating = formData.get('rating');
    // const imageFile = formData.get('image');

    // Validate required fields
    if (!name || !email || !comment || !rating ) {
      throw new Error("All fields are required");
    }

    // const { url: imageUrl } = await put(
    //   `FeedbackImages/${Date.now()}-${imageFile.name}`, 
    //   Buffer.from(await imageFile.arrayBuffer()), 
    //   {
    //     access: 'public', 
    //     contentType: imageFile.type,
    //   }
    // );

    // Connect to MongoDB and save feedback
    await connectDB();
    const newFeedback = await Feedback.create({
      name,
      email,
      comment,
      // imageUrl,
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