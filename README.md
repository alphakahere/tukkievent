# 🎫 Tukki Event - Event Management Platform

A comprehensive event management platform built with **NestJS**, **Next.js**, **Prisma**, and **PostgreSQL**.

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Docker](#docker)

## ✨ Features

### Users & Roles
- **User (Participant)**: Account creation, event registration, ticket management
- **Organizer**: Organization management, event creation, registration/payment tracking
- **Organization Members**: Admins and staff with limited permissions
- **Super Admin**: Global platform management

### Core Features
- 🔐 Secure authentication (JWT with refresh tokens)
- 🏢 Organization management (creation, member invites, roles)
- 🎉 Event management (creation, tickets, publishing, customization)
- 🎫 Registration & ticket management (payments, QR codes, validation)
- 📊 Tracking & reporting (statistics, dashboards)
- 📧 Communication (emails, notifications, sharing)

## 🛠 Tech Stack

### Backend
- **NestJS** + TypeScript
- **PostgreSQL** (Prisma ORM)
- **Redis** cache
- **Passport JWT** + Refresh tokens
- **Bcrypt** hashing
- **Class-validator** for validation
- **Swagger** for API documentation

### Frontend
- **Next.js 15** (App Router)
- **TypeScript** strict mode
- **Tailwind CSS**
- **Shadcn/ui** components

### Infrastructure
- **Docker** + Docker Compose
- **pnpm** workspaces (monorepo)

## 📁 Project Structure

```
tukki-event/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── users/          # Users module
│   │   │   ├── organizations/  # Organizations module
│   │   │   ├── events/         # Events module
│   │   │   ├── tickets/        # Tickets module
│   │   │   ├── registrations/  # Registrations module
│   │   │   ├── payments/       # Payments module
│   │   │   ├── prisma/         # Prisma module & service
│   │   │   └── common/         # Guards, decorators, filters
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                    # Next.js frontend
│       ├── app/
│       ├── components/
│       ├── lib/
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   └── config/                 # Shared configs
│
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (or npm)
- **Docker** & **Docker Compose** (optional, for containerized development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tukkievent
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start database services** (using Docker)
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Run database migrations**
   ```bash
   cd apps/api
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

6. **Start development servers**

   **Option A: Start all services**
   ```bash
   # From root directory
   pnpm dev
   ```

   **Option B: Start individually**
   ```bash
   # Terminal 1 - API
   pnpm dev:api

   # Terminal 2 - Web
   pnpm dev:web
   ```

## 🔧 Development

### Available Scripts

From the **root directory**:

```bash
# Development
pnpm dev              # Start all services in parallel
pnpm dev:api          # Start API only
pnpm dev:web          # Start web only

# Build
pnpm build            # Build all apps
pnpm build:api        # Build API only
pnpm build:web        # Build web only

# Start production
pnpm start:api        # Start API in production
pnpm start:web        # Start web in production

# Database (Prisma)
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:studio    # Open Prisma Studio

# Docker
pnpm docker:up        # Start all services
pnpm docker:down      # Stop all services
pnpm docker:logs      # View logs

# Testing & Linting
pnpm test             # Run tests
pnpm lint             # Run linter
```

### API Development

The NestJS API runs on **http://localhost:3000** by default.

**Key endpoints:**
- Health check: `GET /api/v1/`
- Detailed health: `GET /api/v1/health`
- API docs (Swagger): `http://localhost:3000/api/docs`

**Authentication:**
- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Refresh token: `POST /api/v1/auth/refresh`
- Logout: `POST /api/v1/auth/logout`

### Frontend Development

The Next.js web app runs on **http://localhost:3001** by default.

## 📖 API Documentation

Once the API is running, you can access the **Swagger documentation** at:

**http://localhost:3000/api/docs**

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

## 🗄 Database

### Prisma Schema

The database schema includes:
- **Users** - User accounts with roles
- **Organizations** - Organization entities
- **OrganizationMembers** - Members with roles (Owner, Admin, Staff)
- **Events** - Event details
- **Tickets** - Ticket types for events
- **Registrations** - User event registrations
- **Payments** - Payment tracking
- **RefreshTokens** - JWT refresh tokens

### Prisma Commands

```bash
# Generate Prisma client
pnpm --filter api prisma:generate

# Create a migration
pnpm --filter api prisma migrate dev --name migration_name

# Apply migrations
pnpm --filter api prisma migrate deploy

# Open Prisma Studio (DB GUI)
pnpm --filter api prisma:studio

# Reset database (WARNING: deletes all data)
pnpm --filter api prisma migrate reset
```

## 🔐 Environment Variables

### API (.env)

```env
# Database
DATABASE_URL="postgresql://tukki:tukki123@localhost:5432/tukki_event"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# API
PORT=3000
NODE_ENV="development"
API_PREFIX="/api/v1"

# CORS
CORS_ORIGIN="http://localhost:3001"

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH="api/docs"
```

### Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 🐳 Docker

### Development with Docker

Start all services (PostgreSQL, Redis, API, Web):

```bash
docker-compose up -d
```

### Production Docker Build

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start in production mode
docker-compose -f docker-compose.yml up -d
```

### Individual Services

```bash
# Database only
docker-compose up -d postgres

# Cache only
docker-compose up -d redis

# API only
docker-compose up -d api

# Web only
docker-compose up -d web
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 📝 Development Roadmap

### Phase 1: Foundation ✅
- [x] Monorepo setup
- [x] NestJS backend structure
- [x] Prisma schema
- [x] Authentication (JWT)
- [x] User management
- [x] Docker configuration

### Phase 2: Core Features (In Progress)
- [ ] Organization CRUD operations
- [ ] Event CRUD operations
- [ ] Ticket management
- [ ] Registration system
- [ ] Payment integration

### Phase 3: Advanced Features
- [ ] QR code generation
- [ ] Email notifications
- [ ] Statistics & analytics
- [ ] File uploads
- [ ] Real-time updates

### Phase 4: Frontend
- [ ] Authentication UI
- [ ] Organization dashboard
- [ ] Event creation/management
- [ ] Ticket purchase flow
- [ ] User profile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NestJS documentation
- Prisma documentation
- Next.js documentation
- The amazing open-source community

---

**Built with ❤️ using NestJS + Next.js + Prisma**
