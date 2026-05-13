-- ═══════════════════════════════════════════════════════════════
-- Step 1: Create cities table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE "cities" (
  "id"        TEXT    NOT NULL DEFAULT gen_random_uuid(),
  "name"      TEXT    NOT NULL,
  "slug"      TEXT    NOT NULL,
  "country"   TEXT    NOT NULL DEFAULT 'SK',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "cities_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "cities_name_key" UNIQUE ("name"),
  CONSTRAINT "cities_slug_key" UNIQUE ("slug")
);

-- ═══════════════════════════════════════════════════════════════
-- Step 2: Insert seed data — Bratislava only
-- ═══════════════════════════════════════════════════════════════
INSERT INTO "cities" ("id", "name", "slug", "country", "is_active")
VALUES (gen_random_uuid(), 'Bratislava', 'bratislava', 'SK', true);

-- Future cities (uncomment to activate — zero code changes needed):
-- INSERT INTO "cities" ("id", "name", "slug", "country", "is_active") VALUES (gen_random_uuid(), 'Košice',         'kosice',         'SK', true);
-- INSERT INTO "cities" ("id", "name", "slug", "country", "is_active") VALUES (gen_random_uuid(), 'Žilina',         'zilina',         'SK', true);
-- INSERT INTO "cities" ("id", "name", "slug", "country", "is_active") VALUES (gen_random_uuid(), 'Prešov',         'presov',         'SK', true);
-- INSERT INTO "cities" ("id", "name", "slug", "country", "is_active") VALUES (gen_random_uuid(), 'Nitra',          'nitra',          'SK', true);
-- INSERT INTO "cities" ("id", "name", "slug", "country", "is_active") VALUES (gen_random_uuid(), 'Banská Bystrica','banska-bystrica','SK', true);
-- INSERT INTO "cities" ("id", "name", "slug", "country", "is_active") VALUES (gen_random_uuid(), 'Trnava',         'trnava',         'SK', true);
-- INSERT INTO "cities" ("id", "name", "slug", "country", "is_active") VALUES (gen_random_uuid(), 'Trenčín',        'trencin',        'SK', true);

-- ═══════════════════════════════════════════════════════════════
-- Step 3: Add city_id column to users (nullable FK)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE "users" ADD COLUMN "city_id" TEXT;

ALTER TABLE "users"
  ADD CONSTRAINT "users_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "cities"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- Step 4: Data migration — map existing city text → city_id
-- Returns counts as a query result (visible in Neon console)
-- ═══════════════════════════════════════════════════════════════
UPDATE "users"
SET "city_id" = (SELECT id FROM "cities" WHERE slug = 'bratislava')
WHERE city IS NOT NULL
  AND (
    LOWER(TRIM(city)) IN ('bratislava', 'ba')
    OR LOWER(TRIM(city)) LIKE 'bratislava%'
  );

SELECT
  'mapped_to_bratislava'    AS metric, COUNT(*) AS count FROM "users" WHERE city_id IS NOT NULL
UNION ALL
SELECT
  'unmapped_with_city_text' AS metric, COUNT(*) AS count FROM "users" WHERE city IS NOT NULL AND city_id IS NULL
UNION ALL
SELECT
  'total_no_city'           AS metric, COUNT(*) AS count FROM "users" WHERE city IS NULL;

-- ═══════════════════════════════════════════════════════════════
-- Step 5: Drop old city text column
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE "users" DROP COLUMN "city";
