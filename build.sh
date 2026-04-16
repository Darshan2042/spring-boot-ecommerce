#!/usr/bin/env bash
set -e

# Build frontend
cd frontend
npm install
npm run build
cd ../

# Build backend with frontend included
mvn clean package -DskipTests

echo "Build successful!"
