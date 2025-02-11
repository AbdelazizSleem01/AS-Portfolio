import connectDB from "../../../../lib/mongodb";
import Visitor from "../../../../models/Visits";

export default async function handler(req, res) {
    if (req.method === 'GET') {
      
      await connectDB();
      const count = await Visitor.countDocuments();
      res.status(200).json({ count });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }