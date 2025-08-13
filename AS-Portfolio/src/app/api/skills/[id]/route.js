import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob'; // Import Vercel Blob methods
import connectDB from '../../../../../lib/mongodb';
import Skill from '../../../../../models/Skills';
import nodemailer from 'nodemailer';
import Subscription from '../../../../../models/Subscription';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const skill = await Skill.findById(id);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(skill, { status: 200 });
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const formData = await req.formData();
    const name = formData.get('name');
    const imageFile = formData.get('image');

    const updateData = { name };

    if (imageFile) {
      // Upload new image to Vercel Blob
      const { url: imageUrl } = await put(
        `SkillsImages/${Date.now()}-${imageFile.name}`, // Unique file path
        Buffer.from(await imageFile.arrayBuffer()), // File content
        {
          access: 'public', // Make the file publicly accessible
          contentType: imageFile.type, // Set the content type
        }
      );

      updateData.imageUrl = imageUrl;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Respond immediately
    const response = NextResponse.json({ message: 'Skill updated successfully', skill: updatedSkill }, { status: 200 });

    // Send email notifications in the background
    setTimeout(() => {
      sendNotifications().catch(console.error);
    }, 0);

    return response;
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Delete associated image from Vercel Blob
    if (skill.imageUrl) {
      await del(skill.imageUrl); // Delete the file from Vercel Blob
    }

    await Skill.findByIdAndDelete(id);

    // Respond immediately
    const response = NextResponse.json({ message: 'Skill deleted successfully' }, { status: 200 });

    // Send email notifications in the background
    setTimeout(() => {
      sendNotifications().catch(console.error);
    }, 0);

    return response;
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}

// Function to send notifications asynchronously
const sendNotifications = async () => {
  try {
    const subscribers = await Subscription.find({ verified: true });

    if (subscribers.length === 0) {
      console.log("No subscribers found.");
      return;
    }

    console.log(`Sending emails to ${subscribers.length} subscribers...`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.YANDEX_USER,
        pass: process.env.YANDEX_PASS,
      },
    });

    for (const sub of subscribers) {
      await transporter.sendMail({
        from: `AS Portfolio Updates <${process.env.YANDEX_USER}>`,
        to: sub.email,
        subject: "New Skill Update: Explore My Latest Technical Enhancements",
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
                    <tr>
                      <td style="padding: 40px 30px; background-color: #f8f9fa; border-bottom: 1px solid #eeeeee;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}" target="_blank">
                          <img src="https://i.ibb.co/Q7gVfkYR/Logo.png" 
                               alt="AS Portfolio Logo" 
                               width="150" 
                               style="display: block; margin: 0 auto;">
                        </a>
                      </td>
                    </tr>
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
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });
    }

    console.log("Emails sent successfully!");
  } catch (error) {
    console.error("Notification error:", error);
  }
};
