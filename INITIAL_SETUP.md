# Initial Setup Checklist

Complete this checklist when setting up the Guwigo application for the first time.

## 1. Environment Variables Setup

- [ ] Create `.env.local` file in project root
- [ ] Copy from `.env.example` template
- [ ] Fill in all Firebase credentials:
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- [ ] Fill in Tripay credentials:
  - [ ] `TRIPAY_API_KEY`
  - [ ] `TRIPAY_PRIVATE_KEY`
  - [ ] `TRIPAY_MERCHANT_CODE`
- [ ] Set optional Firebase Admin setup:
  - [ ] Download Firebase service account key
  - [ ] Save to secure location
  - [ ] Add path to `FIREBASE_SERVICE_ACCOUNT_KEY_PATH`
  - [ ] Set `SUPERADMIN_PASSWORD` (or use default)

## 2. Install Dependencies

```bash
npm install
```

- [ ] All packages installed successfully
- [ ] No dependency conflicts

## 3. Superadmin Account Setup

**REQUIRED: This account MUST exist in the database**

```bash
npm run setup:superadmin
```

- [ ] Setup script ran without errors
- [ ] Superadmin account created in Firebase Auth
- [ ] Superadmin document created in Firestore
- [ ] Verified in Firebase Console
  - [ ] Auth → Users: `teguhsiteg95@gmail.com` exists
  - [ ] Firestore → users collection: document with role `admin` exists

## 4. Firestore Database Setup

### Required Collections

Verify these collections exist in Firestore:

- [ ] **users** collection

  ```
  Fields: uid, name, email, role, createdAt, phone (optional)
  ```

  - [ ] Superadmin document exists with role "admin"

- [ ] **services** collection

  ```
  Fields: id, title, category, description, packages, iconName
  ```

- [ ] **transactions** collection

  ```
  Fields: userId, userName, userEmail, serviceName, packageName, amount, status, createdAt, paidAt
  ```

- [ ] **user_subscriptions** collection
  ```
  Fields: userId, serviceName, packageName, purchasedAt, expiresAt, status
  ```

### Security Rules

- [ ] Firestore security rules configured in Firebase Console
- [ ] Rules allow:
  - [ ] Public reads for services
  - [ ] User data protected (only own documents readable)
  - [ ] Admin can read all data
  - [ ] Writes restricted appropriately

**Template Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId || isAdmin();
    }

    // Services collection
    match /services/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Transactions collection
    match /transactions/{document=**} {
      allow read: if isAdmin() || request.auth.uid == resource.data.userId;
      allow write: if isAdmin();
    }

    // Subscriptions
    match /user_subscriptions/{document=**} {
      allow read: if isAdmin() || request.auth.uid == resource.data.userId;
      allow write: if isAdmin();
    }

    // Helper functions
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

## 5. Development Server

```bash
npm run dev
```

- [ ] Server starts without errors
- [ ] No build errors
- [ ] Application accessible at `http://localhost:3000`

## 6. Testing

### Login/Registration Flow

- [ ] Create test member account
- [ ] Login with member account
- [ ] Redirected to user dashboard (/dashboard)
- [ ] Logout works correctly

### Admin Flow

- [ ] Login with superadmin account (`teguhsiteg95@gmail.com`)
- [ ] Redirected to admin dashboard (/admin/dashboard)
- [ ] Dashboard shows real stats from Firestore
- [ ] Can see user transactions
- [ ] Logout works correctly

### Services Flow

- [ ] Login with member account
- [ ] Navigate to /services
- [ ] Services load from Firestore
- [ ] Can select and view package details
- [ ] Checkout process initiates payment flow

### Payment Flow (Tripay)

- [ ] Select a service and package
- [ ] Fill phone number if needed
- [ ] Click checkout
- [ ] Redirected to Tripay payment page
- [ ] Payment status updates Firestore transaction
- [ ] Subscription appears in user dashboard

## 7. Pre-Deployment

- [ ] `.env.local` is in `.gitignore` ✅
- [ ] Firebase service account key is in `.gitignore` ✅
- [ ] Run `npm run build` - no errors
- [ ] All tests pass
- [ ] Security rules reviewed and deployed
- [ ] Superadmin password changed from default
- [ ] Database backups enabled (Firebase Console → Backups)

## 8. Deployment

- [ ] Choose hosting platform (Vercel, Firebase Hosting, etc.)
- [ ] Set environment variables in hosting provider
- [ ] Deploy build
- [ ] Verify app works on production URL
- [ ] Monitor error logs
- [ ] Test admin dashboard on production
- [ ] Verify payments work end-to-end

## 9. Post-Deployment

- [ ] Monitor dashboard for activity
- [ ] Check Firebase logs for errors
- [ ] Verify emails/notifications if enabled
- [ ] Document any issues encountered
- [ ] Create backup of Firestore data
- [ ] Set up monitoring/alerts

## Common Issues & Solutions

### Issue: "Superadmin not found" on startup

**Solution:**

```bash
npm run setup:superadmin
```

### Issue: "CORS error" or "Firebase config invalid"

**Solution:**

- Verify all `NEXT_PUBLIC_*` variables are set
- Check Firebase project is correct in console
- Verify API keys in Firebase Console

### Issue: "Permission denied" errors in Firestore

**Solution:**

- Check Firestore security rules
- Verify user role is set correctly
- Use Firebase Console to debug rules

### Issue: "Tripay API error" during checkout

**Solution:**

- Verify Tripay credentials are correct
- Check Tripay API status
- Test in Tripay sandbox first if available
- Check merchant status in Tripay dashboard

## Support Files

- `SUPERADMIN_SETUP.md` - Detailed superadmin setup guide
- `IMPLEMENTATION_COMPLETE.md` - Implementation checklist
- `TROUBLESHOOTING.md` - Troubleshooting guide
- `.env.example` - Environment variables template

---

**Version:** 1.0
**Last Updated:** April 5, 2026
**Status:** Ready for Setup
