import { NextRequest, NextResponse } from "next/server";
import { getDbHttp } from "@/lib/db";
import { user as userTable, client as clientTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@/lib/db/id";
import { createTransporter } from "@/lib/mail-transport";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const db = getDbHttp();

  try {
    const body = await req.json();
    const { email, companyName } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const emailLower = email.trim().toLowerCase();
    const companyNameValue = companyName?.trim() || emailLower.split("@")[0]; // Use company name or default to email prefix

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, emailLower))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create a new client user with role 'client' and status 'ACTIVE'
    // The user will set their password during onboarding
    const inviteToken = createId();
    const clientId = createId();

    // Create the Client record FIRST (required for foreign key constraint)
    await db
      .insert(clientTable)
      .values({
        id: clientId,
        name: emailLower.split("@")[0],
        email: emailLower,
        companyName: companyNameValue,
        phone: "",
        status: "active",
        startDate: new Date().toISOString(),
        infoCompleted: false, // Mark as not completed
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    // Then create the User record with linkedClientId
    const newUserResult = await db
      .insert(userTable)
      .values({
        name: email.split("@")[0], // Use email prefix as default name
        email: emailLower,
        role: "client",
        employeeStatus: "ACTIVE",
        emailVerified: false,
        inviteToken: inviteToken,
        inviteTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        linkedClientId: clientId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    const newUser = newUserResult[0] || newUserResult;

    // Send invite email using existing transporter
    const transporter = createTransporter();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.e8productions.com";
    const inviteLink = `${baseUrl}/onboarding?token=${inviteToken}`;

    await transporter.sendMail({
      to: emailLower,
      subject: "Welcome to E8 Productions - Set Up Your Client Portal",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .content p { margin: 15px 0; }
              .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
              .feature-list { list-style: none; padding: 0; }
              .feature-list li { padding: 8px 0; }
              .feature-list li:before { content: "✓ "; color: #667eea; font-weight: bold; margin-right: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to E8 Productions</h1>
              </div>
              <div class="content">
                <p>Hi there,</p>
                
                <p>We're excited to have you join E8 Productions! We've set up a client portal where you can:</p>
                
                <ul class="feature-list">
                  <li>Review and approve content deliverables</li>
                  <li>Provide feedback on your videos</li>
                  <li>Track project status in real-time</li>
                  <li>Manage your account settings</li>
                </ul>

                <p>To get started, click the button below to set up your account and create your password:</p>

                <div style="text-align: center;">
                  <a href="${inviteLink}" class="cta-button">Set Password & Start Onboarding</a>
                </div>

                <p style="font-size: 14px; color: #666;">This link will expire in 7 days. If you have any questions, please don't hesitate to reach out to us.</p>

                <p>Best regards,<br><strong>The E8 Productions Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2026 E8 Productions. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Invalidate clients cache
    await redis.del("clients:all");

    return NextResponse.json(
      {
        ok: true,
        message: "Invite sent successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        clientId: clientId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending client invite:", error);
    return NextResponse.json(
      { message: error.message || "Failed to send invite" },
      { status: 500 }
    );
  }
}
