# ========================================================
# Stage 1: Build Frontend and Compile Server
# ========================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (leverage layer caching)
COPY package*.json ./
RUN npm ci

# Copy source code and config
COPY . .

# Build Vite frontend and compile Express server.ts with esbuild
RUN npm run build

# ========================================================
# Stage 2: Production Runtime
# ========================================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose production port
EXPOSE 3000

# Start compiled Express server
CMD ["node", "dist/server.cjs"]
