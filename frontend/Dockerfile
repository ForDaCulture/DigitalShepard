#################################
# Stage 1: Builder
#################################
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy & build
COPY . .
RUN npm run build

#################################
# Stage 2: Production
#################################
FROM node:18-alpine AS production
WORKDIR /app

# Copy only what we need
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose and run
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
