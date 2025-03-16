# MongoDB UI Components

This directory contains the core UI components for the MongoDB Developer's Launch Pad. These components are built with Tailwind CSS and styled according to MongoDB's design language.

## Available Components

### Core UI Components

- **Button** - Multi-variant button component
- **Card** - Flexible card component with header, content, and footer
- **Badge** - Labels and badges with various styles
- **Spinner** - Loading indicators in multiple sizes
- **Toast** - Notification system

### Form Components

- **Input** - Text input field
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection component
- **Checkbox** - Checkbox input component
- **Dropdown Menu** - Hierarchical dropdown menus

## Usage

All components are designed as React components with TypeScript support. Import them directly:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
// etc.
```

## Design Principles

These components follow these design principles:

1. **MongoDB Design Language** - Colors, spacing, and typography adhere to MongoDB's design system
2. **Accessibility** - All components are built with accessibility in mind
3. **Customization** - Components accept standard props and can be extended with Tailwind classes
4. **Server Components Ready** - Components are compatible with Next.js App Router
5. **Type Safety** - Full TypeScript support

## Client vs. Server Components

Components marked with "use client" are Client Components that can use React hooks and browser APIs. These include:

- Interactive components (buttons with click handlers)
- Components using useState/useEffect
- Components using browser-only APIs

Server Components don't have "use client" and are rendered on the server, improving performance.

## Adding New Components

When adding new UI components:

1. Create a new file in this directory
2. Use the existing component patterns
3. Add proper TypeScript types
4. Include "use client" directive if needed
5. Document the component in this README

## Styling

Components use a combination of:

- Tailwind CSS utility classes
- CSS variables for theming
- class-variance-authority for variants
- cn utility for conditional class merging

## Showcase

To see all components in action, visit the `/ui-showcase` page in the application. 