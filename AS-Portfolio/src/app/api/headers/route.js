import { NextResponse } from 'next/server';
import { put } from '@vercel/blob'; // Import Vercel Blob's put method
import connectDB from '../../../../lib/mongodb';
import sanitizeHtml from 'sanitize-html';
import Header from '../../../../models/Header';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const rawDescription = formData.get('description');
    const linkedInLink = formData.get('linkedInLink');
    const githubLink = formData.get('githubLink');
    const imageFile = formData.get('image');

    if (!imageFile) {
      throw new Error('Image upload failed. Make sure an image file is provided.');
    }

    // Sanitize HTML description
    const description = sanitizeHtml(rawDescription, {
      allowedTags: [
        'b',
        'i',
        'em',
        'strong',
        'a',
        'p',
        'span',
        'img',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'div',
        'br',
        'u',
        'mark',
      ],
      allowedAttributes: {
        span: ['style', 'class'],
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height'],
        p: ['style', 'class'],
        h1: ['style', 'class'],
        h2: ['style', 'class'],
        h3: ['style', 'class'],
        h4: ['style', 'class'],
        h5: ['style', 'class'],
        h6: ['style', 'class'],
        div: ['style', 'class'],
        mark: ['style', 'class'],
        u: ['style', 'class'],
      },
      allowedStyles: {
        '*': {
          'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
          'font-size': [/^[0-9]+(px|em|%)$/],
          'line-height': [/^[0-9]+(px|em|%)$/],
          color: [
            /^#[0-9A-Fa-f]{6}$/,
            /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
          ],
          'background-color': [
            /^#[0-9A-Fa-f]{6}$/,
            /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
          ],
          'text-decoration': [/^underline$/],
        },
      },
    });

    // Handle Image Upload to Vercel Blob
    const { url: imageUrl } = await put(
      `HeadersImages/${Date.now()}-${imageFile.name}`,
      Buffer.from(await imageFile.arrayBuffer()), 
      {
        access: 'public', 
        contentType: imageFile.type, 
      }
    );

    await connectDB();
    const newHeader = await Header.create({
      title,
      description,
      linkedInLink,
      githubLink,
      imageUrl,
    });

    return NextResponse.json(
      { message: 'Header Created Successfully', Header: newHeader },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/Headers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Header' },
      { status: 500 }
    );
  }
}

// GET function (unchanged)
export async function GET(req) {
  try {
    await connectDB();

    const headers = await Header.find({});

    return NextResponse.json({ headers });
  } catch (error) {
    console.error('Error fetching headers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch headers' },
      { status: 500 }
    );
  }
}