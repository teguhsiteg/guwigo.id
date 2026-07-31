/**
 * Authentication and User Types
 */

export interface User {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "member";
  createdAt: string;
  profileImage?: string;
}

export interface AuthSession {
  uid: string;
  email: string;
  role: "admin" | "member";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "User tidak ditemukan",
  "auth/wrong-password": "Password salah",
  "auth/email-already-in-use": "Email sudah terdaftar",
  "auth/weak-password": "Password minimal 6 karakter",
  "auth/invalid-email": "Format email tidak valid",
  "auth/network-request-failed": "Koneksi internet gagal",
  "auth/too-many-requests": "Terlalu banyak percobaan, coba lagi nanti",
};
