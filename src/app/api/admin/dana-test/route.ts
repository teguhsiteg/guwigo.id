import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function formatPemKey(rawKey: string): string {
  if (rawKey.includes("BEGIN PRIVATE KEY")) return rawKey;
  return `-----BEGIN PRIVATE KEY-----\n${rawKey.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----`;
}

function getWibTimestamp(offsetMinutes = 0): string {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 3600000);

  const YYYY = wib.getFullYear();
  const MM = String(wib.getMonth() + 1).padStart(2, "0");
  const DD = String(wib.getDate()).padStart(2, "0");
  const hh = String(wib.getHours()).padStart(2, "0");
  const mm = String(wib.getMinutes()).padStart(2, "0");
  const ss = String(wib.getSeconds()).padStart(2, "0");

  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}+07:00`;
}

function generateRsaSignature(stringToSign: string, privateKeyPem: string): string {
  const sign = crypto.createSign("SHA256");
  sign.update(stringToSign);
  sign.end();
  return sign.sign(privateKeyPem, "base64");
}

function sha256Hex(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex").toLowerCase();
}

import { defaultDanaConfig } from "@/lib/dana";

export async function POST(req: NextRequest) {
  try {
    const { action, config, customPayload } = await req.json();

    const baseUrl = config?.baseUrl || defaultDanaConfig.baseUrl;
    const merchantId = config?.merchantId || defaultDanaConfig.merchantId;
    const clientKey = config?.clientKey || defaultDanaConfig.clientKey;
    const rawKey = config?.privateKey || defaultDanaConfig.privateKey;

    if (!rawKey && action !== "notify_webhook") {
      return NextResponse.json({ error: "Private Key is required" }, { status: 400 });
    }

    const privateKey = formatPemKey(rawKey);
    const timestamp = getWibTimestamp();

    // 0. Notify Webhook Tester (Local verification)
    if (action === "notify_webhook") {
      const notifyPayload = customPayload || {
        originalPartnerReferenceNo: "ORD" + Date.now(),
        originalReferenceNo: "DANA" + Date.now(),
        merchantId,
        amount: {
          value: "150000.00",
          currency: "IDR",
        },
        latestTransactionStatus: "00",
        transactionStatusDesc: "SUCCESS",
        additionalInfo: {},
      };

      try {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const notifyUrl = `${protocol}://${host}/v1.0/debit/notify`;

        const notifyRes = await fetch(notifyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-TIMESTAMP": timestamp,
          },
          body: JSON.stringify(notifyPayload),
        });

        const notifyData = await notifyRes.json();
        return NextResponse.json({
          step: "notify",
          status: notifyRes.status,
          request: {
            url: "/v1.0/debit/notify",
            headers: { "Content-Type": "application/json", "X-TIMESTAMP": timestamp },
            body: notifyPayload,
          },
          response: notifyData,
          isSuccess: notifyData.responseCode === "2005600" || notifyData.responseCode === "2000000",
        });
      } catch (err: any) {
        return NextResponse.json({
          step: "notify",
          status: 500,
          error: err.message,
          isSuccess: false,
        });
      }
    }

    // 1. Get B2B Access Token
    const tokenSts = `${clientKey}|${timestamp}`;
    const tokenSig = generateRsaSignature(tokenSts, privateKey);

    const tokenHeaders = {
      "Content-Type": "application/json",
      "X-TIMESTAMP": timestamp,
      "X-SIGNATURE": tokenSig,
      "X-CLIENT-KEY": clientKey,
    };
    const tokenBody = JSON.stringify({ grantType: "client_credentials" });

    const tokenRes = await fetch(`${baseUrl}/v1.0/access-token/b2b.htm`, {
      method: "POST",
      headers: tokenHeaders,
      body: tokenBody,
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.accessToken) {
      return NextResponse.json({
        step: "auth",
        status: tokenRes.status,
        request: {
          url: `${baseUrl}/v1.0/access-token/b2b.htm`,
          headers: tokenHeaders,
          body: JSON.parse(tokenBody),
        },
        response: tokenData,
        isSuccess: false,
        error: "Failed to get B2B Token",
      });
    }

    const token = tokenData.accessToken;

    if (action === "auth_token") {
      return NextResponse.json({
        step: "auth",
        status: tokenRes.status,
        request: {
          url: `${baseUrl}/v1.0/access-token/b2b.htm`,
          headers: tokenHeaders,
          body: JSON.parse(tokenBody),
        },
        response: tokenData,
        isSuccess: tokenData.responseCode === "2007300",
      });
    }

    // Helper to send SNAP requests
    const sendSnapRequest = async (path: string, payload: any, stepName: string, successCode: string) => {
      const bodyStr = JSON.stringify(payload);
      const hexBody = sha256Hex(bodyStr);
      const sts = `POST:${path}:${hexBody}:${timestamp}`;
      const sig = generateRsaSignature(sts, privateKey);
      const externalId = payload.partnerReferenceNo || payload.originalPartnerReferenceNo || Date.now().toString();

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-TIMESTAMP": timestamp,
        "X-SIGNATURE": sig,
        "X-PARTNER-ID": clientKey,
        "X-EXTERNAL-ID": externalId,
        "CHANNEL-ID": "95221",
      };

      const res = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers,
        body: bodyStr,
      });

      const data = await res.json();
      return NextResponse.json({
        step: stepName,
        status: res.status,
        request: {
          url: `${baseUrl}${path}`,
          headers,
          body: payload,
        },
        response: data,
        isSuccess: data.responseCode === successCode,
      });
    };

    // 2. Action: Consult Pay
    if (action === "consult_pay") {
      const externalId = Date.now().toString().slice(0, 16);
      const consultBody = customPayload || {
        partnerReferenceNo: externalId,
        merchantId,
        amount: {
          value: "150000.00",
          currency: "IDR",
        },
        additionalInfo: {},
      };
      return await sendSnapRequest(
        "/v1.0/payment-gateway/consult-pay.htm",
        consultBody,
        "consult_pay",
        "2005700"
      );
    }

    // 3. Action: Create Order (Host-to-Host)
    if (action === "create_order") {
      const partnerRef = customPayload?.partnerReferenceNo || "ORD" + Date.now();
      const orderBody = customPayload || {
        partnerReferenceNo: partnerRef,
        merchantId,
        amount: {
          value: "150000.00",
          currency: "IDR",
        },
        urlParams: [
          {
            url: "https://guwigo.com/store/checkout/finish",
            type: "PAY_RETURN",
            isDeeplink: "N",
          },
          {
            url: "https://guwigo.com/api/dana-webhook",
            type: "NOTIFICATION",
            isDeeplink: "N",
          },
        ],
        additionalInfo: {
          orderTitle: "Guwigo Service Invoice",
        },
      };
      return await sendSnapRequest(
        "/payment-gateway/v1.0/debit/payment-host-to-host.htm",
        orderBody,
        "create_order",
        "2005400"
      );
    }

    // 4. Action: Check Transaction Status
    if (action === "check_status") {
      const originalPartnerRef = customPayload?.originalPartnerReferenceNo || "ORD" + Date.now();
      const statusBody = customPayload || {
        originalPartnerReferenceNo: originalPartnerRef,
        merchantId,
        serviceCode: "54",
        additionalInfo: {},
      };
      return await sendSnapRequest(
        "/payment-gateway/v1.0/debit/status.htm",
        statusBody,
        "check_status",
        "2005500"
      );
    }

    // 5. Action: Refund Order
    if (action === "refund_order") {
      const refundRef = customPayload?.partnerRefundNo || "REF" + Date.now();
      const origPartnerRef = customPayload?.originalPartnerReferenceNo || "ORD" + Date.now();
      const refundBody = customPayload || {
        partnerRefundNo: refundRef,
        originalPartnerReferenceNo: origPartnerRef,
        merchantId,
        refundAmount: {
          value: "10000.00",
          currency: "IDR",
        },
        reason: "Customer request cancellation",
        additionalInfo: {},
      };
      return await sendSnapRequest(
        "/payment-gateway/v1.0/debit/refund.htm",
        refundBody,
        "refund_order",
        "2005800"
      );
    }

    // 6. Action: Cancel Order
    if (action === "cancel_order") {
      const origPartnerRef = customPayload?.originalPartnerReferenceNo || "ORD" + Date.now();
      const cancelBody = customPayload || {
        originalPartnerReferenceNo: origPartnerRef,
        merchantId,
        reason: "User cancelled order payment",
        additionalInfo: {},
      };
      return await sendSnapRequest(
        "/payment-gateway/v1.0/debit/cancel.htm",
        cancelBody,
        "cancel_order",
        "2005900"
      );
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
