# Admin Panel Documentation

Admin panel Guwigo adalah dashboard komprehensif untuk mengelola seluruh sistem platform.

## 📋 Structure

```
src/app/admin/
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── StatCard.tsx          # Reusable stat card component
│   ├── DataTable.tsx         # Reusable data table component
│   └── types.ts              # Shared types
├── dashboard/
│   └── page.tsx              # Overview & analytics
├── members/
│   └── page.tsx              # User management
├── products/
│   └── page.tsx              # Products management
├── services/
│   └── page.tsx              # Services management (existing)
├── transactions/
│   └── page.tsx              # Transaction history & details
├── reports/
│   └── page.tsx              # Analytics & reports
├── settings/
│   └── page.tsx              # Website settings
└── layout.tsx                # Admin layout with protection
```

## 🔐 Access Control

Admin panel memerlukan:

- ✅ User authentication via Firebase Auth
- ✅ Role check: `role === "admin"`
- ✅ Session token di localStorage

**Automatic redirect jika:**

- User belum login → `/login`
- User bukan admin → `/dashboard` (user page)

## 📄 Pages Overview

### 1. **Dashboard /admin/dashboard**

- 📊 Overview statistik sistem
- 💡 Recent activities
- 📈 Quick stats cards
- 🎯 Key metrics

### 2. **Members /admin/members**

- 👥 List semua users
- 🔍 Search & filter
- 👤 User details
- 🔄 Role management (promote/demote)
- 🗑️ Delete users
- 📥 Export to CSV

**Features:**

```
- Filter by role (admin/member)
- Search by name/email
- Bulk export
- Promote/demote admin
- Delete member
```

### 3. **Products /admin/products**

- 📦 Manage products
- ✏️ Edit details
- 💰 Pricing management
- 📊 Stock tracking
- 🔄 Status toggle

**Fields:**

```
- Product name
- Description
- Price
- Stock quantity
- Category
- Status (active/inactive)
```

### 4. **Services /admin/services**

- 🎯 Service offerings
- 📋 Package management
- 💳 Pricing tiers
- 🏷️ Service categories
- ⚙️ Configuration

### 5. **Transactions /admin/transactions**

- 💵 Transaction history
- 📊 Revenue tracking
- ✅ Status management
- 🔍 Transaction details
- 📈 Payment analytics

**Status Types:**

- ✅ completed
- ⏳ pending
- ❌ failed

### 6. **Reports /admin/reports**

- 📈 Analytics dashboard
- 💹 Revenue charts
- 👥 User growth
- 📊 Service performance
- 🎯 KPI metrics
- 📥 Export reports

**Metrics:**

```
- Total users
- Total revenue
- Transaction count
- Monthly growth
- Active transactions
- Top services
```

### 7. **Settings /admin/settings**

- 🌐 Website settings
- 📧 Support email
- 🛠️ System configuration
- 🚨 Maintenance mode
- 💾 Backup settings
- 📊 Analytics settings

**Configuration:**

```
- Site name & description
- Support contact
- Maintenance mode toggle
- Auto backup enable/disable
- Analytics tracking
```

## 🚀 Usage

### Login sebagai Admin

```
Email: teguhsiteg95@gmail.com
Password: [your superadmin password]
```

Akan auto-redirect ke `/admin/dashboard`

### Import Components

```typescript
import { StatCard } from "@/app/admin/components/StatCard";
import { DataTable } from "@/app/admin/components/DataTable";
```

### Create New Page

```typescript
"use client";

export default function NewAdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Page Title</h1>
        <p className="text-slate-400 mt-1">Description</p>
      </div>

      {/* Content */}
    </div>
  );
}
```

## 🎨 Styling

Admin panel menggunakan:

- ✅ Tailwind CSS
- ✅ Dark theme (slate-based)
- ✅ Consistent color system

**Color Palette:**

- Primary: Blue (600+)
- Success: Green (600+)
- Warning: Yellow (600+)
- Danger: Red (600+)
- Secondary: Purple, Indigo

## 🔗 Database Structure

### Users Collection

```
{
  uid: "...",
  name: "...",
  email: "...",
  role: "admin" | "member",
  createdAt: timestamp,
  lastLogin?: timestamp
}
```

### Products Collection

```
{
  name: "...",
  description: "...",
  price: number,
  category: "...",
  stock: number,
  status: "active" | "inactive"
}
```

### Services Collection

```
{
  title: "...",
  category: "...",
  description: "...",
  packages: [...],
  iconName: "..."
}
```

### Transactions Collection

```
{
  userId: "...",
  userName: "...",
  userEmail: "...",
  amount: number,
  status: "completed" | "pending" | "failed",
  method: "tripay" | "wa",
  description: "...",
  createdAt: timestamp
}
```

## 📱 Features Checklist

- ✅ Role-based access control
- ✅ Member management (CRUD)
- ✅ Product management
- ✅ Transaction tracking
- ✅ Analytics & reports
- ✅ Settings management
- ✅ Export functionality
- ✅ Search & filters
- ✅ Real-time data sync
- ✅ Error handling

## ⚠️ Production Checklist

Sebelum production, pastikan:

- [ ] Firestore rules dikonfigurasi properly
- [ ] Admin authentication tested
- [ ] All pages tested thoroughly
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Responsive design tested
- [ ] Backup strategy planned
- [ ] Audit logging enabled
- [ ] Rate limiting configured
- [ ] Security headers set

## 🐛 Troubleshooting

### Halaman tidak bisa diakses

- ✅ Check localStorage untuk `guwigo_admin_session`
- ✅ Verify user role di Firestore
- ✅ Check Firebase rules di console

### Data tidak muncul

- ✅ Verify Firestore collection names
- ✅ Check Firebase rules permissions
- ✅ Test browser dev console untuk errors

### Firestore permission errors

- ✅ Deploy firestore.rules: `firebase deploy --only firestore:rules`
- ✅ Check authenticated user state
- ✅ Verify user document exists

## 📚 Related Files

- [Firestore Rules](firestore.rules)
- [Auth Context](src/context/AuthContext.tsx)
- [Admin Layout](src/app/admin/layout.tsx)
- [Sidebar](src/app/admin/components/Sidebar.tsx)

## 🔄 Next Steps

Fitur yang bisa ditambahkan:

- [ ] Advanced analytics dengan charts
- [ ] User activity logs
- [ ] Bulk operations
- [ ] Email notifications
- [ ] API key management
- [ ] Webhook configuration
- [ ] Team management
- [ ] Role customization
- [ ] Two-factor authentication
- [ ] Audit logs export
