-- Add role_chosen field to track whether user has explicitly selected their role
ALTER TABLE "users" ADD COLUMN "role_chosen" BOOLEAN NOT NULL DEFAULT false;
