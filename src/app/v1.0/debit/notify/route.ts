import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          responseCode: "4005600",
          responseMessage: "Invalid JSON format",
        },
        { status: 400 }
      );
    }

    const { partnerReferenceNo, originalPartnerReferenceNo, originalReferenceNo } = body;
    const refNo = originalPartnerReferenceNo || partnerReferenceNo || originalReferenceNo || "UNKNOWN";

    console.log(">>> [DANA Webhook] Received Payment Notification:", JSON.stringify(body, null, 2));

    // Expected response for DANA Payment Notification (Code 2005600 / 2000000)
    return NextResponse.json(
      {
        responseCode: "2005600",
        responseMessage: "Successful",
        partnerReferenceNo: refNo,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in DANA notification handler:", error);
    return NextResponse.json(
      {
        responseCode: "5005600",
        responseMessage: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
