#!/bin/sh
# Railway startup script - Suenos Travel DMC Morocco

echo "========================================"
echo "Starting Suenos Travel DMC server..."
echo "========================================"

# Run db:push to ensure all tables exist
echo "[1/2] Syncing database schema..."
npx drizzle-kit push --force

if [ $? -eq 0 ]; then
  echo "[OK] Database schema synced successfully"
else
  echo "[WARNING] db:push returned non-zero, continuing anyway..."
fi

# Start the server
echo "[2/2] Starting production server..."
NODE_ENV=production node dist/boot.js
