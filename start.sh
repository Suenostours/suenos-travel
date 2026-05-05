#!/bin/sh
# Railway startup script - Suenos Travel DMC Morocco
# Tables are auto-created on first /api/seed call — no drizzle-kit needed here

echo "========================================"
echo "Starting Suenos Travel DMC server..."
echo "========================================"

echo "[1/1] Starting production server..."
NODE_ENV=production node dist/boot.js
