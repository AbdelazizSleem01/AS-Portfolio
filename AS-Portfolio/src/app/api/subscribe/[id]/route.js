import { NextResponse } from "next/server";
import Subscription from "../../../../../models/Subscription";
import connectDB from "../../../../../lib/mongodb";

export async function DELETE(req, { params }) {
    try {
      await connectDB();
      const { id } =await params;
      
      const deletedSub = await Subscription.findByIdAndDelete(id);
      if (!deletedSub) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Subscription deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete subscription" },
        { status: 500 }
      );
    }
  }