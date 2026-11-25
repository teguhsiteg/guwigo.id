import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import type { Transaction, UserSubscription } from "@/types/payment";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const callbackToken = req.headers.get("x-callback-token");
    let configuredToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;

    // Coba ambil dari DB jika tidak ada di env atau ingin override
    try {
      const { getDoc, doc } = await import("firebase/firestore");
      const settingsSnap = await getDoc(doc(db, "systemSettings", "payments"));
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        if (data?.xenditWebhookToken) {
          configuredToken = data.xenditWebhookToken;
        }
      }
    } catch (dbErr) {
      console.warn("Could not read xendit webhook settings from db:", dbErr);
    }

    // Verify token if configured
    if (configuredToken && callbackToken && callbackToken !== configuredToken) {
      console.warn("[XENDIT WEBHOOK] Invalid callback token received");
      return NextResponse.json({ error: "Invalid callback token" }, { status: 403 });
    }

    const body = await req.json();
    console.log("[XENDIT WEBHOOK EVENT]", body);

    // 1. Process Invoice Payment
    const externalId = body.external_id || body.reference_id || body.id;
    const status = (body.status || "").toUpperCase();

    if (!externalId) {
      return NextResponse.json({ success: true, message: "No external_id provided" });
    }

    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("merchantRef", "==", externalId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`[XENDIT WEBHOOK] No transaction found for ${externalId}`);
      return NextResponse.json({ success: true, message: "Transaction not found" });
    }

    const transactionDoc = querySnapshot.docs[0];
    const transactionData = transactionDoc.data() as Transaction;

    if (status === "PAID" || status === "SETTLED" || status === "COMPLETED") {
      await updateDoc(doc(db, "transactions", transactionDoc.id), {
        status: "paid",
        paidAt: body.paid_at || new Date().toISOString(),
        paymentGateway: "xendit",
        xenditId: body.id,
        paymentMethod: body.payment_method || body.payment_channel,
      });

      const subscription: UserSubscription = {
        userId: transactionData.userId,
        serviceId: transactionData.serviceId,
        packageName: transactionData.packageName,
        purchasedAt: new Date().toISOString(),
        status: "active",
      };

      await addDoc(collection(db, "user_subscriptions"), subscription);

      console.log(`[XENDIT SUCCESS] Transaction ${externalId} PAID`);
    } else if (status === "EXPIRED") {
      await updateDoc(doc(db, "transactions", transactionDoc.id), {
        status: "expired",
      });
      console.log(`[XENDIT EXPIRED] Transaction ${externalId} expired`);
    } else if (status === "FAILED") {
      await updateDoc(doc(db, "transactions", transactionDoc.id), {
        status: "failed",
      });
      console.log(`[XENDIT FAILED] Transaction ${externalId} failed`);
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("[XENDIT WEBHOOK ERROR]", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", service: "Xendit Webhook Endpoint Active" });
}
