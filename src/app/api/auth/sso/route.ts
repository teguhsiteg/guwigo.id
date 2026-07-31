import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken is required" },
        { status: 400 },
      );
    }

    if (!adminAuth) {
      return NextResponse.json(
        { error: "Firebase Admin is not initialized" },
        { status: 500 },
      );
    }

    // Verifikasi idToken yang dikirim dari klien
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Buat custom token untuk uid tersebut
    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({ customToken });
  } catch (error: any) {
    console.error("SSO Token Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate SSO token", details: error.message },
      { status: 500 },
    );
  }
}
