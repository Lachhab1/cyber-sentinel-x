#!/bin/bash

echo "🚀 Starting XAI-Tech Backend Development Environment"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npm run prisma:generate

# Start the complete stack
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🔄 Running database migrations..."
npm run prisma:migrate

# Seed the database
echo "🌱 Seeding the database..."
npm run prisma:seed

# Start the development server
echo "🔥 Starting development server..."
npm run start:dev
