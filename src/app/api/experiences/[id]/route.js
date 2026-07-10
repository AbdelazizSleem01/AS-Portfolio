import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Experience from "../../../../../models/Experience";
import sanitizeHtml from "sanitize-html";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const experience = await Experience.findById(id).lean();
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
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

    const existingExperience = await Experience.findById(id);
    if (!existingExperience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    const updateData = {
      company,
      role,
      from,
      to: current ? "Present" : (to || "Present"),
      current: !!current,
      description,
      order: order ? parseInt(order) : 0,
    };

    const updatedExperience = await Experience.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json(
      { message: "Experience updated", experience: updatedExperience },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const experience = await Experience.findById(id);
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    await Experience.findByIdAndDelete(id);
    return NextResponse.json({ message: "Experience deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
