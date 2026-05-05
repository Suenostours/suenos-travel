# Railway Dockerfile - Suenos Travel DMC Morocco

FROM node:20-alpine AS builder
WORKDIR /app

# 1. Dependencies
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# 2. Source + Build
RUN echo "cache-bust-v4-dbpush" > /tmp/cache-bust
COPY . .
RUN mkdir -p public/uploads
ENV NODE_ENV=production
RUN npm run build

# 3. Production image
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

RUN mkdir -p public/uploads
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/api ./api
COPY --from=builder /app/db ./db
COPY --from=builder /app/contracts ./contracts
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/tsconfig.server.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Startup script (runs db:push then starts server)
COPY --from=builder /app/start.sh ./
RUN chmod +x start.sh

EXPOSE 3000
CMD ["./start.sh"]
