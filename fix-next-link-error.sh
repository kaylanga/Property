#!/bin/bash

# Stop any running Next.js dev servers
echo "Stopping any running Next.js servers..."
pkill -f "next dev" || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

# Find any malformed Link imports in the codebase
echo "Checking for potentially problematic Link imports..."
grep -r "import Link from .*#" src/ || echo "No malformed Link imports found."

# Install dependencies fresh
echo "Reinstalling dependencies..."
npm install

# Start Next.js in development mode
echo "Starting Next.js development server..."
npm run dev
