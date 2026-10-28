export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { client as clientTable } from "@/lib/db/schema";
import { asc, desc, eq, isNull, or } from "drizzle-orm";

// ---------- GET /api/clients/invited ----------
// Returns only clients who haven't completed onboarding (infoCompleted is false or null)
export async function GET() {
  const { db, closeDb } = getDbPool();
  try {
    const invitedClients = await db.query.client.findMany({
      orderBy: desc(clientTable.createdAt),
      where: or(
        eq(clientTable.infoCompleted, false),
        isNull(clientTable.infoCompleted)
      ),
      columns: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        phone: true,
        status: true,
        infoCompleted: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ clients: invitedClients });
  } catch (err) {
    console.error("GET /api/clients/invited error:", err);
    return NextResponse.json(
      { message: "Failed to load invited clients" },
      { status: 500 }
    );
  } finally {
    await closeDb();
  }
}
