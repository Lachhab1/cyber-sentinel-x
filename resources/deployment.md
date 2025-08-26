# Deployment Guide

## 🚀 Deployment Strategy

### Environment Setup

#### Development
- **Frontend**: Vite dev server (localhost:8080)
- **Backend**: Local API server (localhost:3000)
- **Database**: Local or development Supabase instance

#### Staging  
- **Frontend**: Lovable preview deployment
- **Backend**: Staging API endpoint
- **Database**: Staging database instance

#### Production
- **Frontend**: Static hosting (Netlify/Vercel)
- **Backend**: Production server (AWS/GCP/Azure)
- **Database**: Production database cluster

## 📁 Frontend Deployment

### Build Configuration
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

### Environment Variables
```bash
# .env.production
VITE_API_URL=https://api.xai-tech.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WS_URL=wss://api.xai-tech.com/ws
```

### Static Hosting Setup

#### Netlify
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### Vercel
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 🔧 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
        
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './frontend/dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔒 Security Configuration

### Content Security Policy
```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.xai-tech.com wss://api.xai-tech.com">
```

### Headers Configuration
```javascript
// For Netlify (_headers file)
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 📊 Performance Optimization

### Build Optimization
```javascript
// vite.config.ts production settings
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

### Asset Optimization
- **Images**: Compress and use WebP format
- **Fonts**: Preload critical fonts
- **Icons**: Use SVG sprites or icon fonts
- **Lazy Loading**: Implement for routes and heavy components

## 🔍 Monitoring & Analytics

### Error Tracking
```typescript
// src/lib/monitoring.ts
export const initializeMonitoring = () => {
  // Initialize Sentry or similar
  if (process.env.NODE_ENV === 'production') {
    // Set up error tracking
  }
};
```

### Performance Monitoring
```typescript
// src/lib/analytics.ts
export const trackPageView = (page: string) => {
  // Google Analytics or similar
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: page,
    });
  }
};
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Update environment variables
- [ ] Run full test suite
- [ ] Check bundle size
- [ ] Verify API endpoints
- [ ] Test authentication flow
- [ ] Check responsive design
- [ ] Validate accessibility

### Post-deployment
- [ ] Verify deployment URL
- [ ] Test critical user flows
- [ ] Check error monitoring
- [ ] Validate performance metrics
- [ ] Test real-time features
- [ ] Verify security headers
- [ ] Update documentation

## 🔄 Rollback Strategy

### Quick Rollback
```bash
# Netlify CLI rollback
netlify sites:list
netlify api deployments --site-id=SITE_ID
netlify api restoreSiteDeploy --site-id=SITE_ID --deploy-id=DEPLOY_ID
```

### Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard COMMIT_HASH
git push --force origin main
```

## 🌐 Multi-environment Management

### Environment-specific Builds
```javascript
// Different configs per environment
const configs = {
  development: {
    apiUrl: 'http://localhost:3000',
    enableDevTools: true,
  },
  staging: {
    apiUrl: 'https://staging-api.xai-tech.com',
    enableDevTools: true,
  },
  production: {
    apiUrl: 'https://api.xai-tech.com',
    enableDevTools: false,
  },
};
```