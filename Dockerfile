# Multi-stage build for production
FROM node:18-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Copy health check script
COPY --chown=nodejs:nodejs healthcheck.js ./healthcheck.js

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV TZ=UTC

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Switch to non-root user
USER nodejs

# Health check with detailed script
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD ["dumb-init", "node", "healthcheck.js"]

# Expose port
EXPOSE 3001

# Start the application with proper signal handling
CMD ["dumb-init", "npm", "start"]
