#!/bin/bash

# Navigate to the v0 project directory
cd /vercel/share/v0-project

echo "[v0] Current directory: $(pwd)"
echo "[v0] Files in current directory:"
ls -la | head -20

echo "[v0] Removing outdated package-lock.json..."
rm -f package-lock.json

echo "[v0] Installing dependencies with npm..."
npm install --legacy-peer-deps

echo "[v0] Setup complete!"
