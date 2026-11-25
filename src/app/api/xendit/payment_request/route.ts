import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerName, customerEmail, customerPhone, paymentMethod } = body;

    // 1. Ambil Secret Key
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
      console.warn("Could not read xendit settings:", err);
    }

    if (!secretKey) {
      return NextResponse.json({ error: "Xendit belum dikonfigurasi" }, { status: 500 });
    }

    const authHeader = Buffer.from(`${secretKey}:`).toString("base64");
    const orderId = `GWG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 2. Siapkan Payload untuk Payment Requests API Xendit
    let xenditMethod: any = {};
    if (paymentMethod === "qris") {
      xenditMethod = {
        type: "QR_CODE",
        reusability: "ONE_TIME_USE",
        reference_id: `qr-${orderId}`,
        qr_code: {
          channel_code: "QRIS",
        },
      };
    } else {
      // Asumsi Virtual Account (BCA, MANDIRI, BNI, BRI)
      xenditMethod = {
        type: "VIRTUAL_ACCOUNT",
        reusability: "ONE_TIME_USE",
        reference_id: `va-${orderId}`,
        virtual_account: {
          channel_code: paymentMethod, // e.g., "BCA", "MANDIRI", "BNI", "BRI"
          channel_properties: {
            customer_name: customerName,
          },
        },
      };
    }

    const payload = {
      reference_id: orderId,
      amount: Math.round(amount),
      currency: "IDR",
      payment_method: xenditMethod,
      customer: {
        reference_id: `cust-${Date.now()}`,
        type: "INDIVIDUAL",
        individual_detail: {
          given_names: customerName,
        },
        email: customerEmail || "customer@guwigo.com",
        mobile_number: customerPhone ? (customerPhone.startsWith("0") ? "+62" + customerPhone.slice(1) : (customerPhone.startsWith("+62") ? customerPhone : "+62" + customerPhone)) : undefined,
      },
    };

    // 3. Panggil API Payment Requests
    const response = await fetch("https://api.xendit.co/payment_requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authHeader}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[XENDIT PAYMENT REQUEST ERROR]", data);
      return NextResponse.json({ error: data.message || "Gagal membuat Payment Request Xendit" }, { status: response.status });
    }

    // 4. Ekstrak Hasil
    let paymentAction = null;
    if (paymentMethod === "qris") {
      paymentAction = {
        type: "qris",
        qrString: data.payment_method.qr_code.channel_properties.qr_string,
      };
    } else {
      paymentAction = {
        type: "va",
        bank: paymentMethod,
        vaNumber: data.payment_method.virtual_account.channel_properties.virtual_account_number,
      };
    }

    // 5. Simpan Transaksi
    try {
      await addDoc(collection(db, "transactions"), {
        orderId: orderId,
        merchantRef: orderId,
        xenditId: data.id,
        customerName,
        customerPhone: customerPhone || "",
        customerEmail: customerEmail || "",
        amount: Math.round(amount),
        status: "pending",
        paymentGateway: "xendit",
        paymentMethod: paymentMethod,
        paymentAction: paymentAction,
        createdAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn("Could not save xendit transaction:", dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      paymentAction,
    });

  } catch (error: any) {
    console.error("Xendit API Error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
