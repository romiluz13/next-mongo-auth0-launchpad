/**
 * UI Components Compatibility Layer
 * 
 * This file re-exports UI components from the main components directory
 * to maintain backward compatibility while consolidating duplicate components.
 * 
 * USAGE:
 * import { Button, Badge, Card } from "@/features/ui";
 * 
 * This allows us to gradually migrate from:
 * import { Button } from "@/features/ui/components/Button";
 * 
 * To:
 * import { Button } from "@/components/ui/button";
 */

// Re-export button components
export { Button, buttonVariants } from '@/components/ui/button';

// Re-export badge components
export { Badge, badgeVariants } from '@/components/ui/badge';

// Re-export card components
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

// Re-export spinner components
export { Spinner, LoadingOverlay } from '@/components/ui/spinner';

// Re-export input components
export { Input } from '@/components/ui/input';

// Add more component re-exports as they are implemented
// This list will grow as more components are added to the main UI library