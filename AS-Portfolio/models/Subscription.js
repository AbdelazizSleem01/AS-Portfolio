import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  verificationToken: String,
  subscribed: { type: Boolean, default: true },
  unsubscribeToken: { type: String, unique: true },
}, { timestamps: true });

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
