import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Subscription from "../../../../models/Subscription";




export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const subscriber = await Subscription.findOneAndUpdate(
      { unsubscribeToken: token },
      { subscribed: false, unsubscribeToken: null },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully',
      data: subscriber,
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}