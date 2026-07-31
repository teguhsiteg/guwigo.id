/**
 * Setup Script: Initialize Superadmin Account
 *
 * Run this script to ensure the superadmin account exists in Firestore
 * Usage: npx tsx scripts/setup-superadmin.ts
 *
 * IMPORTANT: The Firebase app must have the required environment variables set in .env.local
 * - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 * - NEXT_PUBLIC_FIREBASE_API_KEY
 * - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 */

import admin from "firebase-admin";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const SUPERADMIN_EMAIL = "teguhsiteg95@gmail.com";
const SUPERADMIN_PASSWORD =
  process.env.SUPERADMIN_PASSWORD || "ChangeMe@123456";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

  if (!serviceAccountPath) {
    console.error(
      "❌ Error: FIREBASE_SERVICE_ACCOUNT_KEY_PATH not set in environment",
    );
    console.error(
      "Please add your Firebase service account key path to .env.local",
    );
    process.exit(1);
  }

  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error("❌ Error loading service account:", error);
    process.exit(1);
  }
}

const db = admin.firestore();
const auth = admin.auth();

async function setupSuperAdmin() {
  try {
    console.log(`\n🔧 Setting up Superadmin Account...`);
    console.log(`📧 Email: ${SUPERADMIN_EMAIL}`);

    // Check if user exists in Auth
    let user;
    try {
      user = await auth.getUserByEmail(SUPERADMIN_EMAIL);
      console.log("✅ Superadmin user exists in Firebase Auth");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        console.log("📝 Creating new superadmin user in Firebase Auth...");
        user = await auth.createUser({
          email: SUPERADMIN_EMAIL,
          password: SUPERADMIN_PASSWORD,
          displayName: "Superadmin",
          emailVerified: true,
        });
        console.log("✅ Superadmin user created in Firebase Auth");
      } else {
        throw error;
      }
    }

    // Check if user document exists in Firestore
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData?.role === "admin") {
        console.log("✅ Superadmin document already exists with admin role");
      } else {
        console.log(
          "⚠️ Superadmin document exists but role is not 'admin'. Updating...",
        );
        await db.collection("users").doc(user.uid).update({
          role: "admin",
        });
        console.log("✅ Updated superadmin role to 'admin'");
      }
    } else {
      console.log("📝 Creating superadmin user document in Firestore...");
      await db.collection("users").doc(user.uid).set({
        uid: user.uid,
        name: "Superadmin",
        email: SUPERADMIN_EMAIL,
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ Superadmin user document created in Firestore");
    }

    console.log("\n✅ Superadmin setup complete!");
    console.log(`\n📌 Login Credentials:`);
    console.log(`   Email: ${SUPERADMIN_EMAIL}`);
    console.log(`   Password: ${SUPERADMIN_PASSWORD}`);
    console.log(`\n⚠️  IMPORTANT: Change this password after first login!`);
  } catch (error) {
    console.error("\n❌ Error setting up superadmin:", error);
    process.exit(1);
  } finally {
    // Clean up
    await admin.app().delete();
  }
}

// Run the setup
setupSuperAdmin();
