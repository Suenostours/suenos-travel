# Railway Dockerfile - Suenos Travel DMC Morocco
# Remplace le builder Nixpacks (evite l'erreur --mount=type=cache)

FROM node:20-alpine AS builder
WORKDIR /app

# 1. Dependences
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# 2. Code source + Build
# Force rebuild sans cache (changer ce numero si vous voulez forcer un nouveau rebuild)
RUN echo "cache-bust-v6-stable" > /tmp/cache-bust
COPY . .
RUN mkdir -p public/uploads
ENV NODE_ENV=production
RUN npm run build

# 3. Image de production (plus legere)
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Dossier uploads (persiste via Railway Volume)
RUN mkdir -p public/uploads

# Node_modules de production uniquement
COPY --from=builder /app/node_modules ./node_modules

# Code backend necessaire au runtime (Hono server + tRPC)
COPY --from=builder /app/api ./api
COPY --from=builder /app/db ./db
COPY --from=builder /app/contracts ./contracts
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/tsconfig.server.json ./

# Frontend build (fichiers statiques servis par Hono)
COPY --from=builder /app/dist ./dist

# Package.json (pour npm start)
COPY --from=builder /app/package.json ./

# Startup script
COPY --from=builder /app/start.sh ./
RUN chmod +x start.sh

# NE PAS copier .env - Railway injecte les variables d'environnement

EXPOSE 3000
CMD ["./start.sh"]
