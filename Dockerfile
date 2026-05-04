# ---- Stage 1: Build ----
FROM node:22-slim AS builder
WORKDIR /app

# OpenSSL required by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install deps and clean cache immediately to avoid BuildKit overlay issues
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copy source
COPY . .

# Generate Prisma client for the target platform
RUN npx prisma generate

# Build NestJS backend only (frontend is on Vercel)
RUN npx nx build api --configuration=production

# ---- Stage 2: Production image ----
FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# NestJS API bundle
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Runtime deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Prisma schema + migrations (used by migrate deploy in main.ts)
COPY --from=builder /app/prisma ./prisma

# Create uploads dir for avatars
RUN mkdir -p uploads/avatars

EXPOSE 3000

# migrate deploy + seed run automatically on startup via main.ts and SeedService
CMD ["node", "apps/api/dist/main.js"]
