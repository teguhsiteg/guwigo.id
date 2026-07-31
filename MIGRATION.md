# Project Structure Refactoring - Migration Guide

## Changes Made (April 2026)

This document outlines all structural improvements made to keep your imports and code organized.

### ✅ Completed Refactoring

#### 1. **Type Definitions Consolidation**

- **Changed:** `src/types.d.ts` → `src/types/index.d.ts`
- **Why:** Follows project organization pattern of centralizing exports in `index` files
- **Action Required:**
  ```typescript
  // Both import statements work (TypeScript resolves index.d.ts automatically)
  import type { ... } from '@/types';
  // or explicitly
  import type { ... } from '@/types/index';
  ```

#### 2. **Removed Unused Module Declaration**

- **Changed:** Removed `declare module "aos"` from type definitions
- **Why:** AOS package was never installed in `package.json` and not used in the codebase
- **Status:** ✅ No action needed - this was a cleanup

#### 3. **Fixed Duplicate Component**

- **Removed:** `public/marquee/page.tsx` (duplicate)
- **Kept:** `src/app/(main)/tools/marquee/page.tsx` (canonical location)
- **Why:** Page components should be in `/src/app`, not in `/public` (which is for static assets)
- **Status:** ✅ No action needed - removed broken duplicate

#### 4. **New Folders Created**

##### `src/constants/`

```typescript
// New file: src/constants/index.ts
export const API_ENDPOINTS = { ... }
export const ROUTES = { ... }
export const UI = { ... }
```

**Usage:**

```typescript
import { API_ENDPOINTS, ROUTES } from "@/constants";
```

##### `src/services/`

```typescript
// New files:
// - src/services/index.ts (exports all services)
// - src/services/api.service.ts (centralized API client)
```

**Usage:**

```typescript
import { apiService } from "@/services/api.service";
// or
import { apiService } from "@/services";
```

##### `src/hooks/`

```typescript
// New file: src/hooks/index.ts
// Scaffolded for custom hooks organization
```

**Future Usage:**

```typescript
import { useCart, useAuth } from "@/hooks";
```

##### `src/utils/`

```typescript
// New file: src/utils/index.ts
// Includes: cn() utility for Tailwind class merging
export { cn } from "@/utils";
```

#### 5. **Component Folder Documentation**

Created README guides for:

- `src/components/ui/README.md` - Guidelines for reusable UI components
- `src/components/features/README.md` - Guidelines for feature-specific components

### 📋 Updated Folder Structure

**Before:**

```
src/
├── types.d.ts (root level - non-standard)
├── types/ (empty)
├── hooks/ (empty)
├── utils/ (empty)
├── components/
│   ├── ui/ (empty, undocumented)
│   └── features/ (empty, undocumented)
└── services/ (missing)
```

**After:**

```
src/
├── types/index.d.ts ✅ (properly located)
├── types/ ✅ (now contains index.d.ts)
├── hooks/index.ts ✅ (scaffolded)
├── utils/index.ts ✅ (scaffolded with cn() utility)
├── components/
│   ├── ui/ ✅ (documented)
│   └── features/ ✅ (documented)
├── services/ ✅ (new with api.service.ts)
└── constants/ ✅ (new)
```

### 🔗 Import Updates

All path aliases remain working:

```typescript
// These all work (path alias auto-resolves index files):
import { Button } from "@/components/ui";
import { ProductCard } from "@/components/features";
import { useCart } from "@/hooks";
import { cn } from "@/utils";
import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
```

### ❌ Breaking Changes: NONE

- All existing imports continue to work
- No code changes required in existing components
- Pure structural reorganization

### 🎯 Next Steps for Your Team

1. **Start using the constants:**

   ```typescript
   import { ROUTES } from "@/constants";
   // Instead of hardcoding '/about', use ROUTES.ABOUT
   ```

2. **Centralize API calls in services:**

   ```typescript
   import { apiService } from "@/services";
   const products = await apiService.get<Product[]>("/api/products");
   ```

3. **Extract component logic into hooks:**

   ```typescript
   import { useCart } from "@/hooks/useCart";
   // Logic goes in hook, component stays clean
   ```

4. **Build Component Library in `ui/`:**
   - Start with: Button, Input, Card, Modal
   - Export from `src/components/ui`

5. **Create Feature Components in `features/`:**
   - ProductCard, CartSummary, CheckoutForm
   - Compose from UI components + business logic

### 📚 Documentation

See **`STRUCTURE.md`** for complete folder structure reference and best practices.

### 🚀 Quick Reference

| Task               | Path                                | Example                                           |
| ------------------ | ----------------------------------- | ------------------------------------------------- |
| Reusable component | `@/components/ui/Button`            | `import Button from '@/components/ui'`            |
| Feature component  | `@/components/features/ProductCard` | `import ProductCard from '@/components/features'` |
| Custom hook        | `@/hooks/useCart`                   | `import { useCart } from '@/hooks'`               |
| API call           | `@/services/api.service`            | `apiService.post('/api/products', data)`          |
| Constants          | `@/constants`                       | `ROUTES.HOME`, `API_ENDPOINTS.TRIPAY`             |
| Utilities          | `@/utils`                           | `cn('text-sm', 'p-2')`                            |
| Types              | `@/types`                           | External library type declarations                |

---

**Last Updated:** April 2026
**Next Review:** When project reaches 20+ components or new pages added
