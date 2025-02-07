// pages/api/visit.js
import connectDB from "../../../../lib/mongodb";
import Visit from "../../../../models/Visits";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      await Visit.create({ createdAt: new Date() }); // Log visit
      res.status(201).json({ message: "Visit recorded" });
    } catch (error) {
      console.error("Visit logging error:", error);
      res.status(500).json({ error: "Failed to record visit" });
    }
  } else if (req.method === "GET") {
    try {
      const count = await Visit.countDocuments();
      res.status(200).json({ count });
    } catch (error) {
      console.error("Visit count error:", error);
      res.status(500).json({ error: "Failed to fetch visit count" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
