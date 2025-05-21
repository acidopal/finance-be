#!/bin/bash

# Increase file descriptor limit for this session
echo "Increasing file descriptor limit..."
ulimit -n 4096

# Kill any process using port 3040 (or your desired port)
PORT=${PORT:-3040}
echo "Checking for processes using port $PORT..."
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true

# Clean up any temporary files that might be causing issues
echo "Cleaning up temporary files..."
rm -rf node_modules/.cache
rm -rf dist

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p dist/i18n

# Copy i18n files
echo "Copying i18n files..."
cp -r src/i18n/* dist/i18n/

# Start the NestJS application with Bun
echo "Starting Finance API with Bun..."
NODE_ENV=development TZ=UTC bun --env-file=.env.bun run src/main.ts
