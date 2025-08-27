# XAI-Tech Branding Assets

## 🎨 Brand Identity

### Brand Colors
- **Primary Blue**: `#4A90E2` (HSL: 220, 91%, 64%)
- **Cyber Green**: `#00FF88` (Success/Online indicators)
- **Warning Orange**: `#FF8C42` (Alerts and warnings)
- **Critical Red**: `#FF4757` (Threats and errors)
- **Dark Background**: `#0F0F23` (Primary background)

### Typography
- **Primary Font**: Inter (for UI text)
- **Monospace Font**: JetBrains Mono (for code and data)
- **Cyber Font**: Custom cyber-style font for headers

## 📁 Asset Structure

```
/branding/
├── logos/
│   ├── logo-full.png           # Full logo with text
│   ├── logo-full.svg           # Vector version
│   ├── logo-symbol.png         # Icon/symbol only
│   ├── logo-symbol.svg         # Vector icon
│   ├── logo-mono.png           # Monochrome version
│   └── logo-mono.svg           # Vector monochrome
├── icons/
│   ├── favicon.ico             # Website favicon
│   ├── app-icon-192.png        # PWA icon 192x192
│   ├── app-icon-512.png        # PWA icon 512x512
│   └── apple-touch-icon.png    # iOS home screen icon
├── backgrounds/
│   ├── hero-bg.png             # Landing page hero
│   ├── cyber-grid.svg          # Grid pattern overlay
│   └── particles-bg.json       # Animated background
└── social/
    ├── og-image.png            # Open Graph image
    ├── twitter-card.png        # Twitter card image
    └── linkedin-banner.png     # LinkedIn company banner
```

## 🖼️ Logo Usage Guidelines

### Full Logo
- **Minimum Size**: 120px width
- **Clear Space**: Equal to the height of the "X" letter
- **Background**: Works best on dark backgrounds
- **Usage**: Headers, documentation, official materials

### Symbol/Icon
- **Minimum Size**: 24px x 24px
- **Usage**: Favicons, app icons, small UI elements
- **Variations**: Available in color, white, and monochrome

### Color Variations
- **Full Color**: Primary usage on dark backgrounds
- **White**: For dark backgrounds and overlays
- **Monochrome**: For single-color applications

## 🎯 Brand Voice & Messaging

### Key Messages
- **"Advanced Cybersecurity Through AI Innovation"**
- **"Intelligent Threat Detection & Response"**
- **"Secure. Automated. Intelligent."**

### Tone of Voice
- **Professional**: Technical accuracy and reliability
- **Innovative**: Cutting-edge AI and security tech
- **Trustworthy**: Security and privacy focused
- **Accessible**: Complex tech made understandable

## 📱 Application in UI

### Navigation Branding
```tsx
// Logo usage in AppSidebar
<div className="flex items-center gap-2 p-4 border-b">
  <img src="/branding/logo-symbol.png" alt="XAI-Tech" className="w-8 h-8" />
  <span className="font-bold text-lg">XAI-Tech</span>
</div>
```

### Loading States
```tsx
// Branded loading spinner
<div className="flex items-center gap-3 text-primary font-cyber">
  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  <span className="text-lg">Loading Security Matrix...</span>
</div>
```

### Status Indicators
```tsx
// Online status with brand colors
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-success/50 shadow-sm" />
  <span className="font-cyber font-medium">X-AutoPentest Online</span>
</div>
```

## 🎨 Design System Integration

### CSS Custom Properties
```css
/* Brand colors as CSS variables */
:root {
  --brand-primary: 220 91% 64%;
  --brand-success: 142 76% 36%;
  --brand-warning: 35 84% 62%;
  --brand-danger: 0 84% 60%;
  --brand-cyber: 158 100% 53%;
}
```

### Tailwind Extensions
```javascript
// tailwind.config.ts brand colors
theme: {
  extend: {
    colors: {
      brand: {
        primary: 'hsl(var(--brand-primary))',
        success: 'hsl(var(--brand-success))',
        warning: 'hsl(var(--brand-warning))',
        danger: 'hsl(var(--brand-danger))',
        cyber: 'hsl(var(--brand-cyber))',
      }
    }
  }
}
```

## 📄 Brand Documentation

### Logo Files (Placeholder)
**Note**: Actual logo files need to be created by a designer. Current placeholders include:

- `logo-full-placeholder.png` - Full logo placeholder
- `logo-symbol-placeholder.png` - Icon placeholder  
- `logo-mono-placeholder.png` - Monochrome placeholder

### Design Specifications
- **Logo Dimensions**: 16:9 aspect ratio for full logo
- **Icon Dimensions**: 1:1 aspect ratio (square)
- **Color Space**: sRGB for digital, CMYK for print
- **File Formats**: SVG (vector), PNG (raster), ICO (favicon)

### Usage Rights
- Internal use for XAI-Tech platform development
- External use requires approval from project lead
- No modification without designer approval
- Credit XAI-Tech in all external usage

## 🔄 Brand Evolution

As the platform develops, the branding may evolve to reflect:
- Enhanced AI capabilities
- Enterprise market positioning  
- User feedback and preferences
- Technical platform improvements

Regular brand reviews will ensure consistency and effectiveness across all platform touchpoints.