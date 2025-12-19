# 🚀 Quick Start Guide - Tukki Event

This guide will get you up and running in under 5 minutes!

## ⚡ Fast Setup (Docker - Recommended)

### 1. Prerequisites
```bash
# Check if you have Docker installed
docker --version
docker-compose --version
```

### 2. Clone & Setup
```bash
# Clone the repository
git clone <repository-url>
cd tukkievent

# Setup environment
cd apps/api
cp .env.example .env
cd ../..
```

### 3. Start Everything with Docker
```bash
# Start all services (Database, Redis, API, Web)
docker-compose up -d

# Wait ~30 seconds for services to initialize

# Run database migrations
docker-compose exec api pnpm prisma migrate dev

# View logs
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost:3001
- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs
- **Prisma Studio**: Run `cd apps/api && pnpm prisma studio`

## 🔧 Manual Setup (Without Docker)

### 1. Prerequisites
```bash
# Check versions
node --version  # Should be >= 18
pnpm --version  # Should be >= 8
```

### 2. Install PostgreSQL & Redis
```bash
# macOS (using Homebrew)
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis

# Ubuntu/Debian
sudo apt-get install postgresql redis-server
sudo systemctl start postgresql
sudo systemctl start redis

# Windows
# Download and install from official websites
```

### 3. Setup Database
```bash
# Login to PostgreSQL
psql postgres

# Create database and user
CREATE USER tukki WITH PASSWORD 'tukki123';
CREATE DATABASE tukki_event OWNER tukki;
\q
```

### 4. Install Dependencies & Run
```bash
# Install dependencies
pnpm install

# Setup environment
cd apps/api
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
pnpm prisma migrate dev
pnpm prisma generate

# Start development servers
cd ../..
pnpm dev
```

## 📝 Test the API

### Create a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### Get Profile (with token)
```bash
# Replace YOUR_TOKEN with the accessToken from login response
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### Database connection error
```bash
# Check if PostgreSQL is running
docker-compose ps postgres
# OR
brew services list | grep postgresql
```

### Prisma errors
```bash
# Regenerate Prisma client
cd apps/api
pnpm prisma generate

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset
```

## 🎯 Next Steps

1. **Explore Swagger**: http://localhost:3000/api/docs
2. **Check Prisma Studio**: `cd apps/api && pnpm prisma studio`
3. **Read the full README**: [README.md](./README.md)
4. **Start building features!**

## 📚 Useful Commands

```bash
# View all running containers
docker-compose ps

# Stop all services
docker-compose down

# View API logs
docker-compose logs -f api

# Restart a service
docker-compose restart api

# Open a shell in API container
docker-compose exec api sh

# Run Prisma commands
docker-compose exec api pnpm prisma studio
docker-compose exec api pnpm prisma migrate dev
```

## 🎉 You're Ready!

The complete backend setup is done! You now have:

- ✅ NestJS API with authentication
- ✅ PostgreSQL database with Prisma
- ✅ Redis caching
- ✅ JWT authentication with refresh tokens
- ✅ Swagger documentation
- ✅ User management
- ✅ Organization/Event/Ticket modules (ready for implementation)

Start implementing the business logic in Phase 2!
