#!/bin/bash

# School Counselor AI Platform - Development Setup Script

set -e

echo "🎓 School Counselor AI Platform - Setup"
echo "========================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker found"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.prod.example .env
    echo "✅ .env created. Please edit with your configuration."
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first."
    exit 1
fi

echo "✅ Docker Compose found"

# Start Docker Compose
echo ""
echo "🚀 Starting Docker Compose services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo ""
echo "🔐 Demo Credentials:"
echo "   Student: student@school.com / password123"
echo "   Counselor: counselor@school.com / password123"
echo "   Admin: admin@school.com / password123"
echo ""
echo "📚 Documentation:"
echo "   - QUICKSTART.md - Quick setup guide"
echo "   - DEPLOYMENT.md - Deployment instructions"
echo "   - API.md - API reference"
echo "   - ARCHITECTURE.md - System architecture"
echo ""
echo "🛑 To stop services: docker-compose down"
echo "📝 To view logs: docker-compose logs -f"
