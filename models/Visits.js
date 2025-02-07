import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  ip: { type: String, required: true }, 

}, { timestamps: true } // Ensures `createdAt` and `updatedAt` are automatically added
);

// Prevent model recompilation in development
export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);
