/**
 * Application-wide constants and configuration values
 */

// API endpoints
export const API_ENDPOINTS = {
  TRIPAY: "/api/tripay",
  TRIPAY_CALLBACK: "/api/tripay-callback",
  PRODUCTS: "/api/products",
} as const;

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  MEMBER_DASHBOARD: "/member/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  STORE: "/store",
  CHECKOUT: "/checkout",
  ABOUT: "/about",
  CONTACT: "/contact",
  PORTFOLIO: "/portfolio",
  SERVICES: "/services",
  PRIVACY: "/privacy",
  TERMS: "/terms",
} as const;

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
} as const;
