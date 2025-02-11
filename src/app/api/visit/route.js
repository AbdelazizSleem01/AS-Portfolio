import { NextResponse } from "next/server";
import geoip from "geoip-lite";
import connectDB from "../../../../lib/mongodb";
import Visitor from "../../../../models/Visits"

export async function POST(req) {
  await connectDB();

  try {
    const { email, userAgent, ip, latitude, longitude } = await req.json();

    // Get location from an external API
    const locationRes = await fetch(`http://ip-api.com/json/${ip}`);
    const locationData = await locationRes.json();

    const country = locationData?.country || "Unknown";
    const city = locationData?.city || "Unknown";
    const time = new Date().toLocaleString("en-US", { timeZone: "UTC" });

    // Save visitor data
    const visitData = new Visitor({
      email,
      userAgent,
      ip,
      latitude,
      longitude,
      city,
      country,
      visitedAt: time,
    });

    await visitData.save();

    return NextResponse.json({ message: "Visitor recorded" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const visitors = await Visitor.find().sort({ visitedAt: -1 }).limit(10);

    return NextResponse.json(visitors, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visitors" }, { status: 500 });
  }
}
