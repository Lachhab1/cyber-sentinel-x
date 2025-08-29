# XAI-Tech Frontend-Backend Integration Guide

## 🎉 **SUCCESS: Full Integration Complete!**

Your XAI-Tech application is now fully integrated with a custom NestJS backend instead of Supabase. The frontend connects seamlessly to your backend API and uses the comprehensive logging system we set up.

## 📊 **Current Status**

### ✅ **Backend (NestJS)**

- **Status**: Running on http://localhost:4000
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with secure endpoints
- **Logging**: Winston + Grafana + Loki + Promtail
- **API Documentation**: Swagger at http://localhost:4000/api/docs

### ✅ **Frontend (React + Vite)**

- **Status**: Running on http://localhost:8080
- **Authentication**: Connected to backend API
- **State Management**: React Context + Custom hooks
- **UI**: Shadcn/ui components with cyber theme
- **Routing**: React Router with protected routes

### ✅ **Monitoring Stack**

- **Grafana**: http://localhost:3000 (admin/admin123)
- **Loki**: Log aggregation on port 3100
- **Promtail**: Log collection running
- **PostgreSQL**: Database on port 5432

## 🚀 **How to Use**

### **1. Start the Complete Stack**

#### **Option A: Quick Start (Recommended)**

```bash
# Terminal 1: Start backend services
cd backend
./start-dev.sh

# Terminal 2: Start frontend
cd frontend
npm run dev
```

#### **Option B: Manual Start**

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### **2. Access Your Application**

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs
- **Grafana Dashboard**: http://localhost:3000

### **3. Default Login Credentials**

- **Email**: admin@xai-tech.com
- **Password**: admin123

## 🔧 **API Integration Details**

### **Authentication Flow**

1. User enters credentials on frontend
2. Frontend sends POST to `/api/auth/login`
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent requests include `Authorization: Bearer <token>`

### **Key API Endpoints**

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
GET  /api/auth/profile

// Users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

// Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

// Threats
GET    /api/threats
POST   /api/threats
GET    /api/threats/:id
PUT    /api/threats/:id
DELETE /api/threats/:id

// Incidents
GET    /api/incidents
POST   /api/incidents
GET    /api/incidents/:id
PATCH  /api/incidents/:id/status
DELETE /api/incidents/:id

// Search
GET /api/search?q=<query>
GET /api/search/threats?q=<query>
GET /api/search/incidents?q=<query>
```

### **Frontend API Client**

The frontend uses a comprehensive API client (`src/lib/api.ts`) that provides:

- Automatic token management
- Error handling
- Type-safe requests
- Convenient methods for all endpoints

## 📝 **Logging & Monitoring**

### **Application Logs**

- **Location**: `backend/logs/`
- **Format**: JSON structured logs
- **Rotation**: Daily with 14-day retention
- **Levels**: error, warn, info, debug, verbose

### **Grafana Dashboard**

- **URL**: http://localhost:3000
- **Credentials**: admin/admin123
- **Features**:
  - Real-time log viewing
  - Log volume metrics
  - Error rate monitoring
  - Custom queries with LogQL

### **Log Queries Examples**

```logql
# All application logs
{job="applogs"}

# Error logs only
{job="applogs", level="error"}

# Login attempts
{job="applogs"} |= "login"

# Recent activity
{job="applogs"} | json | timestamp > now() - 1h
```

## 🔒 **Security Features**

### **Backend Security**

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with class-validator
- CORS configuration
- Rate limiting (can be added)

### **Frontend Security**

- Token-based authentication
- Protected routes
- Automatic token refresh
- Secure token storage
- Input sanitization

## 🛠️ **Development Workflow**

### **Adding New Features**

1. **Backend**: Add new endpoints in NestJS modules
2. **Frontend**: Add corresponding API methods in `api.ts`
3. **Types**: Update TypeScript interfaces
4. **UI**: Create React components
5. **Testing**: Test API integration

### **Database Changes**

1. Update Prisma schema (`backend/prisma/schema.prisma`)
2. Generate migration: `npm run prisma:migrate`
3. Update TypeScript types: `npm run prisma:generate`

### **Logging Best Practices**

```typescript
// In your services
this.logger.log("User action performed", "ServiceName");
this.logger.warn("Warning message", "ServiceName");
this.logger.error("Error occurred", "ServiceName");

// With metadata
this.logger.logWithMetadata(
  "User action",
  { userId: "123", action: "login" },
  "AuthService"
);
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Backend not starting**

   ```bash
   cd backend
   npm install
   npm run prisma:generate
   npm run start:dev
   ```

2. **Frontend can't connect to backend**

   - Check if backend is running on port 4000
   - Verify CORS settings in backend
   - Check browser console for errors

3. **Authentication failing**

   - Verify default credentials: admin@xai-tech.com / admin123
   - Check backend logs for errors
   - Clear localStorage and try again

4. **Grafana not loading**
   - Check if all Docker services are running
   - Verify Grafana is accessible on port 3000
   - Check Docker logs: `docker-compose logs grafana`

### **Useful Commands**

```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Clean restart
docker-compose down && docker-compose up -d
```

## 🎯 **Next Steps**

### **Immediate Improvements**

1. Add more comprehensive error handling
2. Implement real-time notifications
3. Add file upload functionality
4. Enhance dashboard with more metrics

### **Future Enhancements**

1. Add AI integration for threat analysis
2. Implement real-time collaboration features
3. Add advanced reporting capabilities
4. Integrate with external security tools

## 📞 **Support**

If you encounter any issues:

1. Check the logs in `backend/logs/`
2. View Grafana dashboard for system metrics
3. Check browser console for frontend errors
4. Verify all services are running

---

**🎉 Congratulations! Your XAI-Tech platform is now fully operational with a custom backend and comprehensive monitoring!**
