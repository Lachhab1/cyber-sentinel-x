# Frontend Architecture

## 🏗️ Project Structure

The frontend follows a clean, modular architecture optimized for maintainability and scalability.

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui component library
│   ├── AppSidebar.tsx  # Main navigation sidebar
│   ├── ThemeProvider.tsx # Theme context provider
│   ├── ThemeToggle.tsx # Dark/light mode toggle
│   └── index.ts        # Component exports
├── pages/              # Route-level components
│   ├── Dashboard.tsx   # Main dashboard overview
│   ├── Login.tsx       # Authentication page
│   ├── Search.tsx      # Security search interface
│   ├── Settings.tsx    # Application settings
│   ├── Incidents.tsx   # Security incident management
│   ├── ThreatIntelligence.tsx # Threat analysis
│   ├── MitigationCenter.tsx # Response center
│   ├── Reports.tsx     # Security reports
│   ├── AIAssistant.tsx # AI chat interface
│   ├── NotFound.tsx    # 404 error page
│   └── index.ts        # Page exports
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication logic
│   ├── use-mobile.tsx  # Mobile device detection
│   ├── use-toast.ts    # Toast notification system
│   └── index.ts        # Hook exports
├── lib/                # Utility functions and services
│   ├── utils.ts        # Common utility functions
│   ├── api.ts          # API client and integration layer
│   └── index.ts        # Library exports
├── integrations/       # External service integrations
│   ├── supabase/       # Supabase client configuration
│   │   ├── client.ts   # Supabase client setup
│   │   └── types.ts    # Database type definitions
│   └── index.ts        # Integration exports
├── styles/             # Global styles and theme
│   └── index.css       # Tailwind CSS and custom styles
└── main.tsx            # Application entry point
```

## 🎨 Design System

### Theme Architecture
- **CSS Variables**: Semantic color tokens defined in `src/index.css`
- **Tailwind Configuration**: Extended theme in `tailwind.config.ts`
- **Component Variants**: Consistent styling across all UI components
- **Dark/Light Mode**: Full theme switching with system preference detection

### Color System
```css
/* Semantic Color Tokens */
--primary: 220 91% 64%;           /* Brand blue */
--primary-foreground: 210 40% 98%;
--secondary: 210 40% 95%;
--secondary-foreground: 222.2 84% 4.9%;
--success: 142 76% 36%;
--warning: 35 84% 62%;
--destructive: 0 84% 60%;
--muted: 210 40% 95%;
--accent: 210 40% 95%;
```

### Component Standards
- **Consistent Spacing**: 4px base unit system
- **Typography Scale**: Harmonious font size progression
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG 2.1 AA compliance

## 🔌 State Management

### Authentication State
- **Provider**: `AuthProvider` wraps the entire application
- **Hook**: `useAuth()` provides authentication context
- **Persistence**: Session stored in localStorage via Supabase
- **Protected Routes**: Automatic redirection for unauthenticated users

### UI State
- **Theme**: Managed by `ThemeProvider` with system preference detection
- **Toasts**: Centralized notification system via `useToast`
- **Sidebar**: Collapsible navigation with state persistence

### Data Fetching
- **Library**: TanStack Query for server state management
- **Caching**: Intelligent cache invalidation and background updates
- **Error Handling**: Centralized error boundary system

## 📱 Responsive Design

### Breakpoint Strategy
```css
/* Tailwind Breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Small desktop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

### Layout Patterns
- **Sidebar Navigation**: Collapsible on mobile, persistent on desktop
- **Grid Systems**: Responsive column counts with CSS Grid
- **Card Layouts**: Flexible containers that stack on smaller screens
- **Form Layouts**: Single column on mobile, multi-column on desktop

## 🛠️ Development Standards

### Component Creation Guidelines
1. **TypeScript First**: All components must have proper type definitions
2. **Props Interface**: Define clear interfaces for component props
3. **Forwarded Refs**: Use `forwardRef` for components that need ref access
4. **Default Props**: Provide sensible defaults for optional props
5. **Error Boundaries**: Wrap components that might fail

### Code Organization
```typescript
// Component file structure
import { } from 'react';
import { } from 'external-libraries';
import { } from '@/components/ui';
import { } from '@/lib';

// Types and interfaces
interface ComponentProps {
  // prop definitions
}

// Component implementation
export default function Component(props: ComponentProps) {
  // hooks
  // state
  // effects
  // handlers
  // render
}
```

### Styling Best Practices
1. **Semantic Tokens**: Use CSS variables from the design system
2. **Utility Classes**: Prefer Tailwind utilities over custom CSS
3. **Component Variants**: Use `class-variance-authority` for component variants
4. **Responsive Classes**: Apply mobile-first responsive utilities
5. **Dark Mode**: Ensure all components work in both light and dark themes

## 🔗 Integration Points

### Backend Communication
- **API Layer**: Centralized in `src/lib/api.ts`
- **Type Safety**: Full TypeScript coverage for API responses
- **Error Handling**: Consistent error management across all endpoints
- **Loading States**: Built-in loading indicators for async operations

### Real-time Features
- **WebSocket Connection**: Managed connection lifecycle
- **Event Handlers**: Centralized event processing
- **State Synchronization**: Automatic UI updates from real-time events
- **Connection Recovery**: Automatic reconnection with exponential backoff

### External Services
- **Supabase**: Authentication and real-time database
- **Future Backend**: RESTful API integration ready
- **AI Services**: Prepared for ML model integration

## 📊 Performance Optimizations

### Bundle Optimization
- **Tree Shaking**: Dead code elimination
- **Code Splitting**: Route-based lazy loading
- **Dynamic Imports**: Component-level code splitting
- **Bundle Analysis**: Regular bundle size monitoring

### Runtime Performance
- **Memo Usage**: Strategic `React.memo` implementation
- **Callback Optimization**: `useCallback` for expensive operations
- **Virtual Scrolling**: For large data sets
- **Image Optimization**: Lazy loading and responsive images

### Loading Strategies
- **Skeleton Loading**: Better perceived performance
- **Progressive Enhancement**: Core functionality first
- **Prefetching**: Strategic resource preloading
- **Caching**: Aggressive caching with smart invalidation

## 🔧 Build Configuration

### Vite Configuration
```typescript
// vite.config.ts optimizations
export default defineConfig({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-*']
        }
      }
    }
  }
});
```

### TypeScript Configuration
- **Strict Mode**: Full type checking enabled
- **Path Mapping**: Clean import paths with `@/` alias
- **Build Optimization**: Optimized for production builds

## 🚀 Deployment Readiness

### Environment Management
- **Development**: Local development with hot reload
- **Staging**: Preview deployments for testing
- **Production**: Optimized builds with minification

### CI/CD Integration
- **Type Checking**: Pre-commit TypeScript validation
- **Linting**: ESLint with React and accessibility rules
- **Testing**: Jest and React Testing Library setup
- **Build Verification**: Automated build success validation

This architecture provides a solid foundation for a scalable, maintainable cybersecurity platform while remaining flexible for future enhancements and integrations.