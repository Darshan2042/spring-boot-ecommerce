#!/bin/bash
# Build and integrate React frontend with Spring Boot

echo "🔨 Building React Frontend..."

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the React app
echo "🏗️ Building React app..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Copy built files to Spring Boot
echo "📁 Copying built files to Spring Boot..."
rm -rf "../src/main/resources/static/*"
cp -r build/* "../src/main/resources/static/"

echo "✅ React frontend built and integrated successfully!"
echo ""
echo "🚀 To start the application, run:"
echo "   cd .. && mvn clean compile spring-boot:run"
