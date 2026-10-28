-- Add client invitation and onboarding fields to User table
-- Allows admins to invite clients via email with token-based onboarding

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "inviteToken" text;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "inviteTokenExpiresAt" timestamp(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" boolean NOT NULL DEFAULT false;

-- Create indexes for token lookups and expiry checks
CREATE INDEX IF NOT EXISTS "User_inviteToken_idx" ON "User"("inviteToken");
CREATE INDEX IF NOT EXISTS "User_emailVerified_idx" ON "User"("emailVerified");
CREATE INDEX IF NOT EXISTS "User_inviteTokenExpiresAt_idx" ON "User"("inviteTokenExpiresAt");
