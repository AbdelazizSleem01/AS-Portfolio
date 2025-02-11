import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  email: { type: String, default: "Unknown" },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  city: { type: String, default: "Unknown" },
  country: { type: String, default: "Unknown" },
  visitedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);
