import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Experience from "../../../../../models/Experience";

export async function PUT(req) {
  try {
    const { experiences } = await req.json();

    if (!Array.isArray(experiences)) {
      throw new Error("Invalid experiences data");
    }

    await connectDB();

    // Bulk update experiences order
    const updatePromises = experiences.map((exp, index) =>
      Experience.findByIdAndUpdate(exp._id, { order: index })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Experiences reordered successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to reorder experiences" },
      { status: 500 }
    );
  }
}
