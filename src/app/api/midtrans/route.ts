import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
    } = body;

    if (!amount || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Nama, No WhatsApp, dan Total biaya diperlukan" },
        { status: 400 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
    const isProduction = serverKey.startsWith("Mid-server-");

    // Inisialisasi Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: isProduction,
      serverKey: serverKey,
      clientKey: clientKey,
    });

    const generatedOrderId = orderId || `GWG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const parameter = {
      transaction_details: {
        order_id: generatedOrderId,
        gross_amount: Math.round(amount),
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail || "customer@guwigo.com",
        phone: customerPhone,
        shipping_address: {
          address: shippingAddress || "Guwigo Store",
        },
      },
      item_details: items && items.length > 0
        ? items.map((it: any) => ({
            id: it.id || "item",
            price: Math.round(it.price),
            quantity: it.quantity || 1,
            name: (it.name || "Item").substring(0, 50),
          }))
        : [
            {
              id: "GWG-ITEM",
              price: Math.round(amount),
              quantity: 1,
              name: "Pesanan Guwigo Store",
            },
          ],
    };

    const transaction = await snap.createTransaction(parameter);

    // Simpan pencatatan transaksi ke Firestore
    try {
      await addDoc(collection(db, "transactions"), {
        orderId: generatedOrderId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || "",
        amount: Math.round(amount),
        status: "pending",
        paymentMethod: "midtrans",
        snapToken: transaction.token,
        redirectUrl: transaction.redirect_url,
        createdAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn("Could not save to transactions collection:", dbErr);
    }

    return NextResponse.json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId: generatedOrderId,
    });
  } catch (error: any) {
    console.error("Midtrans Transaction Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memproses Midtrans payment" },
      { status: 500 }
    );
  }
}
