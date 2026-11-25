import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

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
      description,
      successRedirectUrl,
      failureRedirectUrl,
    } = body;

    if (!amount || !customerName) {
      return NextResponse.json(
        { error: "Nama dan Total nominal pembayaran diperlukan" },
        { status: 400 }
      );
    }

    // Ambil Secret Key dari Firestore settings atau fallback ke .env
    let secretKey = process.env.XENDIT_SECRET_KEY || "";
    try {
      const settingsDoc = await getDoc(doc(db, "systemSettings", "payments"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        if (data?.xenditSecretKey) {
          secretKey = data.xenditSecretKey;
        }
      }
    } catch (err) {
      console.warn("Could not read xendit settings from db, using env:", err);
    }

    if (!secretKey) {
      return NextResponse.json(
        { error: "Xendit Secret Key belum dikonfigurasi di server" },
        { status: 500 }
      );
    }

    const generatedOrderId =
      orderId ||
      `GWG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const authHeader = Buffer.from(`${secretKey}:`).toString("base64");

    const payload = {
      external_id: generatedOrderId,
      amount: Math.round(amount),
      payer_email: customerEmail || "customer@guwigo.com",
      description: description || `Pembayaran Layanan Guwigo Tech - ${generatedOrderId}`,
      invoice_duration: 86400, // 24 jam
      success_redirect_url: successRedirectUrl || "https://guwigo.com/dashboard",
      failure_redirect_url: failureRedirectUrl || "https://guwigo.com",
      customer: {
        given_names: customerName,
        email: customerEmail || "customer@guwigo.com",
        ...(customerPhone ? { mobile_number: customerPhone } : {}),
      },
      items:
        items && items.length > 0
          ? items.map((it: any) => ({
              name: (it.name || "Item Layanan").substring(0, 50),
              quantity: it.quantity || 1,
              price: Math.round(it.price || amount),
            }))
          : [
              {
                name: "Layanan Guwigo Tech",
                quantity: 1,
                price: Math.round(amount),
              },
            ],
    };

    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[XENDIT CREATE INVOICE ERROR]", data);
      return NextResponse.json(
        { error: data.message || "Gagal membuat invoice Xendit" },
        { status: response.status }
      );
    }

    // Simpan pencatatan transaksi ke Firestore
    try {
      await addDoc(collection(db, "transactions"), {
        orderId: generatedOrderId,
        merchantRef: generatedOrderId,
        xenditId: data.id,
        customerName,
        customerPhone: customerPhone || "",
        customerEmail: customerEmail || "",
        amount: Math.round(amount),
        status: "pending",
        paymentGateway: "xendit",
        invoiceUrl: data.invoice_url,
        expiryDate: data.expiry_date,
        createdAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn("Could not save xendit transaction to firestore:", dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId: generatedOrderId,
      invoiceId: data.id,
      invoiceUrl: data.invoice_url,
      status: data.status,
    });
  } catch (error: any) {
    console.error("Xendit API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
