import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

async function runMigrations() {
  const sql = neon(DATABASE_URL);

  // Read the migration file
  const migrationPath = path.join(process.cwd(), "drizzle", "0022_add_client_invite_fields.sql");
  const migrationSql = fs.readFileSync(migrationPath, "utf-8");

  console.log("Running migration: 0022_add_client_invite_fields.sql");

  try {
    // Execute the migration
    const result = await sql(migrationSql);
    console.log("✅ Migration completed successfully");
    console.log("Result:", result);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
