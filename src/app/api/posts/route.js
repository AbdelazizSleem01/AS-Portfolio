import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const handleImageUpload = async (file) => {
      if (!file) return '';

      try {
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        const imagesDir = path.join(uploadsDir, 'images/posts');

        await fs.mkdir(imagesDir, { recursive: true });

        const imageFilename = `${Date.now()}-${file.name}`;
        const imagePath = path.join(imagesDir, imageFilename);
        const imageBuffer = await file.arrayBuffer();

        await fs.writeFile(imagePath, Buffer.from(imageBuffer));

        return `/uploads/images/posts/${imageFilename}`;
      } catch (error) {
        console.error('File upload error:', error);
        throw new Error('Failed to upload image');
      }
    };

    const postData = {
      email: formData.get('email'),
      title: formData.get('title'),
      content: formData.get('content'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
      coverImage: await handleImageUpload(formData.get('coverImage')),
      userImage: await handleImageUpload(formData.get('userImage'))
    };

    const requiredFields = ['email', 'title', 'slug', 'content'];
    const missingFields = requiredFields.filter(field => !postData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(postData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingPost = await Post.findOne({ slug: postData.slug });
    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const newPost = await Post.create(postData);

    return NextResponse.json(
      {
        post: {
          ...newPost._doc,
          _id: newPost._id.toString()
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create post",
        details: error.details || null
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}