import { NextRequest, NextResponse } from "next/server";
import { getDbHttp } from "@/lib/db";
import { user as userTable, client as clientTable } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  const db = getDbHttp();

  try {
    const body = await req.json();
    const { token, email, password, fullName, companyName, phone, website, address, city, country } = body;

    if (!token || !email || !password || !fullName || !companyName) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Find user with valid token
    const users = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        inviteToken: userTable.inviteToken,
        inviteTokenExpiresAt: userTable.inviteTokenExpiresAt,
      })
      .from(userTable)
      .where(
        and(
          eq(userTable.inviteToken, token),
          eq(userTable.email, email.toLowerCase()),
          gt(userTable.inviteTokenExpiresAt, new Date().toISOString())
        )
      )
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Invitation link is invalid or expired" },
        { status: 400 }
      );
    }

    const user = users[0];

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Update user with password and profile info
    await db
      .update(userTable)
      .set({
        password: hashedPassword,
        name: fullName,
        phone: phone || null,
        inviteToken: null,
        inviteTokenExpiresAt: null,
        emailVerified: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userTable.id, user.id));

    // Create or update client record for this user
    // First check if client exists
    const existingClients = await db
      .select()
      .from(clientTable)
      .where(eq(clientTable.userId, user.id))
      .limit(1);

    if (existingClients.length === 0) {
      // Create new client
      const { createId } = await import("@/lib/db/id");
      const clientId = createId();

      await db
        .insert(clientTable)
        .values({
          id: clientId,
          name: companyName,
          companyName: companyName,
          userId: user.id,
          email: email.toLowerCase(),
          website: website || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          country: country || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
    } else {
      // Update existing client
      await db
        .update(clientTable)
        .set({
          name: companyName,
          companyName: companyName,
          website: website || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          country: country || null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(clientTable.id, existingClients[0].id));
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Account setup complete! Please complete your brand information.",
        redirect: "/complete-client-info",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { message: error.message || "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
