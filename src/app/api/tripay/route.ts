import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import type { Transaction, TripayPayload } from "@/types/payment";

// 👇 INI BARIS SAKTINYA, PAK! Wajib ada agar Next.js tidak nge-build file ini
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      serviceId,
      serviceName,
      packageName,
      amount,
    } = body;

    // Validate required fields
    if (
      !userId ||
      !userEmail ||
      !serviceId ||
      !packageName ||
      !amount ||
      !userPhone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get Tripay credentials from environment
    const apiKey = process.env.TRIPAY_API_KEY;
    const privateKey = process.env.TRIPAY_PRIVATE_KEY;
    const merchantCode = process.env.TRIPAY_MERCHANT_CODE;

    if (!apiKey || !privateKey || !merchantCode) {
      console.error("Tripay credentials not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Generate unique merchant reference
    const merchantRef = `GWGT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create signature (required by Tripay)
    const signature = crypto
      .createHmac("sha256", privateKey)
      .update(merchantCode + merchantRef + amount)
      .digest("hex");

    // Prepare Tripay payload
    const tripayPayload: TripayPayload = {
      method: "QRIS",
      merchant_ref: merchantRef,
      amount: amount,
      customer_name: userName,
      customer_email: userEmail,
      customer_phone: userPhone,
      order_items: [
        {
          sku: serviceId,
          name: `${serviceName} - ${packageName}`,
          price: amount,
          quantity: 1,
        },
      ],
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://himasteg.my.id"}/dashboard?payment=success`,
      expired_time: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      signature: signature,
    };

    // Save transaction to Firestore BEFORE redirecting to payment
    const transaction: Transaction = {
      id: merchantRef,
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      serviceId: serviceId,
      packageId: `${serviceId}-${packageName}`, // Simplified for now
      packageName: packageName,
      amount: amount,
      status: "pending",
      paymentMethod: "tripay",
      merchantRef: merchantRef,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "transactions"), transaction);
    console.log(`[TRIPAY] Transaction created: ${docRef.id}`);

    // Call Tripay API to create transaction
    const response = await fetch(
      "https://tripay.co.id/api/transaction/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripayPayload),
      },
    );

    const data = await response.json();

    if (data.success) {
      // Update Firestore with Tripay reference
      // const transRef = doc(db, "transactions", docRef.id);
      // await updateDoc(transRef, { tripayRef: data.data.reference });

      return NextResponse.json({ checkoutUrl: data.data.checkout_url });
    } else {
      console.error("Tripay API Error:", data);
      return NextResponse.json(
        { error: "Gagal membuat transaksi", detail: data.message },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Tripay Request Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
