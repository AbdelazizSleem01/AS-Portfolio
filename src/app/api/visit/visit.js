// pages/api/visit.js
import connectDB from "../../../../lib/mongodb";
import Visit from "../../../../models/Visits";

export default async function handler(req, res) {
  await connectDB();

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://as-portfolio-ten.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "POST") {
    try {
      await Visit.create({ createdAt: new Date() }); // Log visit
      res.status(201).json({ message: "Visit recorded" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const count = await Visit.countDocuments(); // Get total visits
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}