import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import type { Transaction, UserSubscription } from "@/types/payment";

// 👇 INI BARIS SAKTINYA, PAK! Mencegah Next.js membuild file ini secara statis
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Get data sent by Tripay
    const body = await req.json();

    // 2. Get signature from header (for security verification)
    const tripaySignature = req.headers.get("x-callback-signature");
    const privateKey = process.env.TRIPAY_PRIVATE_KEY || "";

    // 3. Verify signature (ensure it's really from Tripay, not a hacker)
    const signature = crypto
      .createHmac("sha256", privateKey)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== tripaySignature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });
    }

    // 4. Process payment status
    if (body.status === "PAID") {
      const merchantRef = body.merchant_ref;

      // Find the transaction in Firestore using merchantRef
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("merchantRef", "==", merchantRef));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn(
          `[TRIPAY CALLBACK] No transaction found for ${merchantRef}`,
        );
        return NextResponse.json({ success: true }); // Still return OK to Tripay
      }

      const transactionDoc = querySnapshot.docs[0];
      const transactionData = transactionDoc.data() as Transaction;

      // Update transaction status to PAID
      await updateDoc(doc(db, "transactions", transactionDoc.id), {
        status: "paid",
        paidAt: new Date().toISOString(),
        tripayRef: body.reference,
      });

      // Create user subscription record
      const subscription: UserSubscription = {
        userId: transactionData.userId,
        serviceId: transactionData.serviceId,
        packageName: transactionData.packageName,
        purchasedAt: new Date().toISOString(),
        status: "active",
        // Add expiry if needed (e.g., for subscription services)
        // expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      };

      await addDoc(collection(db, "user_subscriptions"), subscription);

      console.log(
        `[TRIPAY SUCCESS] Transaction ${merchantRef} PAID - Subscription activated for user ${transactionData.userId}`,
      );
    } else if (body.status === "EXPIRED") {
      const merchantRef = body.merchant_ref;

      // Update transaction to expired
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("merchantRef", "==", merchantRef));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const transactionDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "transactions", transactionDoc.id), {
          status: "expired",
        });
      }

      console.log(`[TRIPAY EXPIRED] Transaction ${merchantRef} has expired`);
    } else if (body.status === "FAILED") {
      const merchantRef = body.merchant_ref;

      // Update transaction to failed
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("merchantRef", "==", merchantRef));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const transactionDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "transactions", transactionDoc.id), {
          status: "failed",
        });
      }

      console.log(`[TRIPAY FAILED] Transaction ${merchantRef} failed`);
    }

    // Return OK to Tripay so they know the report was received
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error Tripay Callback:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
