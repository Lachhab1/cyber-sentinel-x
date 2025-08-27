# Backend Architecture (NestJS)

## 🚧 TODO: Implementation Pending

This document will be populated once the NestJS backend is implemented.

## 📋 Planned Architecture

### Tech Stack
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Supabase integration
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with supertest

### Module Structure
```
src/
├── modules/
│   ├── auth/           # Authentication & authorization
│   ├── users/          # User management
│   ├── projects/       # Project management
│   ├── threats/        # Threat intelligence
│   ├── incidents/      # Incident management
│   ├── reports/        # Report generation
│   └── search/         # Search functionality
├── common/
│   ├── decorators/     # Custom decorators
│   ├── filters/        # Exception filters
│   ├── guards/         # Route guards
│   ├── interceptors/   # Request/response interceptors
│   └── pipes/          # Validation pipes
├── config/             # Configuration management
├── database/           # Database configuration
└── main.ts            # Application bootstrap
```

### API Endpoints (Planned)

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - Get user profile

#### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Search
- `GET /api/search` - Global search
- `GET /api/search/threats` - Search threats
- `GET /api/search/incidents` - Search incidents

### Database Schema (Planned)
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  display_name VARCHAR,
  role VARCHAR DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table  
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Additional tables for threats, incidents, reports, etc.
```

### Security Considerations
- [ ] Input validation with class-validator
- [ ] Rate limiting with express-rate-limit
- [ ] CORS configuration
- [ ] Helmet for security headers
- [ ] JWT token management
- [ ] Role-based access control (RBAC)
- [ ] API key authentication for external services

### Performance Features
- [ ] Database query optimization
- [ ] Caching with Redis
- [ ] Connection pooling
- [ ] Request logging and monitoring
- [ ] API response compression

### Integration Points
- [ ] Supabase authentication bridge
- [ ] AI service communication
- [ ] External threat intelligence APIs
- [ ] File upload handling
- [ ] WebSocket for real-time updates

## 🔧 Development Setup (TODO)
```bash
# Installation
npm install

# Database setup
npx prisma migrate dev
npx prisma generate

# Development
npm run start:dev

# Testing
npm run test
npm run test:e2e

# Production build
npm run build
npm run start:prod
```

## 📚 Implementation Tasks
- [ ] Set up NestJS project structure
- [ ] Configure Prisma with PostgreSQL
- [ ] Implement authentication module
- [ ] Create user management endpoints
- [ ] Set up project management module
- [ ] Implement search functionality
- [ ] Add threat intelligence endpoints
- [ ] Create incident management system
- [ ] Set up report generation
- [ ] Add comprehensive testing
- [ ] Configure deployment pipeline
- [ ] Add API documentation
- [ ] Implement monitoring and logging

This architecture will provide a robust, scalable backend foundation for the cybersecurity platform.