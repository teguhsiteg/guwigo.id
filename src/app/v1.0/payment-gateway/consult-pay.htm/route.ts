import { NextRequest, NextResponse } from "next/server";

export interface AmountObject {
  value: string;
  currency: string;
}

export interface ConsultPayRequest {
  merchantId?: string;
  amount?: AmountObject;
  envInfo?: {
    terminalType?: string;
    osType?: string;
    clientIp?: string;
    sessionId?: string;
    appVersion?: string;
  };
  extendInfo?: Record<string, any>;
}

export interface PaymentInfo {
  payMethod: string;
  paymentOption: string;
  enableStatus: boolean;
  unavailableReason?: string;
  feeRule?: {
    feeType: "FIXED" | "PERCENTAGE";
    feeValue: string;
  };
  minAmount?: AmountObject;
  maxAmount?: AmountObject;
  extendInfo?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    let body: ConsultPayRequest = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          responseCode: "4005700",
          responseMessage: "Invalid JSON format",
        },
        { status: 400 }
      );
    }

    const { merchantId, amount } = body;

    // Validate required fields
    if (!merchantId || typeof merchantId !== "string" || merchantId.trim() === "") {
      return NextResponse.json(
        {
          responseCode: "4005700",
          responseMessage: "Invalid Parameter: merchantId is required",
        },
        { status: 400 }
      );
    }

    if (!amount || !amount.value || isNaN(Number(amount.value)) || Number(amount.value) <= 0) {
      return NextResponse.json(
        {
          responseCode: "4005700",
          responseMessage: "Invalid Parameter: amount.value must be a valid positive amount",
        },
        { status: 400 }
      );
    }

    const currency = amount.currency || "IDR";
    const paymentInfos: PaymentInfo[] = [
      {
        payMethod: "BALANCE",
        paymentOption: "DANA_BALANCE",
        enableStatus: true,
        feeRule: {
          feeType: "PERCENTAGE",
          feeValue: "0",
        },
        minAmount: {
          value: "1000.00",
          currency,
        },
        maxAmount: {
          value: "10000000.00",
          currency,
        },
        extendInfo: {
          name: "Saldo DANA",
          iconUrl: "https://a.m.dana.id/resource/icons/dana-logo.png",
        },
      },
      {
        payMethod: "VIRTUAL_ACCOUNT",
        paymentOption: "BCA_VA",
        enableStatus: true,
        feeRule: {
          feeType: "FIXED",
          feeValue: "1000.00",
        },
        minAmount: {
          value: "10000.00",
          currency,
        },
        maxAmount: {
          value: "20000000.00",
          currency,
        },
        extendInfo: {
          name: "BCA Virtual Account",
          bankCode: "BCA",
        },
      },
      {
        payMethod: "VIRTUAL_ACCOUNT",
        paymentOption: "MANDIRI_VA",
        enableStatus: true,
        feeRule: {
          feeType: "FIXED",
          feeValue: "1000.00",
        },
        minAmount: {
          value: "10000.00",
          currency,
        },
        maxAmount: {
          value: "20000000.00",
          currency,
        },
        extendInfo: {
          name: "Mandiri Virtual Account",
          bankCode: "MANDIRI",
        },
      },
      {
        payMethod: "VIRTUAL_ACCOUNT",
        paymentOption: "BRI_VA",
        enableStatus: true,
        feeRule: {
          feeType: "FIXED",
          feeValue: "1000.00",
        },
        minAmount: {
          value: "10000.00",
          currency,
        },
        maxAmount: {
          value: "20000000.00",
          currency,
        },
        extendInfo: {
          name: "BRI BRIVA",
          bankCode: "BRI",
        },
      },
      {
        payMethod: "VIRTUAL_ACCOUNT",
        paymentOption: "BNI_VA",
        enableStatus: true,
        feeRule: {
          feeType: "FIXED",
          feeValue: "1000.00",
        },
        minAmount: {
          value: "10000.00",
          currency,
        },
        maxAmount: {
          value: "20000000.00",
          currency,
        },
        extendInfo: {
          name: "BNI Virtual Account",
          bankCode: "BNI",
        },
      },
      {
        payMethod: "QRIS",
        paymentOption: "DANA_QRIS",
        enableStatus: true,
        feeRule: {
          feeType: "PERCENTAGE",
          feeValue: "0.7",
        },
        minAmount: {
          value: "1000.00",
          currency,
        },
        maxAmount: {
          value: "5000000.00",
          currency,
        },
        extendInfo: {
          name: "QRIS (Semua E-Wallet & Mobile Banking)",
        },
      },
      {
        payMethod: "CREDIT_CARD",
        paymentOption: "VISA_MASTER",
        enableStatus: true,
        feeRule: {
          feeType: "PERCENTAGE",
          feeValue: "2.0",
        },
        minAmount: {
          value: "20000.00",
          currency,
        },
        maxAmount: {
          value: "50000000.00",
          currency,
        },
        extendInfo: {
          name: "Kartu Kredit / Debit Online (Visa / Mastercard / JCB)",
        },
      },
    ];

    return NextResponse.json(
      {
        responseCode: "2005700",
        responseMessage: "Successful",
        paymentInfos,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in consult-pay handler:", error);
    return NextResponse.json(
      {
        responseCode: "5005700",
        responseMessage: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
