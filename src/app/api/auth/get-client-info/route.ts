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
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = Number(decoded.userId);

    // Get user from database
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (users.length === 0) {
      // User not found - return empty client data (not an error)
      return NextResponse.json(
        {
          ok: true,
          client: null,
        },
        { status: 200 }
      );
    }

    const currentUser = users[0];

    // Get client for current user
    let clientQuery;
    if (currentUser.linkedClientId) {
      clientQuery = await db
        .select()
        .from(clientTable)
        .where(eq(clientTable.id, currentUser.linkedClientId))
        .limit(1);
    } else {
      clientQuery = await db
        .select()
        .from(clientTable)
        .where(eq(clientTable.userId, userId))
        .limit(1);
    }

    if (clientQuery.length === 0) {
      // No client found - this is normal for non-client users (staff, admin)
      return NextResponse.json(
        {
          ok: true,
          client: null,
        },
        { status: 200 }
      );
    }

    const client = clientQuery[0];

    return NextResponse.json(
      {
        ok: true,
        client: {
          id: client.id,
          fullName: client.fullName,
          name: client.name,
          companyName: client.companyName,
          email: client.email,
          phone: client.phone,
          bestWayToReach: client.bestWayToReach,
          bestTime: client.bestTime,
          responsibilities: client.responsibilities || [],
          additionalContacts: client.additionalContacts || [],
          socialAccounts: client.socialAccounts || [],
          brandPrimaryColor: client.brandPrimaryColor,
          brandSecondaryColor: client.brandSecondaryColor,
          brandAccentColor: client.brandAccentColor,
          brandAssets: client.brandAssets || [],
          primaryFont: client.primaryFont,
          secondaryFont: client.secondaryFont,
          customFonts: client.customFonts || [],
          noBrandFonts: client.noBrandFonts || false,
          brandVoice: client.brandVoice,
          brandValues: client.brandValues || [],
          tones: client.tones || [],
          dos: client.dos,
          donts: client.donts,
          avoidWords: client.avoidWords,
          defaultHashtags: client.defaultHashtags,
          competitors: client.competitors || [],
          references: client.references || [],
          rawFootageLinks: client.rawFootageLinks || [],
          themePreference: client.themePreference || 'light',
          infoCompleted: client.infoCompleted || false,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error getting client info:", error);
    return NextResponse.json(
      { message: error.message || "Failed to get client information" },
      { status: 500 }
    );
  }
}
