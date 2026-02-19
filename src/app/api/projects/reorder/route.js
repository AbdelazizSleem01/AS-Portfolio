import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Project from "../../../../../models/Project";

export async function PUT(req) {
    try {
        const { projects } = await req.json();

        if (!Array.isArray(projects)) {
            throw new Error("Invalid projects data");
        }

        await connectDB();

        // Bulk update projects order
        const updatePromises = projects.map((project, index) =>
            Project.findByIdAndUpdate(project._id, { order: index })
        );

        await Promise.all(updatePromises);

        return NextResponse.json({ message: "Projects reordered successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to reorder projects" },
            { status: 500 }
        );
    }
}
