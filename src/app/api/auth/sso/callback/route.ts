import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { adminAuth } from "@/lib/firebase-admin";

// SSO inbound: callback dari guwigo-auth (IdP). Menerima transfer token
// (?token=<JWT>) yang ditandatangani SSO_SECRET_KEY, memverifikasinya, lalu
// menukarnya menjadi Firebase custom token untuk client sign-in.
// Lihat protokol: tege-omni/docs/sso-protocol.md.

const SSO_ISSUER = "guwigo-auth";
const SSO_AUD = "guwigo-tech";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const secret = process.env.SSO_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "SSO not configured" }, { status: 500 });
  }

  let decoded: jwt.JwtPayload;
  try {
    decoded = jwt.verify(token, secret, {
      issuer: SSO_ISSUER,
      audience: SSO_AUD,
    }) as jwt.JwtPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired SSO token" },
      { status: 401 },
    );
  }

  const uid = decoded.sub;
  if (!uid) {
    return NextResponse.json({ error: "Token missing sub" }, { status: 401 });
  }

  if (!adminAuth) {
    return NextResponse.json(
      { error: "Firebase Admin not initialized" },
      { status: 500 },
    );
  }

  // Custom token utk ditukar client via signInWithCustomToken.
  const customToken = await adminAuth.createCustomToken(uid);

  // Arahkan ke halaman login; AuthForm membaca ?sso= dan menukarnya jadi sesi.
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("sso", customToken);

  return NextResponse.redirect(loginUrl);
}
