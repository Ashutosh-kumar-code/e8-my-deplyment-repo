import { NextResponse } from "next/server";
import { getDbHttp } from "@/lib/db";
import { client as clientTable, user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

function getTokenFromCookies(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/authToken=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(req: Request) {
  const db = getDbHttp();

  try {
    const token = getTokenFromCookies(req);

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json(
        { infoCompleted: false },
        { status: 200 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    } catch (err) {
      return NextResponse.json(
        { infoCompleted: false },
        { status: 200 }
      );
    }

    const userId = Number(decoded.userId);

    // Get user from database
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { infoCompleted: false },
        { status: 200 }
      );
    }

    // Get client for current user
    let client;
    
    if (user.linkedClientId) {
      const [linkedClient] = await db
        .select()
        .from(clientTable)
        .where(eq(clientTable.id, user.linkedClientId))
        .limit(1);
      client = linkedClient;
    }

    if (!client) {
      const [userIdClient] = await db
        .select()
        .from(clientTable)
        .where(eq(clientTable.userId, user.id))
        .limit(1);
      client = userIdClient;
    }

    if (!client) {
      const [emailClient] = await db
        .select()
        .from(clientTable)
        .where(eq(clientTable.email, user.email.toLowerCase()))
        .limit(1);
      client = emailClient;
    }

    if (!client) {
      return NextResponse.json(
        { infoCompleted: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        infoCompleted: client.infoCompleted || false,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking client info:", error);
    return NextResponse.json(
      { infoCompleted: false },
      { status: 200 }
    );
  }
}
