import { NextResponse } from 'next/server';
import { put } from '@vercel/blob'; // Import Vercel Blob's put method
import connectDB from '../../../../lib/mongodb';
import Post from '../../../../models/Post';

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Function to handle image uploads to Vercel Blob
    const handleImageUpload = async (file) => {
      if (!file) return '';

      try {
        const { url } = await put(
          `posts/${Date.now()}-${file.name}`,
          Buffer.from(await file.arrayBuffer()), 
          {
            access: 'public', 
            contentType: file.type, 
          }
        );

        return url; 
      } catch (error) {
        console.error('File upload error:', error);
        throw new Error('Failed to upload image');
      }
    };

    // Extract form data
    const postData = {
      name: formData.get('name'),
      title: formData.get('title'),
      content: formData.get('content'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      tags: formData.get('tags')
        ? formData.get('tags').split(',').map((tag) => tag.trim())
        : [],
      coverImage: await handleImageUpload(formData.get('coverImage')),
      userImage: await handleImageUpload(formData.get('userImage')),
    };

    // Validate required fields
    const requiredFields = [ 'name','title', 'slug', 'content'];
    const missingFields = requiredFields.filter((field) => !postData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if the slug already exists
    const existingPost = await Post.findOne({ slug: postData.slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Create a new post
    const newPost = await Post.create(postData);

    return NextResponse.json(
      {
        post: {
          ...newPost._doc,
          _id: newPost._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to create post',
        details: error.details || null,
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
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}