import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          responseCode: "4005400",
          responseMessage: "Invalid JSON format",
        },
        { status: 400 }
      );
    }

    const { partnerReferenceNo, merchantId, amount } = body;

    if (!partnerReferenceNo) {
      return NextResponse.json(
        {
          responseCode: "4005402",
          responseMessage: "Invalid Mandatory Field partnerReferenceNo",
        },
        { status: 400 }
      );
    }

    const redirectUrl = `https://m.sandbox.dana.id/d/checkout/pay?bizNo=2026${Date.now()}&partnerReferenceNo=${encodeURIComponent(
      partnerReferenceNo
    )}`;

    return NextResponse.json(
      {
        responseCode: "2005400",
        responseMessage: "Successful",
        partnerReferenceNo: partnerReferenceNo,
        webRedirectUrl: redirectUrl,
        createdTime: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        responseCode: "5005401",
        responseMessage: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
