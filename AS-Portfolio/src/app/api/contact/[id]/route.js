import connectDB from "../../../../../lib/mongodb";
import Contact from "../../../../../models/Contact";
import nodemailer from "nodemailer";

export async function PATCH(request, { params }) {
  const { id } = params;
  await connectDB();

  const { response: reply } = await request.json();

  if (!reply) {
    return new Response(
      JSON.stringify({ message: "Response text is required" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { response: reply },
      { new: true }
    );

    if (!updatedContact) {
      return new Response(
        JSON.stringify({ message: "Contact not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: updatedContact.email,
      subject: `Response for your message : (${updatedContact.subject})`,
      text: reply, // Plain text fallback
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <!-- Header Section -->
          <div style="background-color: #A31D1D; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #FEF9E1; font-size: 24px; margin: 0;">
              ${process.env.EMAIL_FROM_NAME || "Abdelaziz Sleem Portfolio"}
            </h1>
          </div>
    
          <!-- Main Content -->
          <div style="background-color: #FEF9E1; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #E5D0AC;">
            <!-- Greeting -->
            <p style="font-size: 16px; margin-bottom: 20px;">
              Dear ${updatedContact.name},
            </p>
    
            <!-- Response Content -->
            <div style="font-size: 16px; margin-bottom: 20px; color: #2A2E37;">
              ${reply}
            </div>
    
            <!-- Closing Message -->
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for reaching out to us. If you have any further questions or need additional assistance, please feel free to contact us.
            </p>
    
            <!-- Signature -->
            <p style="font-size: 16px; margin-bottom: 20px;">
              Best regards,<br>
              <strong style="color: #A31D1D;">${process.env.EMAIL_FROM_NAME || "Abdelaziz Sleem Portfolio"}</strong>
            </p>
          </div>
    
          <!-- Footer Section -->
          <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
            <p>
              This is an automated message. Please do not reply directly to this email.
            </p>
            <p>
              &copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME || "Abdelaziz Sleem Portfolio"}. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify(updatedContact), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating response and sending email:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}