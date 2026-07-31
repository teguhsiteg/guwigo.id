import admin from "firebase-admin";

if (!admin.apps.length) {
  let credential;

  // Coba gunakan raw JSON dari environment variable (paling disarankan untuk Vercel/Serverless)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
      );
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.error(
        "❌ Error parsing FIREBASE_SERVICE_ACCOUNT_KEY JSON:",
        error,
      );
    }
  } 
  // Jika tidak ada JSON string, fallback ke path file
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.error(
        "❌ Error loading service account from path:",
        error,
      );
    }
  }

  if (credential) {
    admin.initializeApp({
      credential,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    console.log("✅ Firebase Admin initialized successfully.");
  } else {
    console.error("❌ Firebase Admin could not be initialized. Missing credentials.");
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
export default admin;
