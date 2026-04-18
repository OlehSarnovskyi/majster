# ---- Stage 1: Build ----
FROM node:22-slim AS builder
WORKDIR /app

# OpenSSL required by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install all deps (including devDeps needed for build)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma client for the target platform
RUN npx prisma generate

# Build Angular frontend + NestJS backend
RUN npx nx build web --configuration=production
RUN npx nx build api --configuration=production

# ---- Stage 2: Production image ----
FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# NestJS API bundle
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Angular static build (served by NestJS)
COPY --from=builder /app/dist/apps/web/browser ./dist/apps/web/browser

# Runtime deps: node_modules (includes prisma client + all npm packages)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Prisma schema + migrations
COPY --from=builder /app/prisma ./prisma

# Create uploads dir for avatars (ephemeral in container — use S3 in future)
RUN mkdir -p uploads/avatars

EXPOSE 3000

# Run DB migrations then start the server
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node apps/api/dist/main.js"]
