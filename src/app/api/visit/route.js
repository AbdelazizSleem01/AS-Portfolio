import { NextResponse } from "next/server";
import geoip from "geoip-lite";
import connectDB from "../../../../lib/mongodb";
import Visitor from "../../../../models/Visits"


export async function POST(req) {
  await connectDB();

  try {
    const { email, userAgent, ip, latitude, longitude } = await req.json();

    // Get location using geoip-lite
    const geo = geoip.lookup(ip);
    const country = geo?.country || "Unknown";
    const city = geo?.city || "Unknown";
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
