-- AlterTable: make service_id nullable on bookings so services can be deleted
-- without violating the foreign key constraint. Existing historical bookings
-- retain their service_id; future deletes will SET NULL via the FK action.

ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_service_id_fkey";

ALTER TABLE "bookings" ALTER COLUMN "service_id" DROP NOT NULL;

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_fkey"
  FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
