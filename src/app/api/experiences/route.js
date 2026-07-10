import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Experience from "../../../../models/Experience";
import sanitizeHtml from "sanitize-html";

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return NextResponse.json({ experiences });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { company, role, from, to, current, description: rawDescription, order } = body;

    if (!company || !role || !from) {
      return NextResponse.json(
        { error: "Missing required fields: company, role, and from date are required." },
        { status: 400 }
      );
    }

    // Sanitize HTML description (using same settings as project description)
    const description = rawDescription
      ? sanitizeHtml(rawDescription, {
          allowedTags: [
            "b", "i", "em", "strong", "a", "p", "span", "img", "h1", "h2", "h3",
            "h4", "h5", "h6", "div", "br", "u", "mark",
          ],
          allowedAttributes: {
            span: ["style", "class"],
            a: ["href", "target", "rel"],
            img: ["src", "alt", "width", "height"],
            p: ["style", "class"],
            h1: ["style", "class"],
            h2: ["style", "class"],
            h3: ["style", "class"],
            h4: ["style", "class"],
            h5: ["style", "class"],
            h6: ["style", "class"],
            div: ["style", "class"],
            mark: ["style", "class"],
            u: ["style", "class"],
          },
          allowedStyles: {
            "*": {
              "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
              "font-size": [/^[0-9]+(px|em|%)$/],
              "line-height": [/^[0-9]+(px|em|%)$/],
              color: [
                /^#[0-9A-Fa-f]{6}$/,
                /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
              ],
              "background-color": [
                /^#[0-9A-Fa-f]{6}$/,
                /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
              ],
              "text-decoration": [/^underline$/],
            },
          },
        })
      : "";

    await connectDB();

    const newExperience = await Experience.create({
      company,
      role,
      from,
      to: current ? "Present" : (to || "Present"),
      current: !!current,
      description,
      order: order ? parseInt(order) : 0,
    });

    return NextResponse.json(
      { message: "Experience created", experience: newExperience },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
