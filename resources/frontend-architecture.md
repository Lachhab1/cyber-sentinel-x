# Frontend Architecture

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AppSidebar.tsx  # Navigation sidebar
│   ├── ThemeProvider.tsx # Theme context
│   └── ThemeToggle.tsx # Dark/light mode toggle
├── pages/              # Route components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── AIAssistant.tsx # AI chat interface
│   ├── Incidents.tsx   # Security incidents
│   ├── ThreatIntelligence.tsx
│   ├── MitigationCenter.tsx
│   ├── Reports.tsx
│   ├── Settings.tsx
│   └── Auth.tsx        # Authentication
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication logic
│   ├── use-mobile.tsx  # Mobile detection
│   └── use-toast.ts    # Toast notifications
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client & types
├── lib/                # Utility functions
│   └── utils.ts        # Common utilities
└── App.tsx             # Main app component
```

## 🎨 Design System

### Theme Architecture
- **CSS Variables**: Defined in `src/index.css`
- **Tailwind Config**: Extended in `tailwind.config.ts`
- **Dark/Light Mode**: Managed by `ThemeProvider`

### Color Tokens
```css
/* Primary Brand Colors */
--primary: 220 91% 64%;           /* Cyber blue */
--primary-foreground: 210 40% 98%;

/* UI Colors */
--background: 222.2 84% 4.9%;     /* Dark background */
--foreground: 210 40% 98%;        /* Light text */
--card: 222.2 84% 4.9%;           /* Card background */
--border: 217.2 32.6% 17.5%;      /* Subtle borders */
```

### Component Variants
- **Buttons**: Default, outline, ghost, cyber (gradient)
- **Cards**: Standard with backdrop blur effects
- **Navigation**: Collapsible sidebar with stats badges

## 🔌 State Management

### Authentication
- **Hook**: `useAuth.tsx`
- **Provider**: Supabase Auth
- **Storage**: localStorage with session persistence

### Theme Management
- **Provider**: `ThemeProvider.tsx`
- **Toggle**: `ThemeToggle.tsx`
- **Storage**: localStorage preference

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large**: > 1280px

### Layout Strategy
- **Sidebar**: Collapsible on mobile
- **Grids**: Responsive column counts
- **Cards**: Stack on smaller screens

## 🛠️ Development Guidelines

### Component Creation
1. Use TypeScript for all components
2. Implement proper prop interfaces
3. Follow shadcn/ui patterns
4. Use semantic color tokens
5. Include proper accessibility

### Styling Best Practices
1. Use CSS variables from design system
2. Prefer utility classes over custom CSS
3. Implement proper dark/light mode support
4. Use semantic HTML elements

### Performance Considerations
1. Lazy load route components
2. Optimize bundle size with tree shaking
3. Use React.memo for expensive renders
4. Implement proper error boundaries

## 🔄 Integration Points

### Backend API
- **Base URL**: To be configured
- **Authentication**: Bearer token via Supabase
- **Error Handling**: Centralized error management

### Real-time Updates
- **WebSockets**: For live threat data
- **Supabase Realtime**: For collaborative features
- **Polling**: Fallback for critical updates

## 📊 Monitoring & Analytics

### Error Tracking
- Browser console logging
- Error boundary implementation
- User feedback collection

### Performance Metrics  
- Core Web Vitals monitoring
- Bundle size tracking
- Load time optimization