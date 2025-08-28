# 🚀 XAI-Tech Cybersecurity Platform - Setup Guide

This guide will walk you through setting up the complete XAI-Tech Cybersecurity Platform on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (v14 or higher)
- **Git** for version control
- **Docker** (optional, for containerized setup)

### System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/xai-tech/cyber-sentinel-x.git
cd cyber-sentinel-x
```

### 2. Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/xai_tech_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# Application Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:8080,http://localhost:3000"

# Optional: External Services
AI_SERVICE_URL="http://localhost:5000"
THREAT_INTEL_API_KEY="your-api-key"
```

#### 2.3 Database Setup

1. **Create PostgreSQL Database**:

```sql
CREATE DATABASE xai_tech_db;
CREATE USER xai_tech_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE xai_tech_db TO xai_tech_user;
```

2. **Run Database Migrations**:

```bash
npm run prisma:generate
npm run prisma:migrate
```

3. **Seed the Database**:

```bash
npm run prisma:seed
```

#### 2.4 Start Backend Server

```bash
# Development mode with hot reload
npm run start:dev

# Or production mode
npm run build
npm run start:prod
```

The backend API will be available at `http://localhost:4000`

### 3. Frontend Setup

#### 3.1 Install Dependencies

```bash
cd ../frontend
npm install
```

#### 3.2 Environment Configuration

Create a `.env` file in the frontend directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:4000

# Application Configuration
VITE_APP_NAME="XAI-Tech Cybersecurity Platform"
VITE_APP_VERSION="1.0.0"

# Optional: External Services
VITE_AI_SERVICE_URL=http://localhost:5000
```

#### 3.3 Start Frontend Development Server

```bash
npm run dev
```

The frontend application will be available at `http://localhost:8080`

## 🐳 Docker Setup (Alternative)

If you prefer using Docker, you can set up the entire platform using Docker Compose.

### 1. Docker Compose Setup

Create a `docker-compose.yml` file in the root directory:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: xai_tech_db
      POSTGRES_USER: xai_tech_user
      POSTGRES_PASSWORD: xai_tech_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://xai_tech_user:xai_tech_password@postgres:5432/xai_tech_db
      JWT_SECRET: your-super-secret-jwt-key-here
      NODE_ENV: development
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "8080:8080"
    environment:
      VITE_API_BASE_URL: http://localhost:4000
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### 2. Run with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Development Tools

### 1. Database Management

#### Prisma Studio

Access the database GUI:

```bash
cd backend
npm run prisma:studio
```

This will open Prisma Studio at `http://localhost:5555`

#### Database Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Reset database
npm run prisma:migrate:reset

# Seed database
npm run prisma:seed
```

### 2. Code Quality Tools

#### Linting and Formatting

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
```

#### Type Checking

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### 3. Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:watch
npm run test:cov

# Frontend tests (when implemented)
cd frontend
npm run test
```

## 📊 Initial Data Setup

### 1. Default Users

The seed script creates the following default users:

```javascript
// Admin user
{
  email: "admin@xai-tech.com",
  password: "admin123",
  displayName: "System Administrator",
  role: "admin"
}

// Regular user
{
  email: "user@xai-tech.com",
  password: "user123",
  displayName: "Security Analyst",
  role: "user"
}
```

### 2. Sample Data

The seed script also creates:

- Sample projects
- Sample incidents
- Sample threats
- Sample reports

## 🔐 Security Configuration

### 1. JWT Configuration

Update the JWT secret in your `.env` file:

```env
JWT_SECRET="your-very-long-and-secure-jwt-secret-key"
```

### 2. Database Security

```sql
-- Create a dedicated user with limited privileges
CREATE USER xai_tech_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE xai_tech_db TO xai_tech_app;
GRANT USAGE ON SCHEMA public TO xai_tech_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO xai_tech_app;
```

### 3. CORS Configuration

Update CORS settings in `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:8080"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

## 🚀 Production Deployment

### 1. Environment Variables

Create production environment files:

```env
# Backend .env.production
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="production-jwt-secret"
PORT=4000
CORS_ORIGIN="https://your-domain.com"
```

```env
# Frontend .env.production
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_NAME="XAI-Tech Cybersecurity Platform"
```

### 2. Build for Production

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
```

### 3. Deployment Options

#### Option A: Traditional Server

1. Set up a Linux server (Ubuntu 20.04+)
2. Install Node.js, PostgreSQL, and Nginx
3. Configure Nginx as reverse proxy
4. Use PM2 for process management

#### Option B: Cloud Platforms

- **Heroku**: Use Heroku Postgres and deploy via Git
- **AWS**: Use RDS for database and EC2/ECS for application
- **Google Cloud**: Use Cloud SQL and Cloud Run
- **Azure**: Use Azure Database and App Service

#### Option C: Container Orchestration

- **Kubernetes**: Deploy using Helm charts
- **Docker Swarm**: Use Docker Compose for production
- **AWS ECS**: Use Fargate for serverless containers

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U xai_tech_user -d xai_tech_db
```

#### 2. Port Conflicts

```bash
# Check what's using port 4000
lsof -i :4000

# Check what's using port 8080
lsof -i :8080
```

#### 3. Node Modules Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Prisma Issues

```bash
# Reset Prisma
npx prisma generate
npx prisma migrate reset
npx prisma db push
```

### Logs and Debugging

#### Backend Logs

```bash
# Development logs
npm run start:dev

# Production logs
npm run start:prod
```

#### Frontend Logs

```bash
# Development logs
npm run dev

# Build logs
npm run build
```

#### Database Logs

```bash
# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

## 📚 Additional Resources

### Documentation

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### API Documentation

Once the backend is running, visit:

- Swagger UI: `http://localhost:4000/api/docs`
- API Health Check: `http://localhost:4000/api/health`

### Support

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/xai-tech/cyber-sentinel-x/issues)
- **Discussions**: [Community discussions](https://github.com/xai-tech/cyber-sentinel-x/discussions)
- **Wiki**: [Additional documentation](https://github.com/xai-tech/cyber-sentinel-x/wiki)

## 🎉 Next Steps

After successful setup:

1. **Explore the Application**: Visit `http://localhost:8080` and log in with the default credentials
2. **Review the API**: Check out the Swagger documentation at `http://localhost:4000/api/docs`
3. **Customize Configuration**: Update environment variables for your specific needs
4. **Add Sample Data**: Create additional users, projects, and incidents
5. **Integrate External Services**: Connect threat intelligence feeds and AI services
6. **Deploy to Production**: Follow the production deployment guide

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to:

- Report bugs
- Suggest features
- Submit pull requests
- Join the development team

---

**Happy coding! 🚀**

For any questions or issues, please don't hesitate to reach out to our team.
