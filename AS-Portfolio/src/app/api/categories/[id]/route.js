import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Category from '../../../../../models/Category';

// GET a single category by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } =await params;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch category" }, { status: 500 });
  }
}

// PUT (update) a category by ID
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Category updated successfully.", category: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}