# Troubleshooting Guide - Guwigo Implementation

## 🔴 Common Issues & Solutions

### 1. **Firebase Not Connecting**

**Error**: `Cannot read properties of undefined (reading 'db')`

**Cause**: Environment variables not set up

**Fix**:

1. Create `.env.local` file in project root
2. Add all `NEXT_PUBLIC_FIREBASE_*` variables
3. Restart development server: `npm run dev`
4. Check that variables are accessible in browser console:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
   ```

---

### 2. **Payment Flow Not Working**

**Error**: `POST /api/tripay 400 Bad Request`

**Possible Causes**:

- Missing phone number when clicking checkout
- `TRIPAY_API_KEY` not set in `.env.local`
- Tripay credentials invalid

**Fix**:

1. Check user has phone number set:
   - Go to `/settings`
   - Add phone number
   - Save
2. Verify Tripay credentials in `.env.local`:
   ```env
   TRIPAY_API_KEY=abc123xyz
   TRIPAY_PRIVATE_KEY=xyz789abc
   TRIPAY_MERCHANT_CODE=T1234
   ```
3. Check Tripay account is active (not sandbox/testing)
4. Look at server logs for actual error: `npm run dev`

---

### 3. **Login Always Fails**

**Error**: `auth/invalid-api-key` or similar

**Cause**: Firebase credentials invalid or expired

**Fix**:

1. Go to Firebase Console
2. Check if project credentials match `.env.local`
3. Verify API key hasn't been restricted in Cloud Console
4. Check Firebase rules allow auth operations
5. Try creating new API key in Firebase Console

---

### 4. **Admin Dashboard Shows No Data**

**Problem**: Revenue, members, transactions all show 0

**Causes**:

- No transactions in Firestore
- User doesn't have admin role
- Firestore firewall blocking reads

**Fix**:

1. Check if transactions exist:
   - Go to Firebase Console → Firestore
   - Check `transactions` collection
2. Verify current user has role: `admin`:
   - Check `users` collection
   - Confirm logged-in user has `role: "admin"`
3. Check Firestore rules allow reads
4. Make test transaction:
   - Logout admin
   - Register test member
   - Checkout and complete payment
   - Login as admin - should see new transaction

---

### 5. **Services Not Loading**

**Error**: Page blank or "Menghubungkan ke Server..." forever

**Causes**:

- Firestore not accessible
- Network error
- No services in database

**Fix**:

1. Check if `services` collection exists in Firestore
2. Add test service via Admin Panel:
   - Login to `/admin/services`
   - Click "Tambah Layanan"
   - Fill in details
   - Save
3. Check network tab in browser DevTools
4. Check console for Firebase errors

---

### 6. **Payment Callback Not Working**

**Problem**: After paying on Tripay, nothing happens

**Cause**: Webhook not being triggered or signature verification fails

**Fix**:

1. Check Tripay dashboard → Webhooks
2. Verify callback URL is set to: `https://yourdomain.com/api/tripay-callback`
3. Check private key in `.env.local` matches Tripay
4. Test webhook in Tripay dashboard (send test)
5. Check Next.js logs for errors

---

### 7. **Phone Number Validation Failing**

**Error**: "Format nomor telepon tidak valid"

**Valid Formats**:

- `081234567890` (Indonesian mobile)
- `0811234567890` (Indonesian mobile longer)
- `0267634567` (Indonesian landline)
- `+628123456789` (International)

**Won't Work**:

- `+1234567890` (non-Indonesia number)
- `6281234567890` (must have + or 0)

**Fix**:

1. Use format: `08xx` or `+62x`
2. Remove spaces/dashes before entering

---

### 8. **Type Errors During Build**

**Error**: `Property 'xxx' does not exist on type 'yyy'`

**Cause**: Type imports not working correctly

**Fix**:

1. Make sure types are exported from `src/types/index.d.ts`
2. Use correct import:
   ```typescript
   import type { Transaction, UserSubscription } from "@/types/payment";
   ```
3. Rebuild: `npm run build`

---

### 9. **Session Not Persisting**

**Problem**: User logged out after refresh

**Cause**: Using `localStorage` but relying on it for session

**Current**: Uses `localStorage` + Firebase Auth

- Firebase Auth tokens persist in browser
- localStorage keys used for role-based redirect

**Better Solution** (Future):

- Use JWT tokens instead
- Store in httpOnly cookies
- Add refresh token rotation

**For Now**:

- Login persists through Firebase Auth
- No need to login again after refresh
- localStorage just indicates session type

---

### 10. **Admin Services Page Not Saving**

**Error**: Button click does nothing or error toast appears

**Causes**:

- User not admin
- Missing database permissions
- Invalid data format

**Fix**:

1. Verify logged-in user is admin
   - Check localStorage: `localStorage.getItem('guwigo_admin_session')`
2. Verify all fields filled correctly:
   - Service title
   - Category
   - Icon name (Code, PenTool, Sparkles, etc.)
   - At least one package
   - Each package has name, price, features
3. Check browser console for Firebase errors
4. Check Firestore security rules allow writes

---

## 🟡 Performance Issues

### Page Loading Slowly

**Check**:

1. Open DevTools → Network tab
2. Look for slow Firebase queries
3. Reduce Firestore queries with pagination
4. Add caching layer (Redis, SWR)

### Too Many Database Reads

**Optimize**:

1. Use `limit()` in queries
2. Index frequently queried fields
3. Use local state instead of constant fetches
4. Implement caching with React hooks

---

## 🔧 Debugging Tips

### Enable Firestore Logging

```javascript
// Add to app layout or page
import { enableLogging } from "firebase/firestore";
enableLogging(true);
```

### Log Payment Data

```javascript
// In /api/tripay route
console.log("Tripay Request:", {
  body: JSON.stringify(body, null, 2),
  headers: Object.fromEntries(req.headers),
  timestamp: new Date().toISOString(),
});
```

### Check Firebase State

```javascript
// In any component
import { getAuth } from "firebase/auth";

const auth = getAuth();
console.log("Current user:", auth.currentUser);
console.log("Session token:", await auth.currentUser?.getIdToken());
```

---

## 📞 Getting Help

### Check These First:

1. **Browser Console** (`F12` → Console) - Look for JavaScript errors
2. **Network Tab** - Check API calls for errors
3. **Firebase Console** - Check for service outages
4. **Firestore Database** - Verify data exists
5. **Environment Variables** - Verify `.env.local` is correct

### Useful Links:

- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- [Tripay API Docs](https://tripay.co.id/api-doc)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables set in `.env.local`
- [ ] Firebase project is production one (not sandbox)
- [ ] Tripay account is production one (not sandbox)
- [ ] Firestore security rules are set (not in test mode)
- [ ] Payment flow tested end-to-end
- [ ] Admin dashboard shows real data
- [ ] User settings page working
- [ ] No console errors on any page
- [ ] Network requests all 200/201 status
- [ ] Mobile responsive looks good
- [ ] Database backups configured

---

**Last Updated**: April 5, 2026
**Status**: Ready for Deployment
