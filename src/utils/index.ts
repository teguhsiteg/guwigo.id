/**
 * Utility functions for common operations
 * Organize utilities by category/purpose
 * Examples:
 * - formatDate.ts
 * - validateEmail.ts
 * - cn.ts (utility for merging classnames with tailwind)
 */

// Common utility for merging Tailwind classes
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Import and export other utilities
// export { formatDate } from "./formatDate";
// export { validateEmail } from "./validateEmail";
