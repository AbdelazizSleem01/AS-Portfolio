import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Feedback from "../../../../../models/Feedback";
import fs from "fs";
import path from "path";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
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
      // Remove leading slash to ensure correct path construction
      const sanitizedImageUrl = feedback.imageUrl.startsWith('/')
        ? feedback.imageUrl.slice(1)
        : feedback.imageUrl;
      const imagePath = path.join(process.cwd(), "public", sanitizedImageUrl);

      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Image deleted successfully:", imagePath);
        }
      } catch (err) {
        console.error("Error deleting image file:", err);
        // Proceed to delete the feedback even if image deletion fails
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