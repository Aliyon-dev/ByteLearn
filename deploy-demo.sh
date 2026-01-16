#!/bin/bash

# ByteLearn Demo Deployment Script (SQLite Edition)
# This script automates the deployment of ByteLearn for demo purposes using SQLite

set -e  # Exit on error

echo "🚀 ByteLearn Demo Deployment Script (SQLite)"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Stop any running containers
print_step "Stopping any running ByteLearn containers..."
docker-compose down 2>/dev/null || true
print_success "Stopped existing containers"

# Create data directory for SQLite
print_step "Creating data directory for SQLite database..."
mkdir -p backend/data
print_success "Data directory created"

# Build and start services
print_step "Building and starting services (this may take a few minutes)..."
docker-compose up --build -d

# Wait for services to be ready
print_info "Waiting for services to initialize..."
sleep 20

# Check if services are running
if ! docker-compose ps | grep -q "Up"; then
    print_error "Services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

print_success "All services are running"

# Run migrations
print_step "Running database migrations..."
docker-compose exec -T backend python manage.py migrate --noinput
print_success "Database migrations completed"

# Collect static files
print_step "Collecting static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput 2>/dev/null || true
print_success "Static files collected"

# Create sample data
print_step "Creating sample data..."
if [ -f "backend/create_sample_lesson.py" ]; then
    docker-compose exec -T backend python create_sample_lesson.py 2>/dev/null || true
    print_success "Sample data created"
else
    print_info "No sample data script found, skipping..."
fi

echo ""
echo "=============================================="
print_success "ByteLearn Demo Deployment Complete!"
echo "=============================================="
echo ""
echo "📊 Database: SQLite (lightweight, perfect for demos)"
echo "📁 Database location: backend/data/db.sqlite3"
echo ""
echo "🌐 Access your demo at:"
echo "  Frontend:     http://localhost:3000"
echo "  Backend API:  http://localhost:8000/api"
echo "  Django Admin: http://localhost:8000/admin"
echo ""
print_info "Next steps:"
echo "  1. Create a superuser:"
echo "     docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "  2. Login to the admin panel and create courses"
echo "  3. Access the frontend and explore the platform"
echo ""
echo "📝 Useful commands:"
echo "  View logs:        docker-compose logs -f"
echo "  Stop demo:        docker-compose down"
echo "  Restart services: docker-compose restart"
echo ""
print_success "Happy demoing! 🎉"
echo ""
