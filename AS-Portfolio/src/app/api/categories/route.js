// pages/api/categories/index.js
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Category from '../../../../models/Category';


export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    // Create new category
    const newCategory = await Category.create({ name });
    return NextResponse.json({ message: "Category created successfully.", category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}
