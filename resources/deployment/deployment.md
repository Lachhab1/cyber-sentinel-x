# Deployment Guide

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher  
- **Git**: Latest version

### Quick Start
```bash
# Clone the repository
git clone https://github.com/xai-tech/cybersecurity-platform.git
cd cybersecurity-platform

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev

# Open browser to http://localhost:8080
```

### Environment Configuration
Create a `.env.local` file in the frontend directory:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://rrhrfigkmrjexhsyxmkr.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Settings
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000
```

## 🐳 Docker Development (Future)

### Full Stack with Docker Compose
```yaml
# docker-compose.yml (planned)
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "8080:8080"
    environment:
      - VITE_API_BASE_URL=http://localhost:3000
      - VITE_AI_SERVICE_URL=http://localhost:8000
    depends_on:
      - backend
      - ai-service

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/cybersec
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - db
      - redis

  ai-service:
    build: ./model-ai
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=cybersec
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Starting the Full Stack
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## ☁️ Production Deployment

### Frontend Deployment (Lovable)
The frontend is currently deployed via Lovable's platform:

1. **Automatic Deployment**: Changes to main branch trigger automatic deployments
2. **Custom Domain**: Can be configured in Lovable project settings
3. **Environment Variables**: Set in Lovable project configuration
4. **SSL**: Automatically handled by Lovable

### Frontend Deployment (Alternative - Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd frontend
vercel --prod

# Configure environment variables in Vercel dashboard
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_API_BASE_URL
```

### Backend Deployment (Planned - Railway/Render)
```bash
# Backend deployment configuration
# TODO: Implement when backend is ready

# Example for Railway:
railway login
railway add
railway up

# Example for Render:
# Connect GitHub repository in Render dashboard
# Configure build command: npm install && npm run build
# Configure start command: npm run start:prod
```

### AI Services Deployment (Planned - Hugging Face Spaces)
```bash
# AI service deployment
# TODO: Implement when AI services are ready

# Example Dockerfile for HF Spaces:
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

## 🔧 Configuration Management

### Environment Variables by Service

#### Frontend (React + Vite)
```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional
VITE_API_BASE_URL=https://api.your-domain.com
VITE_AI_SERVICE_URL=https://ai.your-domain.com
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=your_analytics_id
```

#### Backend (NestJS - Planned)
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# External Services
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

# AI Service
AI_SERVICE_URL=http://ai-service:8000
AI_SERVICE_API_KEY=your_ai_api_key

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
```

#### AI Services (FastAPI - Planned)
```bash
# Model Configuration
MODEL_PATH=/app/models
HUGGING_FACE_TOKEN=your_hf_token

# Vector Database
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment

# Caching
REDIS_URL=redis://redis:6379

# Monitoring
MLFLOW_TRACKING_URI=http://mlflow:5000
WANDB_API_KEY=your_wandb_key
```

## 📊 Monitoring & Observability

### Frontend Monitoring
```javascript
// Error tracking with Sentry (planned)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Backend Monitoring (Planned)
```typescript
// Health check endpoint
@Get('/health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION
  };
}

// Metrics collection
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
```

### AI Services Monitoring (Planned)
```python
# Model performance tracking
from mlflow import log_metric, log_param

def track_prediction(model_name, latency, accuracy):
    log_param("model_name", model_name)
    log_metric("latency_ms", latency)
    log_metric("accuracy", accuracy)
```

## 🔒 Security Considerations

### SSL/TLS Configuration
- **Frontend**: Handled automatically by deployment platforms
- **Backend**: Configure reverse proxy (nginx) with Let's Encrypt
- **AI Services**: Use HTTPS endpoints in production

### API Security
- **Rate Limiting**: Implement per-IP and per-user limits
- **CORS**: Configure allowed origins
- **Authentication**: JWT tokens with refresh mechanism
- **Input Validation**: Sanitize all user inputs

### Database Security
- **Connection Encryption**: Use SSL connections
- **Access Control**: Principle of least privilege
- **Backup Encryption**: Encrypt database backups
- **Monitoring**: Log all database access

## 📋 Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Security scanning completed

### Post-deployment
- [ ] Health checks passing
- [ ] Performance metrics baseline established
- [ ] Error tracking configured
- [ ] User acceptance testing completed
- [ ] Documentation updated
- [ ] Team training completed

### Rollback Plan
- [ ] Database backup created
- [ ] Previous version tagged
- [ ] Rollback procedure documented
- [ ] Communication plan ready
- [ ] Monitoring alerts configured

This deployment guide will be updated as the backend and AI services are implemented and integrated into the platform.