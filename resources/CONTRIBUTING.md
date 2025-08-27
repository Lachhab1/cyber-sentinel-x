# Contributing to XAI-Tech Cybersecurity Platform

## 🤝 Welcome Contributors

Thank you for your interest in contributing to the XAI-Tech cybersecurity platform! This guide will help you understand our development process and how to contribute effectively.

## 🏗️ Project Structure

```
/
├── frontend/           # React + Vite frontend application
├── backend/           # NestJS backend API (planned)
├── model-ai/          # FastAPI AI services (planned)
└── resources/         # Documentation and project resources
```

## 🔧 Development Setup

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: Latest version
- **VS Code**: Recommended editor with extensions

### Getting Started
```bash
# Clone the repository
git clone https://github.com/xai-tech/cybersecurity-platform.git
cd cybersecurity-platform

# Set up frontend
cd frontend
npm install
npm run dev

# Open http://localhost:8080
```

### Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**

## 📋 Contribution Guidelines

### Branch Naming Convention
```bash
# Feature branches
feature/user-authentication
feature/threat-dashboard
feature/ai-chat-interface

# Bug fixes
bugfix/sidebar-navigation
bugfix/responsive-layout
bugfix/auth-token-refresh

# Documentation updates
docs/api-integration-guide
docs/deployment-instructions
docs/component-documentation

# Hotfixes (critical production issues)
hotfix/security-vulnerability
hotfix/login-failure
```

### Commit Message Format
```bash
# Format: type(scope): description

# Examples:
feat(auth): add JWT token refresh mechanism
fix(dashboard): resolve responsive layout issues
docs(readme): update installation instructions
style(components): improve button component styling
refactor(api): reorganize endpoint structure
test(utils): add unit tests for helper functions
chore(deps): update dependencies to latest versions
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD configuration changes

## 🎨 Code Style Guidelines

### TypeScript Standards
```typescript
// Use explicit types for function parameters and returns
function processSecurityEvent(event: SecurityEvent): ProcessedEvent {
  return {
    id: event.id,
    severity: event.severity,
    timestamp: new Date(event.timestamp),
  };
}

// Use interfaces for object types
interface SecurityEvent {
  id: string;
  type: 'threat' | 'vulnerability' | 'incident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
}

// Use enums for constants
enum EventSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}
```

### React Component Standards
```tsx
// Use function components with TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  children 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-colors',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Styling Guidelines
```tsx
// ✅ Use semantic design tokens
<div className="bg-card text-card-foreground border border-border">
  <h2 className="text-foreground font-semibold">Security Alert</h2>
  <p className="text-muted-foreground">Threat detected in system</p>
</div>

// ❌ Avoid direct colors
<div className="bg-white text-black border border-gray-300">
  <h2 className="text-gray-900 font-semibold">Security Alert</h2>
  <p className="text-gray-600">Threat detected in system</p>
</div>

// ✅ Use responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ Use semantic HTML
<main>
  <section aria-labelledby="dashboard-heading">
    <h1 id="dashboard-heading">Security Dashboard</h1>
  </section>
</main>
```

### File Organization
```
src/
├── components/
│   ├── ui/                 # Base UI components
│   ├── forms/              # Form-specific components
│   ├── charts/             # Data visualization
│   └── layout/             # Layout components
├── pages/
│   ├── dashboard/          # Dashboard-related pages
│   ├── auth/               # Authentication pages
│   └── settings/           # Settings pages
├── hooks/
│   ├── auth/               # Authentication hooks
│   ├── api/                # API interaction hooks
│   └── ui/                 # UI state hooks
├── lib/
│   ├── api/                # API client and types
│   ├── utils/              # Utility functions
│   └── validation/         # Form validation schemas
└── types/
    ├── api.ts              # API response types
    ├── user.ts             # User-related types
    └── security.ts         # Security entity types
```

## 🧪 Testing Standards

### Component Testing
```tsx
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### API Testing (Planned)
```typescript
// Example API test for backend
describe('Security Events API', () => {
  it('should create a new security event', async () => {
    const event = {
      type: 'threat',
      severity: 'high',
      description: 'Suspicious network activity detected'
    };

    const response = await request(app)
      .post('/api/events')
      .send(event)
      .expect(201);

    expect(response.body.type).toBe(event.type);
    expect(response.body.severity).toBe(event.severity);
  });
});
```

## 🔄 Pull Request Process

### Before Submitting
1. **Ensure all tests pass**: `npm run test`
2. **Check code formatting**: `npm run lint`
3. **Verify build succeeds**: `npm run build`
4. **Update documentation** if needed
5. **Add tests** for new functionality

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
```

### Review Process
1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one team member reviews the PR
3. **Testing**: Changes are tested in staging environment
4. **Approval**: PR is approved and merged by maintainer

## 🐛 Issue Reporting

### Bug Reports
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Firefox, Safari]
 - Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## 🎯 Development Focus Areas

### Current Priorities
1. **Frontend Component Library**: Expanding the UI component system
2. **Responsive Design**: Ensuring mobile-first responsive layouts
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Optimizing bundle size and load times
5. **Documentation**: Comprehensive component and API documentation

### Future Priorities
1. **Backend Integration**: NestJS API development
2. **AI Services**: FastAPI ML model integration  
3. **Real-time Features**: WebSocket implementation
4. **Testing Coverage**: Comprehensive test suite
5. **DevOps**: CI/CD pipeline enhancement

## 📚 Learning Resources

### Frontend Development
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Security Domain Knowledge
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)

## 🤔 Questions & Support

### Getting Help
- **Documentation**: Check `/resources` folder first
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Team Chat**: Internal team communication channels

### Mentorship
New contributors are paired with experienced team members for:
- Code review guidance
- Architecture decision understanding
- Domain knowledge transfer
- Best practices learning

## 🏆 Recognition

Contributors are recognized through:
- **Code Credits**: Attribution in significant contributions
- **Documentation**: Contributor profiles in project docs
- **Community**: Highlighting contributions in team communications
- **Growth**: Opportunities for increased responsibility

Thank you for contributing to making cybersecurity more intelligent and accessible! 🔒🤖