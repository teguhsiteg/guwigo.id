# Superadmin Account Setup Guide

This document explains how to set up and maintain the superadmin account for **teguhsiteg95@gmail.com**.

## Overview

The superadmin account is the primary administrative account for Guwigo. It has the following characteristics:

- **Email:** `teguhsiteg95@gmail.com`
- **Role:** `admin` (verified in Firestore)
- **Location:** `users` collection in Firestore
- **Required:** YES - Must always exist in the database

## Setup Methods

### Method 1: Automated Setup Script (Recommended)

This is the easiest and safest way to set up the superadmin account.

#### Prerequisites

1. **Firebase Service Account Key**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file somewhere secure (e.g., `firebase-key.json`)

2. **Environment Variables**
   - Add to `.env.local`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./firebase-key.json
   SUPERADMIN_PASSWORD=YourSecurePassword123!
   ```

#### Running the Setup

```bash
# Install dependencies first
npm install

# Run the setup script
npm run setup:superadmin
```

**Output:**

```
✅ Setting up Superadmin Account...
📧 Email: teguhsiteg95@gmail.com
✅ Superadmin user created in Firebase Auth
✅ Superadmin user document created in Firestore

📌 Login Credentials:
   Email: teguhsiteg95@gmail.com
   Password: YourSecurePassword123!

⚠️  IMPORTANT: Change this password after first login!
```

### Method 2: Manual Setup in Firebase Console

If you prefer to set up manually:

#### Step 1: Create Firebase Auth User

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Authentication → Users
3. Click "Create user"
4. **Email:** `teguhsiteg95@gmail.com`
5. **Password:** Enter a secure password
6. Click "Create user"
7. Copy the **User UID**

#### Step 2: Create Firestore Document

1. Go to Firestore Database → Collections
2. Create or navigate to `users` collection
3. Click "Add document"
4. Set **Document ID** to the User UID from Step 1
5. Add the following fields:

```json
{
  "uid": "<paste UID here>",
  "name": "Superadmin",
  "email": "teguhsiteg95@gmail.com",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

6. Click "Save"

### Method 3: Manual Setup in App UI

**Not Recommended** - Use only if setup scripts fail.

1. Start the app: `npm run dev`
2. Go to registration page
3. Register with `teguhsiteg95@gmail.com`
4. In Firestore, manually change the `role` field from `member` to `admin`

## Verification

After setup, verify the superadmin account exists:

### Check 1: Firebase Console

- Go to Authentication → Users
- Look for `teguhsiteg95@gmail.com` ✅

### Check 2: Firestore Console

- Go to Firestore → `users` collection
- Find the document with email `teguhsiteg95@gmail.com`
- Verify `role` field = `admin` ✅

### Check 3: In App (JavaScript Console)

```javascript
// Add this to check from browser console during development
import { verifySuperadminExists } from "@/lib/db-init";

const exists = await verifySuperadminExists();
console.log("Superadmin exists:", exists); // Should be true
```

## Admin Dashboard Access

After setup, the superadmin can log in:

1. Go to `/login`
2. Enter:
   - **Email:** `teguhsiteg95@gmail.com`
   - **Password:** (the password set during setup)
3. Click "Login"
4. Should be redirected to `/admin/dashboard` ✅

## Firestore Document Structure

The superadmin user document in Firestore should look like this:

```
Collection: users
Document: {uid}
├── uid: "teguhsiteg95gmail_uid"
├── name: "Superadmin"
├── email: "teguhsiteg95@gmail.com"
├── role: "admin"  ← CRITICAL: Must be "admin"
├── createdAt: "2024-01-01T00:00:00.000Z"
└── updatedAt: "2024-01-01T00:00:00.000Z"
```

## Troubleshooting

### Issue: "User not found" error when running setup script

**Solution:**

- Verify `FIREBASE_SERVICE_ACCOUNT_KEY_PATH` is correct
- Check that the Firebase key file has read permissions
- Ensure `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is set in `.env.local`

### Issue: "Email already in use" error

**Solution:**

- The account already exists in Firebase Auth
- The setup script will update the Firestore role to `admin`
- Just re-run: `npm run setup:superadmin`

### Issue: Can't log in with superadmin account

**Solution:**

1. Check Firestore document has `role: "admin"`
2. Check Firebase Auth user exists with correct email
3. Try resetting password in Firebase Console → Users
4. Re-run setup script: `npm run setup:superadmin`

### Issue: Setup script not found

**Solution:**

```bash
# Make sure you're in the project root directory
cd d:\Projects\guwigo-tech

# Install dependencies
npm install

# Run setup
npm run setup:superadmin
```

## Security Best Practices

⚠️ **IMPORTANT:**

1. **Change Default Password**
   - After first login, immediately change the password in account settings
   - Use a strong, unique password

2. **Protect Service Account Key**
   - Never commit `firebase-key.json` to Git
   - Add to `.gitignore` if not already there
   - Store in a secure location with restricted access

3. **Monitor Admin Activity**
   - Log all admin dashboard actions
   - Review transaction history regularly
   - Set up Firebase functions for audit logging

4. **Backup Access**
   - Document the setup process
   - Consider a second admin account for emergencies
   - Store password in a secure vault (1Password, Bitwarden, etc.)

## Automated Initialization

The app automatically checks for the superadmin account on startup:

```typescript
// In your main layout or app initialization:
import { initializeDatabase } from "@/lib/db-init";

useEffect(() => {
  initializeDatabase();
}, []);
```

If the superadmin account is not found, a warning will be logged to the console with setup instructions.

## Support

If you encounter issues:

1. Check the setup script output for error messages
2. Verify all environment variables are set correctly
3. Review Firebase Console for any errors
4. Check browser console for runtime errors during login
5. Verify Firestore rules allow admin reads/writes

---

**Last Updated:** April 5, 2026
**Version:** 1.0
