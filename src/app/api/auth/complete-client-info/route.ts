import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
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
    const [user] = await db
      .select({ id: userTable.id, email: userTable.email, linkedClientId: userTable.linkedClientId })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      fullName,
      companyName,
      email,
      phone,
      bestWayToReach,
      bestTime,
      responsibilities,
      additionalContacts,
      socialAccounts,
      brandPrimaryColor,
      brandSecondaryColor,
      brandAccentColor,
      brandAssets,
      primaryFont,
      bodyFont,
      customFonts,
      noBrandFonts,
      brandVoice,
      brandValues,
      tones,
      dos,
      donts,
      avoidWords,
      defaultHashtags,
      competitors,
      references,
      rawFootageFiles,
      themePreference,
    } = body;

    // Validate required fields
    const errors: string[] = [];
    if (!fullName?.trim()) errors.push("Full name is required");
    if (!email?.trim()) errors.push("Email is required");
    if (!bestWayToReach?.trim()) errors.push("Best way to reach you is required");
    if (!socialAccounts || socialAccounts.length === 0) errors.push("At least one social media account is required");
    if (!brandPrimaryColor?.trim()) errors.push("Brand primary color is required");
    if (!brandAssets || brandAssets.length === 0) errors.push("At least one brand asset or logo is required");
    if (!primaryFont && !bodyFont && !noBrandFonts) errors.push("Please provide font information or select 'We don't have brand fonts'");

    if (errors.length > 0) {
      return NextResponse.json(
        { message: errors.join("; ") },
        { status: 400 }
      );
    }

    // Get client for current user - try linkedClientId first, then userId, then email match
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
        { message: "Client not found" },
        { status: 404 }
      );
    }

    // Update client with brand information
    await db
      .update(clientTable)
      .set({
        fullName: fullName.trim(),
        companyName: companyName?.trim() || client.companyName,
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || client.phone,
        bestWayToReach: bestWayToReach?.trim(),
        bestTime: bestTime || 'Anytime',
        responsibilities: responsibilities || [],
        additionalContacts: additionalContacts || [],
        socialAccounts: socialAccounts || [],
        brandPrimaryColor: brandPrimaryColor?.trim(),
        brandSecondaryColor: brandSecondaryColor?.trim(),
        brandAccentColor: brandAccentColor?.trim(),
        brandAssets: brandAssets || [],
        primaryFont: primaryFont ? JSON.stringify(primaryFont) : null,
        secondaryFont: bodyFont ? JSON.stringify(bodyFont) : null,
        customFonts: customFonts || [],
        noBrandFonts: noBrandFonts || false,
        brandVoice: brandVoice?.trim() || '',
        brandValues: brandValues || [],
        tones: tones || [],
        dos: dos || '',
        donts: donts || '',
        avoidWords: avoidWords || '',
        defaultHashtags: defaultHashtags || '',
        competitors: competitors || [],
        references: references || [],
        rawFootageLinks: rawFootageFiles || [],
        themePreference: themePreference || 'light',
        infoCompleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(clientTable.id, client.id));

    return NextResponse.json(
      {
        ok: true,
        message: "Client information saved successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error saving client info:", error);
    return NextResponse.json(
      { message: error.message || "Failed to save client information" },
      { status: 500 }
    );
  }
}
