# ========================================================
# Stage 1: Build Frontend static assets
# ========================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (leverage layer caching)
COPY package*.json ./
RUN npm ci

# Copy source code and configs
COPY . .

# Build Vite frontend assets (emits to dist/)
RUN npm run build

# ========================================================
# Stage 2: Production Nginx Server
# ========================================================
FROM nginx:1.25-alpine AS runner

# Copy custom nginx configuration for SPA routing fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
