# Project Structure

The MongoDB Developer's Launch Pad follows a feature-based organization with clear separation between UI components, business logic, and data access.

## Directory Structure

```
src/
├── app/            # Next.js app router pages and layouts
├── components/     # Reusable UI components
│   ├── ui/         # Base UI components (shadcn/ui)
│   └── shared/     # Shared components used across features
├── features/       # Feature-specific components and logic
│   ├── auth/       # Authentication related components
│   ├── dashboard/  # Dashboard related components
│   └── settings/   # Settings related components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and shared logic
├── providers/      # React context providers
└── styles/         # Global styles and theme configuration
```

## Key Concepts

### Feature-Based Organization

Code is organized around business domains rather than technical layers. Each feature folder contains all the components, hooks, and utilities specific to that feature.

### Server vs. Client Components

Next.js 14's App Router distinguishes between server and client components:

- **Server Components**: Default components that run on the server
- **Client Components**: Components with the `'use client'` directive that run on the client

### Component Organization

- **UI Components**: Basic building blocks (buttons, cards, inputs) located in `components/ui/`
- **Shared Components**: Components used across features located in `components/shared/`
- **Feature Components**: Components specific to a feature located in `features/{feature-name}/`

### Data Flow

1. **API Routes**: Located in `app/api/` using Next.js Route Handlers
2. **Server Components**: Fetch data directly in server components
3. **Client State**: Managed with React hooks and state management libraries

## File Naming Conventions

- React components: PascalCase (`Button.tsx`)
- Utility functions: camelCase (`formatDate.ts`)
- Page components: page.tsx (Next.js App Router convention)
- Layout components: layout.tsx (Next.js App Router convention)

## Type Safety

TypeScript is used throughout the codebase with strict type checking enabled. 