#!/bin/bash

# Smart Dashboard Build Script
echo "🚀 Starting Smart Dashboard Build Process..."

# Create dist directory
echo "📁 Creating dist directory..."
mkdir -p dist

# Copy all files to dist (excluding node_modules, .git, etc.)
echo "📋 Copying files to dist..."
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='tests' --exclude='.github' . dist/

# Copy specific files that might be needed
echo "📄 Copying essential files..."
cp index.html dist/ 2>/dev/null || true
cp -r css dist/ 2>/dev/null || true
cp -r js dist/ 2>/dev/null || true
cp -r assets dist/ 2>/dev/null || true

# Create a simple version file
echo "📝 Creating version file..."
echo "Build Date: $(date)" > dist/BUILD_INFO.txt
echo "Commit: ${GITHUB_SHA:-$(git rev-parse HEAD 2>/dev/null || echo 'unknown')}" >> dist/BUILD_INFO.txt

echo "✅ Build completed successfully!"
echo "📦 Files are ready in the dist/ directory"
