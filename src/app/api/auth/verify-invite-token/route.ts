import { NextRequest, NextResponse } from "next/server";
import { getDbHttp } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const db = getDbHttp();

  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    // Find user with valid token
    const user = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        inviteToken: userTable.inviteToken,
        inviteTokenExpiresAt: userTable.inviteTokenExpiresAt,
        password: userTable.password,
      })
      .from(userTable)
      .where(
        and(
          eq(userTable.inviteToken, token),
          gt(userTable.inviteTokenExpiresAt, new Date().toISOString())
        )
      )
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { message: "Invitation link is invalid or expired" },
        { status: 400 }
      );
    }

    const invitedUser = user[0];

    // Check if user already has a password set
    if (invitedUser.password) {
      return NextResponse.json(
        { message: "This account has already been set up" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        email: invitedUser.email,
        name: invitedUser.name,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying invite token:", error);
    return NextResponse.json(
      { message: error.message || "Failed to verify token" },
      { status: 500 }
    );
  }
}
