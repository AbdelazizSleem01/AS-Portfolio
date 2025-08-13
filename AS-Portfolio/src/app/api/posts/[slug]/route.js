import { NextResponse } from "next/server";
import Post from "../../../../../models/Post";
import connectDB from "../../../../../lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findOne({ slug }).lean();

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Properly await the params destructuring
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedPost = await Post.findOneAndDelete({ slug });

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Post deleted successfully",
      deletedSlug: slug
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}