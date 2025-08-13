import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Subscription from "../../../../models/Subscription";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    await connectDB();
    const subscriber = await Subscription.findOne({ verificationToken: token });

    if (!subscriber) {
      return NextResponse.redirect(
        `https://as-portfolio-ten.vercel.app/verify/error?code=invalid_token`
      );
    }

    // Mark as verified and clear token
    subscriber.verified = true;
    subscriber.verificationToken = undefined;
    await subscriber.save();

    return NextResponse.redirect(
      `https://as-portfolio-ten.vercel.app/verify/success`
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      `https://as-portfolio-ten.vercel.app/verify/error?code=server_error`
    );
  }
}