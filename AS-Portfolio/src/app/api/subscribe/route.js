import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Subscription from "../../../../models/Subscription";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if email already exists
    const existingSub = await Subscription.findOne({ email });
    if (existingSub) {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 } // 409 Conflict
      );
    }

    // Create new subscription
    const newSub = await Subscription.create({
      email,
      verificationToken: crypto.randomBytes(20).toString('hex'),
      unsubscribeToken: crypto.randomBytes(20).toString('hex'),
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.YANDEX_USER, pass: process.env.YANDEX_PASS },
    });

    const verificationLink = `https://as-portfolio-ten.vercel.app/api/verify?token=${newSub.verificationToken}`;
    await transporter.sendMail({
      from: `AS Portfolio <${process.env.YANDEX_USER}>`,
      to: email,
      replyTo: process.env.YANDEX_USER,
      subject: "Confirm Your Subscription to AS Portfolio Updates",
      text: `Please confirm your subscription by visiting this link: ${verificationLink}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <table width="100%" border="0" cellspacing="0" cellpadding="20" style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
          <tr>
            <td align="center" style="padding: 30px 0; background-color: #f8f9fa;">
              <img src="https://i.ibb.co/Q7gVfkYR/Logo.png" alt="AS Portfolio Logo" width="100" style="max-width: 100%; height: auto; display: block;">
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 20px;">
              <h2 style="color: #2d3436; margin-top: 0;">Subscription Confirmation Required</h2>
              <p style="color: #636e72;">Dear Subscriber,</p>
              <p style="color: #636e72;">Thank you for subscribing to updates from AS Portfolio. To complete your subscription, please confirm your email address by clicking the button below:</p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationLink}" style="background-color: #0984e3; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Confirm Subscription
                </a>
              </div>
    
              <p style="color: #636e72;">If you did not request this subscription, please ignore this email. The link will expire automatically in 24 hours.</p>
              
              <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <div style="text-align: center; margin: 15px 0;">
              <p style="text-align: center;">Follow Me :</p>
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding: 0 10px; text-align: center; font-size: 0;">
                      <!-- LinkedIn -->
                      <a href="https://linkedin.com/in/yourprofile" 
                        style="display: inline-block; margin: 0 10px;">
                        <img src="https://img.icons8.com/fluent/48/000000/linkedin.png" 
                            alt="LinkedIn" 
                            width="28" 
                            style="display: block; width: 28px; height: auto;">
                      </a>

                      <!-- GitHub -->
                      <a href="https://github.com/yourprofile" 
                        style="display: inline-block; margin: 0 10px;">
                        <img src="https://img.icons8.com/material-outlined/24/000000/github.png" 
                            alt="GitHub" 
                            width="28" 
                            style="display: block; width: 28px; height: auto;">
                      </a>

                      <!-- Facebook -->
                      <a href="https://Facebook.com/yourprofile" 
                        style="display: inline-block; margin: 0 10px;">
                        <img src="https://img.icons8.com/fluent/48/000000/facebook-new.png" 
                            alt="Facebook" 
                            width="28" 
                            style="display: block; width: 28px; height: auto;">
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background-color: #f8f9fa; text-align: center;">
              <p style="color: #636e72; font-size: 0.8em; margin: 0;">
                © ${new Date().getFullYear()} AS Portfolio. All rights reserved.<br>
                <a href="https://as-portfolio-ten.vercel.app/privacy-policy" style="color: #0984e3; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://as-portfolio-ten.vercel.app/unsubscribe?token=${newSub.unsubscribeToken}" style="color: #0984e3; text-decoration: none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `
    });

    return NextResponse.json(
      { message: "Subscription successful", subscription: newSub },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}

// get all subscribe 

export async function GET(req) {
  try {
    await connectDB();
    const subscriptions = await Subscription.find({});
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error in GET /api/subscriptions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}