#!/bin/bash

# Increase file descriptor limit for this session
echo "Increasing file descriptor limit..."
ulimit -n 4096

# Kill any process using port 3005 (or your desired port)
PORT=${PORT:-3005}
echo "Checking for processes using port $PORT..."
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true

# Clean up any temporary files that might be causing issues
echo "Cleaning up temporary files..."
rm -rf node_modules/.cache

# Start the NestJS application in development mode
echo "Starting Finance API in development mode..."
npm run start:dev
