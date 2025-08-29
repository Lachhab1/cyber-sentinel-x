# XAI-Tech Backend

NestJS backend for the XAI-Tech Cybersecurity Platform with PostgreSQL and Prisma ORM.

## 🚀 Features

- **Authentication**: JWT-based authentication with Supabase bridge
- **User Management**: CRUD operations for users
- **Project Management**: Secure project creation and management
- **Threat Intelligence**: Threat tracking and AI analysis
- **Incident Management**: Security incident tracking and status updates
- **Report Generation**: Automated security reports
- **Search**: Global search across all entities
- **Logging & Monitoring**: Structured logging with Grafana, Loki, and Promtail
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Comprehensive unit tests

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/xai_tech
   JWT_SECRET=your-super-secret-key
   PORT=4000
   NODE_ENV=development
   ```

4. **Set up the complete stack with Docker Compose**

   ```bash
   # Start all services (PostgreSQL, Grafana, Loki, Promtail)
   docker-compose up -d

   # Or manually create a PostgreSQL database
   createdb xai_tech
   ```

5. **Run database migrations**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

## 🚀 Running the Application

### Quick Start (Recommended)

```bash
# Make the startup script executable (first time only)
chmod +x start-dev.sh

# Start the complete development environment
./start-dev.sh
```

This will:

- Install dependencies
- Generate Prisma client
- Start all Docker services (PostgreSQL, Grafana, Loki, Promtail)
- Run database migrations
- Seed the database
- Start the development server

### Manual Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:4000/api/docs
```

## 📊 Monitoring & Logging

### Grafana Dashboard

Access the Grafana dashboard at:

```
http://localhost:3000
```

- **Username**: admin
- **Password**: admin123

### Log Collection

The application uses a comprehensive logging stack:

- **Grafana**: Dashboard and visualization
- **Loki**: Log aggregation and storage
- **Promtail**: Log collection and shipping
- **Winston**: Structured logging in the application

### Log Files

Application logs are stored in the `logs/` directory:

- `combined-YYYY-MM-DD.log`: All logs
- `error-YYYY-MM-DD.log`: Error logs only
- `info-YYYY-MM-DD.log`: Info logs only
- `warn-YYYY-MM-DD.log`: Warning logs only
- `debug-YYYY-MM-DD.log`: Debug logs only

## 🔐 Authentication

The API uses JWT-based authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Users (after seeding)

- **Admin**: `admin@xai-tech.com` / `admin123`
- **User**: `user@xai-tech.com` / `user123`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get current user profile

### Users

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects

- `POST /api/projects` - Create new project
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Threats

- `POST /api/threats` - Create new threat
- `GET /api/threats` - List all threats
- `GET /api/threats/analysis` - Get AI threat analysis
- `GET /api/threats/:id` - Get threat details
- `PUT /api/threats/:id` - Update threat
- `DELETE /api/threats/:id` - Delete threat

### Incidents

- `POST /api/incidents` - Create new incident
- `GET /api/incidents` - List all incidents
- `GET /api/incidents/:id` - Get incident details
- `PATCH /api/incidents/:id/status` - Update incident status
- `DELETE /api/incidents/:id` - Delete incident

### Reports

- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/:id/download` - Download report

### Search

- `GET /api/search?q=<query>` - Global search
- `GET /api/search/threats?q=<query>` - Search threats
- `GET /api/search/incidents?q=<query>` - Search incidents

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and user management
- **Projects**: Security projects and assessments
- **Threats**: Security threats and vulnerabilities
- **Incidents**: Security incidents and responses
- **Reports**: Generated security reports

## 🧪 Testing

The application includes comprehensive unit tests for core services:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development

### Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t xai-tech-backend .

# Run container
docker run -p 4000:4000 xai-tech-backend
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:password@host:5432/xai_tech
JWT_SECRET=your-production-secret-key
PORT=4000
NODE_ENV=production
```

## 🔗 Integration

This backend is designed to integrate with:

- **Frontend**: React/Vue.js application
- **AI Service**: Machine learning model service
- **Supabase**: Authentication and real-time features

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 🆘 Support

For support and questions, please open an issue in the repository.
