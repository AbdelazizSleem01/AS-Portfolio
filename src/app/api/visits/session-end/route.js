import connectDB from "../../../../../lib/mongodb";
import Visit from "../../../../../models/Visits";

export async function POST(request) {
  try {
    await connectDB();

    const { sessionId, duration } = await request.json();

    const visit = await Visit.findOneAndUpdate(
      { sessionId },
      {
        sessionEnd: new Date(),
        totalDuration: duration,
      },
      { new: true }
    );

    if (!visit) {
      return new Response(JSON.stringify({ error: "Visit not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return new Response(JSON.stringify({ error: "Failed to update session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
