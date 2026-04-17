-- AlterTable
ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "email_verification_token" TEXT;
ALTER TABLE "users" ADD COLUMN "reset_token" TEXT;
ALTER TABLE "users" ADD COLUMN "reset_token_expiry" TIMESTAMP(3);
