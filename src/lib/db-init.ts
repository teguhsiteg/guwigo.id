/**
 * Database Initialization Utility
 * Ensures required data structures and accounts exist in Firestore
 */

import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const SUPERADMIN_EMAILS = [
  "parthner@guwigo.com",
  "admin@guwigo.com",
  "teguhsiteg95@gmail.com",
];

/**
 * Verify that the superadmin account exists in Firestore
 * This is a read-only check - does not create accounts
 */
export async function verifySuperadminExists(): Promise<boolean> {
  try {
    const usersRef = collection(db, "users");
    const superadminQuery = query(
      usersRef,
      where("email", "in", SUPERADMIN_EMAILS),
    );
    const snapshot = await getDocs(superadminQuery);

    if (snapshot.empty) {
      console.warn(
        `⚠️ Superadmin account (${SUPERADMIN_EMAILS.join(", ")}) not found in Firestore`,
      );
      return false;
    }

    const superadminDoc = snapshot.docs[0];
    const superadminData = superadminDoc.data();

    if (superadminData?.role !== "admin") {
      console.warn(
        `⚠️ Superadmin account exists but role is not 'admin': ${superadminData?.role}`,
      );
      return false;
    }

    console.log(`✅ Superadmin account verified (${superadminData?.email || SUPERADMIN_EMAILS[0]})`);
    return true;
  } catch (error) {
    console.error("Error verifying superadmin:", error);
    return false;
  }
}

/**
 * Get superadmin email (used for configuration)
 */
export function getSuperadminEmail(): string {
  return SUPERADMIN_EMAILS[0];
}

/**
 * Check if a user has admin role
 */
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() && userDoc.data()?.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

/**
 * Initialize database collections (creates empty collections if needed)
 * Collections are auto-created, but this documents the expected structure
 */
export async function initializeCollections() {
  // Collections that should exist:
  // - users: { uid, name, email, role, createdAt, phone, profileImage }
  // - services: { title, category, description, packages, iconName }
  // - transactions: { userId, userName, userEmail, serviceName, packageName, amount, status, createdAt, paidAt }
  // - user_subscriptions: { userId, serviceName, packageName, purchasedAt, expiresAt, status }

  console.log("📋 Expected Firestore Collections:");
  console.log("  - users");
  console.log("  - services");
  console.log("  - transactions");
  console.log("  - user_subscriptions");
}

/**
 * Run initialization checks on app startup
 */
export async function initializeDatabase() {
  try {
    console.log("\n🔍 Initializing database...");

    // Check superadmin exists
    const superadminExists = await verifySuperadminExists();

    if (!superadminExists) {
      console.warn(`\n⚠️ SETUP REQUIRED: Superadmin account not found!`);
      console.warn(`To create the superadmin account, run:`);
      console.warn(`  npm run setup:superadmin`);
      console.warn(`\nOr manually create in Firebase Console:`);
      console.warn(`  Email: ${SUPERADMIN_EMAILS[0]}`);
      console.warn(`  Role: admin\n`);
    }

    initializeCollections();
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}
