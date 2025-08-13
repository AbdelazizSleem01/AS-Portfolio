import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Feedback from "../../../../../models/Feedback";


export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400 }
      );
    }

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    if (feedback.imageUrl) {
      try {
        await del(feedback.imageUrl);
        console.log('Image deleted successfully from Vercel Blob:', feedback.imageUrl);
      } catch (err) {
        console.error('Error deleting image from Vercel Blob:', err);
      }
    }


    await Feedback.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Feedback deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/feedback/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}