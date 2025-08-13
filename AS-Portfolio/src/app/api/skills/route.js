import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { put } from '@vercel/blob';
import Skill from '../../../../models/Skills';
import Subscription from '../../../../models/Subscription';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const imageFile = formData.get('image');

    if (!imageFile) {
      throw new Error('Image upload failed. Make sure an image file is provided.');
    }

    const imageBuffer = await imageFile.arrayBuffer();

    const { url: imageUrl } = await put(
      `SkillsImages/${Date.now()}-${imageFile.name}`,
      Buffer.from(imageBuffer),
      {
        access: 'public',
        contentType: imageFile.type,
      }
    );

    // Save to MongoDB
    await connectDB();
    const newSkill = await Skill.create({
      name,
      imageUrl,
    });

    const response = NextResponse.json(
      { message: 'Skill Created Successfully', Skill: newSkill },
      { status: 201 }
    );

    // Send email notifications
    sendNotifications().catch(error => {
      console.error('Background notification error:', error);
    });

    return response;

  } catch (error) {
    console.error('Error in POST /api/Skills:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Skill' },
      { status: 500 }
    );
  }
}

// Function to send notifications (unchanged)
const sendNotifications = async () => {
  try {
    await connectDB();
    const subscribers = await Subscription.find({ verified: true });

    if (subscribers.length === 0) {
      console.log('No subscribers found.');
      return;
    }

    console.log(`Sending emails to ${subscribers.length} subscribers...`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.YANDEX_USER,
        pass: process.env.YANDEX_PASS,
      },
    });



    await Promise.all(subscribers.map(async (sub) => {
      try {
        await transporter.sendMail({
          from: `AS Portfolio Updates <${process.env.YANDEX_USER}>`,
          to: sub.email,
          subject: 'New Skill Update: Explore My Latest Technical Enhancements',
          text: `Dear Subscriber,
    
    I'm excited to announce that I've recently updated my technical skills and portfolio with new capabilities and innovations. Discover the latest improvements in my skillset, including advancements in both front-end and back-end technologies. Visit ${process.env.NEXT_PUBLIC_BASE_URL} to see the new updates.
    
    Best Regards,
    AS Portfolio Team`,
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Portfolio Skill Update Notification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333333;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #eaeaea;">
                    <!-- Header Section -->
                    <tr>
                      <td style="padding: 40px 30px; background-color: #f8f9fa; border-bottom: 1px solid #eeeeee;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}" target="_blank">
                          <img src="${process.env.NEXT_PUBLIC_BASE_URL}/imgs/Logo.png" 
                               alt="AS Portfolio Logo" 
                               width="150" 
                               style="display: block; margin: 0 auto;">
                        </a>
                      </td>
                    </tr>
    
                    <!-- Content Section -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h1 style="font-size: 22px; color: #1a1a1a; margin: 0 0 25px 0;">
                          New Skill Update Available
                        </h1>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Dear Valued Subscriber,
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          I'm thrilled to announce that I've recently expanded and updated my technical skillset. This update highlights:
                        </p>
    
                        <ul style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; padding-left: 20px;">
                          <li>New front-end frameworks and libraries</li>
                          <li>Enhanced back-end technologies and architecture</li>
                          <li>Improved DevOps practices and tools</li>
                          <li>Innovative problem-solving approaches</li>
                        </ul>
    
                        <div style="text-align: center; margin: 40px 0;">
                          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" 
                             style="background-color: #2563eb; color: #ffffff; 
                                    padding: 14px 28px; text-decoration: none; 
                                    border-radius: 5px; font-weight: 500;
                                    display: inline-block; font-size: 16px;">
                            Discover My New Skills
                          </a>
                        </div>
    
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Dive into the updated portfolio to explore detailed examples of my work, projects that illustrate these new capabilities, and insights into my continuous professional development.
                        </p>
                      </td>
                    </tr>
    
                    <!-- Footer Section -->
                    <tr>
                      <td style="padding: 30px; background-color: #f8f9fa; border-top: 1px solid #eeeeee;">
                        <div style="text-align: center; font-size: 14px; color: #666666;">
                          <p style="margin: 0 0 10px 0;">
                            This message was sent to ${sub.email}
                          </p>
                          <p style="margin: 0 0 10px 0;">
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${sub.unsubscribeToken}" 
                               style="color: #2563eb; text-decoration: none;">
                              Unsubscribe
                            </a> 
                            | 
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy" 
                               style="color: #2563eb; text-decoration: none;">
                              Privacy Policy
                            </a>
                          </p>
                          <p style="margin: 0;">
                            © ${new Date().getFullYear()} AS Portfolio. All rights reserved.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        });
      }
      catch (emailError) {
        console.error(`Failed to send email to ${sub.email}:`, emailError);
      }
    }))

    console.log('Email notifications processed');
  } catch (error) {
    console.error('Notification error:', error);
  }
};

// GET function (unchanged)
export async function GET(req) {
  try {
    await connectDB();

    const skills = await Skill.find({});

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error in GET /api/Skills:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}