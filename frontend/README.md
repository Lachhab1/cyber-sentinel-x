# XAI-Tech Frontend

Modern React-based cybersecurity platform frontend with AI integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Route components  
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
└── integrations/   # External service integrations
```

## 🎨 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Supabase** for backend services

## 🔧 Configuration

### Environment Variables
Create `.env.local` file:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Theme Customization
Edit `src/index.css` and `tailwind.config.ts` to customize the design system.

## 📱 Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching with persistence  
- **Authentication**: Supabase-powered auth system
- **Real-time Updates**: Live data synchronization
- **AI Assistant**: Interactive chat interface
- **Dashboard**: Comprehensive security overview

## 🔌 Backend Integration

Ready for integration with custom backend APIs. See [API Integration Guide](../resources/api-integration.md) for details.

## 📋 Development Guidelines

1. Use TypeScript for all components
2. Follow the established component patterns
3. Use semantic design tokens from the design system
4. Implement proper error handling
5. Add loading states for async operations

## 🚢 Deployment

The frontend is designed to be deployed as a static site. See [Deployment Guide](../resources/deployment.md) for detailed instructions.

## 📚 Documentation

- [Frontend Architecture](../resources/frontend-architecture.md)
- [API Integration](../resources/api-integration.md)  
- [Deployment Guide](../resources/deployment.md)