# Guwigo-Tech Project Structure Guide

## 📁 Folder Organization

### Root Level

```
├── public/              # Static assets (images, HTML, etc.)
├── src/                 # Source code
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── eslint.config.mjs    # ESLint configuration
└── firebase.json        # Firebase configuration
```

### `/src` Directory Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Auth route group (login)
│   ├── (main)/             # Main content route group
│   │   ├── about/
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── member/
│   │   ├── mentoring/
│   │   ├── portfolio/
│   │   ├── services/
│   │   ├── store/          # E-commerce pages
│   │   ├── terms/
│   │   ├── tools/          # Utility tools
│   │   └── privacy/
│   ├── admin/              # Admin panel
│   ├── api/                # API routes
│   │   ├── tripay/         # Payment gateway integration
│   │   ├── tripay-callback/
│   │   └── products/       # Product API endpoints
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   └── not-found.tsx       # 404 page
│
├── components/             # React components
│   ├── ui/                # Reusable UI components library
│   │   └── README.md      # Guidelines for UI components
│   ├── features/          # Feature-specific components
│   │   └── README.md      # Guidelines for feature components
│   └── layout/            # Layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── context/               # React Context API
│   ├── CartContext.tsx    # Shopping cart context
│   └── LanguageContext.tsx # Language/i18n context
│
├── hooks/                 # Custom React hooks
│   └── index.ts          # Export all custom hooks
│
├── lib/                   # Utility libraries and integrations
│   ├── firebase.ts        # Firebase SDK configuration
│   └── midtrans.ts        # Midtrans payment service
│
├── types/                 # TypeScript type definitions
│   └── index.d.ts         # Module augmentation for external libraries
│
├── services/              # Business logic and API abstraction
│   ├── api.service.ts     # Centralized API client
│   └── index.ts           # Service exports
│
├── constants/             # Application constants
│   └── index.ts           # API endpoints, routes, UI constants
│
├── utils/                 # Utility functions
│   └── index.ts           # Common utilities (cn, formatters, etc.)
│
└── types.d.ts            # DEPRECATED - see src/types/index.d.ts instead
```

## 🎯 Path Aliases

The project uses TypeScript path aliases for clean imports:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### Usage Examples

```typescript
// ✓ Good - using path alias
import Navbar from "@/components/layout/Navbar";
import { CartContext } from "@/context/CartContext";
import { API_ENDPOINTS } from "@/constants";
import { apiService } from "@/services/api.service";

// ✗ Avoid - relative paths (unless necessary)
import Navbar from "../../components/layout/Navbar";
```

## 📋 Folder Guidelines

### `/src/components/ui`

**Purpose:** Reusable, stateless components

- Button, Input, Card, Modal, Badge, etc.
- No business logic
- Fully customizable via props
- Accessible and well-tested

### `/src/components/features`

**Purpose:** Domain-specific, feature-rich components

- CartSummary, ProductCard, CheckoutForm
- Can contain business logic
- Composed from multiple UI components
- Larger and more opinionated

### `/src/hooks`

**Purpose:** Custom React hooks

- Business logic hooks: `useCart()`, `useAuth()`
- Custom behavior hooks: `usePagination()`, `useAnimation()`
- Should be pure logic, no JSX

### `/src/services`

**Purpose:** Business logic and API abstraction

- `api.service.ts` - Centralized API client
- `auth.service.ts` - Authentication logic
- `payment.service.ts` - Payment processing
- Keep API calls here, not in components

### `/src/constants`

**Purpose:** Application-wide constants

- API endpoints
- Route paths
- UI configuration
- Enum values

### `/src/utils`

**Purpose:** Pure utility functions

- `cn()` - Tailwind class merging
- `formatDate()` - Date formatting
- `validateEmail()` - Form validation
- Keep functions pure and side-effect-free

### `/src/types`

**Purpose:** TypeScript type definitions and module augmentation

- `index.d.ts` - Module declarations for external libraries
- Type definitions for external APIs
- Custom type extensions

## 🚫 Deprecated Paths

- ~~`src/types.d.ts`~~ → Use `src/types/index.d.ts`
- ~~`public/marquee/page.tsx`~~ → Removed (duplicate of `src/app/(main)/tools/marquee/page.tsx`)

## 📝 Best Practices

### Import Order

```typescript
// 1. External packages
import React from "react";
import Link from "next/link";

// 2. Internal modules (using @ alias)
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";
import { useCart } from "@/hooks";

// 3. Relative imports (if necessary)
import { helper } from "./helper";
```

### Component Organization

```
src/components/features/
├── ProductCard/
│   ├── ProductCard.tsx      # Main component
│   ├── ProductCard.types.ts # Type definitions
│   ├── useProductCard.ts    # Custom hook (if needed)
│   └── index.ts             # Export
```

### Naming Conventions

- **Folders:** lowercase, kebab-case for multi-word (e.g., `cart-item`)
- **Components:** PascalCase (e.g., `ProductCard.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useCart.ts`)
- **Utilities/Services:** camelCase with `.ts` (e.g., `api.service.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### File Structure Template

**Component:**

```typescript
// src/components/features/ProductCard/ProductCard.tsx
interface ProductCardProps {
  // props
}

export function ProductCard({}: ProductCardProps) {
  // implementation
}
```

**Hook:**

```typescript
// src/hooks/useCart.ts
export function useCart() {
  // hook logic
}
```

**Utility:**

```typescript
// src/utils/formatDate.ts
export function formatDate(date: Date): string {
  // implementation
}
```

### API Integration Pattern

```typescript
// ✓ Do not call API directly in components
// ✗ Don't do this:
const response = await fetch("/api/products");

// ✓ Do this instead:
import { apiService } from "@/services/api.service";
const data = await apiService.get<Product[]>("/api/products");
```

## 🔍 Module Analysis

### Installed Packages Used

- ✅ `firebase` - Backend & Auth
- ✅ `midtrans-client` - Payment gateway
- ✅ `sonner` - Toast notifications
- ✅ `framer-motion` - Animations
- ✅ `lucide-react` - Icons
- ✅ `qrcode.react` - QR code generation
- ✅ `next` - React framework
- ✅ `react`, `react-dom` - Core React

### Removed

- ❌ `aos` (unused animation library) - Removed from `src/types/index.d.ts`

## 🎓 Next Steps

1. **Implement UI Component Library** - Start with Button, Input, Card
2. **Create Service Layer** - Move API calls to dedicated services
3. **Organize Hooks** - Extract component logic into custom hooks
4. **Add Validation** - Create `src/schemas/` for form validation with Zod
5. **Create Middleware** - Add `src/middleware.ts` for auth checks
6. **Documentation** - Update this guide as structure evolves

## 📚 References

- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [React Component Patterns](https://react.dev/learn)
- [Tailwind CSS](https://tailwindcss.com/)
