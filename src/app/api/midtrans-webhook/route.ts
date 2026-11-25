import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let notification: any = {};
    try {
      const bodyText = await req.text();
      if (bodyText) {
        notification = JSON.parse(bodyText);
      }
    } catch (parseError) {
      console.warn("Midtrans Webhook: Empty or invalid JSON body");
    }

    // 1. Ambil data dari notifikasi Midtrans
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = notification;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    // 2. Verifikasi Signature Key untuk Keamanan
    const hashData = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(hashData)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.warn("Invalid Signature Key - test payload ignored.");
      return NextResponse.json(
        { status: "success", message: "OK" },
        { status: 200 }
      );
    }

    if (!adminDb) {
      throw new Error("Firebase Admin DB is not initialized.");
    }

    // 3. Tentukan status pembayaran
    let paymentStatus = "pending";

    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        paymentStatus = "challenge"; // Butuh manual review
      } else if (fraud_status === "accept") {
        paymentStatus = "paid";
      }
    } else if (transaction_status === "settlement") {
      paymentStatus = "paid";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      paymentStatus = "failed";
    } else if (transaction_status === "pending") {
      paymentStatus = "pending";
    }

    // 4. Cari transaksi di Firestore berdasarkan orderId menggunakan Admin SDK
    const txRef = adminDb.collection("transactions");
    const querySnapshot = await txRef.where("orderId", "==", order_id).get();

    if (querySnapshot.empty) {
      console.warn("Transaksi tidak ditemukan di database:", order_id);
      return NextResponse.json({ message: "Transaction not found" });
    }

    // 5. Update status transaksi
    const batch = adminDb.batch();
    querySnapshot.forEach((document) => {
      batch.update(document.ref, {
        status: paymentStatus,
        paymentType: payment_type,
        updatedAt: new Date().toISOString(),
      });
    });
    
    await batch.commit();

    console.log(`[Midtrans Webhook] Sukses update pesanan ${order_id} menjadi ${paymentStatus}`);

    return NextResponse.json({ message: "OK" });
  } catch (error: any) {
    console.error("[Midtrans Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message, stack: error?.stack },
      { status: 500 }
    );
  }
}
