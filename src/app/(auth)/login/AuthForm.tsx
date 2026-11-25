"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithCustomToken,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  Mail,
  Lock,
  ArrowRight,
  User,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { validation } from "@/utils/validation";

// --- KOMPONEN INTI FORM ---
function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, userRole, isLoading: authLoading } = useAuth();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSSORedirecting, setIsSSORedirecting] = useState(false);

  // Helper untuk memvalidasi domain tujuan redirect
  const isValidRedirectUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname === 'localhost' || parsed.hostname.endsWith('guwigo.com');
    } catch {
      return url.startsWith('/');
    }
  };

  // UX States
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordStrength = validation.getPasswordStrength(password);

  useEffect(() => {
    setRedirectTo(searchParams?.get("redirectTo") || null);
  }, [searchParams]);

  // Sinkronisasi Sesi: Hanya redirect jika Firebase Auth benar-benar terautentikasi
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        if (userRole === "admin") {
          router.push(redirectTo || "/admin/dashboard");
        } else {
          router.push(redirectTo || "/dashboard");
        }
      } else {
        // Jika tidak ada user login di Firebase, bersihkan residu sesi usang untuk cegah loop redirect
        localStorage.removeItem("guwigo_admin_session");
        localStorage.removeItem("admin_uid");
        localStorage.removeItem("guwigo_user_session");
        localStorage.removeItem("user_uid");
      }
    }
  }, [authLoading, isAuthenticated, userRole, router, redirectTo]);

  // SSO inbound: terima custom token dari /api/auth/sso/callback (?sso=),
  // tukar jadi sesi Firebase lalu arahkan sesuai role.
  useEffect(() => {
    const ssoToken = searchParams?.get("sso");
    if (!ssoToken) return;

    (async () => {
      try {
        setIsLoading(true);
        const cred = await signInWithCustomToken(auth, ssoToken);
        const user = cred.user;
        const userEmail = (user.email || "").toLowerCase();
        let userData: any = null;

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          userData = userDoc.data();

          if (!userData) {
            const isSuperAdminEmail =
              userEmail === "parthner@guwigo.com" ||
              userEmail === "admin@guwigo.com" ||
              userEmail === "teguhsiteg95@gmail.com";
            const defaultRole = isSuperAdminEmail ? "admin" : "member";
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              name: user.displayName || "User",
              email: user.email,
              role: defaultRole,
              createdAt: new Date().toISOString(),
            });
            userData = { role: defaultRole };
          }
        } catch (docErr) {
          console.warn("SSO Firestore read warning, continuing with fallback role:", docErr);
          const isSuperAdminEmail =
            userEmail === "parthner@guwigo.com" ||
            userEmail === "admin@guwigo.com" ||
            userEmail === "teguhsiteg95@gmail.com";
          userData = { role: isSuperAdminEmail ? "admin" : "member" };
        }

        await handleLoginSuccess(user, userData);
      } catch (err: any) {
        console.error("SSO inbound error:", err);
        setError("Gagal masuk via Guwigo SSO. Silakan login manual.");
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setError(null);
    setShowPasswordRequirements(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateInputs = (): { valid: boolean; message?: string } => {
    const cleanEmail = email.trim();
    if (isLogin) {
      if (!cleanEmail || !password)
        return { valid: false, message: "Email dan password harus diisi" };
      if (!validation.isValidEmail(cleanEmail))
        return { valid: false, message: "Format email tidak valid. Pastikan tidak ada spasi di awal/akhir." };
      return { valid: true };
    } else {
      const cleanName = name.trim();
      if (!cleanName || !cleanEmail || !password || !confirmPassword)
        return { valid: false, message: "Semua field wajib diisi" };
      if (!validation.isValidName(cleanName))
        return { valid: false, message: "Nama harus 3-100 karakter" };
      if (!validation.isValidEmail(cleanEmail))
        return { valid: false, message: "Format email tidak valid" };
      const passwordValidation = validation.isValidPassword(password);
      if (!passwordValidation.valid) {
        return {
          valid: false,
          message: passwordValidation.messages[0] || "Password belum memenuhi syarat keamanan.",
        };
      }
      if (password !== confirmPassword)
        return { valid: false, message: "Konfirmasi password tidak cocok" };
      return { valid: true };
    }
  };

  const handleLoginSuccess = async (user: any, userData: any) => {
    const userEmail = (user.email || "").toLowerCase();
    const rawRole = (userData?.role || "").toLowerCase();
    const isSuperAdmin =
      userEmail === "parthner@guwigo.com" ||
      userEmail === "admin@guwigo.com" ||
      userEmail === "teguhsiteg95@gmail.com" ||
      rawRole === "admin" ||
      rawRole === "super_admin" ||
      rawRole === "superadmin";

    // Self-healing: jika userData belum ada atau role kosong/tidak valid
    let role = rawRole;
    if (!role) {
      role = isSuperAdmin ? "admin" : "member";
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            name: user.displayName || userData?.name || "User",
            email: user.email,
            role,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (saveErr) {
        console.warn("Could not auto-save user role:", saveErr);
      }
    }

    if (isSuperAdmin && (!redirectTo || redirectTo.startsWith("/admin"))) {
      localStorage.setItem("guwigo_admin_session", "ACTIVE");
      localStorage.setItem("admin_uid", user.uid);
      localStorage.removeItem("guwigo_user_session");
      localStorage.removeItem("user_uid");
      router.push(redirectTo || "/admin/dashboard");
    } else {
      localStorage.setItem("guwigo_user_session", "ACTIVE");
      localStorage.setItem("user_uid", user.uid);
      localStorage.removeItem("guwigo_admin_session");
      localStorage.removeItem("admin_uid");

      if (redirectTo && isValidRedirectUrl(redirectTo)) {
        if (redirectTo.startsWith("/")) {
          router.push(redirectTo);
        } else {
          // SSO Flow: Eksternal URL
          try {
            setIsSSORedirecting(true);
            const idToken = await user.getIdToken(true);
            
            const response = await fetch("/api/auth/sso", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
              const errJson = await response.json().catch(() => ({}));
              throw new Error(errJson.error || "Gagal menginisialisasi sesi SSO.");
            }

            const { customToken } = await response.json();
            
            // Membentuk URL redirect dengan token
            const targetUrl = new URL(redirectTo);
            targetUrl.searchParams.set("custom_token", customToken);
            
            window.location.href = targetUrl.toString();
            return;
          } catch (ssoError: any) {
            console.error("SSO Error:", ssoError);
            setIsSSORedirecting(false);
            setError(ssoError.message || "Gagal menghubungkan sesi ke ekosistem SSO.");
            setIsLoading(false);
            return;
          }
        }
      } else {
        if (isSuperAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const userEmail = (user.email || "").toLowerCase();
      let userData: any = null;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        userData = userDoc.data();

        if (!userData) {
          const isSuperAdminEmail =
            userEmail === "parthner@guwigo.com" ||
            userEmail === "admin@guwigo.com" ||
            userEmail === "teguhsiteg95@gmail.com";
          const defaultRole = isSuperAdminEmail ? "admin" : "member";
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName || "User",
            email: user.email,
            role: defaultRole,
            createdAt: new Date().toISOString(),
          });
          userData = { role: defaultRole };
        }
      } catch (firestoreErr) {
        console.warn("Firestore profile fetch error, continuing with default role:", firestoreErr);
        const isSuperAdminEmail =
          userEmail === "parthner@guwigo.com" ||
          userEmail === "admin@guwigo.com" ||
          userEmail === "teguhsiteg95@gmail.com";
        userData = { role: isSuperAdminEmail ? "admin" : "member" };
      }
      
      await handleLoginSuccess(user, userData);
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        setError("Jendela login Google ditutup.");
      } else if (error.code === "auth/unauthorized-domain") {
        setError("Domain ini belum didaftarkan di Firebase Authentication (Authorized Domains). Silakan tambahkan domain di Firebase Console.");
      } else if (error.code === "auth/popup-blocked") {
        setError("Popup login diblokir oleh browser. Mohon izinkan popup untuk situs ini.");
      } else {
        setError(`Gagal login Google: ${error.message || error.code}`);
      }
      setIsLoading(false);
    }
  };

  const handleGuwigoSSO = () => {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
    if (!authUrl) {
      setError("Fitur SSO belum dikonfigurasi (NEXT_PUBLIC_AUTH_URL tidak ditemukan).");
      return;
    }

    // Arahkan ke IdP (guwigo-auth); IdP cek sesinya dan balik dengan token.
    const callbackUrl = `${window.location.origin}/api/auth/sso/callback`;
    const target = new URL(`${authUrl}/api/auth/sso`);
    target.searchParams.set("redirect", callbackUrl);
    target.searchParams.set("aud", "guwigo-tech");
    window.location.href = target.toString();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation_result = validateInputs();
    if (!validation_result.valid) {
      setError(validation_result.message || "Validasi gagal");
      return;
    }

    setIsLoading(true);
    const cleanEmail = email.trim();

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password,
        );
        const user = userCredential.user;
        const userEmail = (user.email || cleanEmail).toLowerCase();

        let userData: any = null;
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          userData = userDoc.data();

          if (!userData) {
            const isSuperAdminEmail =
              userEmail === "parthner@guwigo.com" ||
              userEmail === "admin@guwigo.com" ||
              userEmail === "teguhsiteg95@gmail.com";
            const defaultRole = isSuperAdminEmail ? "admin" : "member";
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              name: user.displayName || "User",
              email: user.email || cleanEmail,
              role: defaultRole,
              createdAt: new Date().toISOString(),
            });
            userData = { role: defaultRole };
          }
        } catch (firestoreErr) {
          console.warn("Firestore profile fetch error, continuing with default role:", firestoreErr);
          const isSuperAdminEmail =
            userEmail === "parthner@guwigo.com" ||
            userEmail === "admin@guwigo.com" ||
            userEmail === "teguhsiteg95@gmail.com";
          userData = { role: isSuperAdminEmail ? "admin" : "member" };
        }

        await handleLoginSuccess(user, userData);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password,
        );
        const user = userCredential.user;
        const cleanName = name.trim();
        await updateProfile(user, { displayName: cleanName });
        const userEmail = cleanEmail.toLowerCase();
        const isSuperAdminEmail =
          userEmail === "parthner@guwigo.com" ||
          userEmail === "admin@guwigo.com" ||
          userEmail === "teguhsiteg95@gmail.com";
        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: cleanName,
            email: cleanEmail,
            role: isSuperAdminEmail ? "admin" : "member",
            createdAt: new Date().toISOString(),
          });
        } catch (fsErr) {
          console.warn("Firestore user registration warning:", fsErr);
        }
        setError(null);
        alert("Akun berhasil dibuat! Silakan login.");
        toggleMode();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      const errorCode = error.code || "";
      let message = "Terjadi kesalahan saat masuk. Silakan coba lagi.";
      if (
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/invalid-credential"
      ) {
        message = "Email atau password salah. Silakan periksa kembali data Anda.";
      } else if (errorCode === "auth/invalid-email") {
        message = "Format email tidak valid. Pastikan penulisan email sudah benar.";
      } else if (errorCode === "auth/email-already-in-use") {
        message = "Email sudah terdaftar. Silakan login langsung.";
      } else if (errorCode === "auth/too-many-requests") {
        message = "Terlalu banyak percobaan login gagal. Mohon tunggu beberapa saat sebelum mencoba lagi.";
      } else if (errorCode === "auth/user-disabled") {
        message = "Akun ini telah dinonaktifkan oleh administrator.";
      } else if (errorCode === "auth/network-request-failed") {
        message = "Koneksi internet bermasalah. Periksa jaringan Anda.";
      } else if (error.message && !error.message.includes("Firebase:")) {
        message = error.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Overlay Transisi SSO
  if (isSSORedirecting) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] flex flex-col items-center justify-center text-[#FAF9F6] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2563EB]/15 rounded-md blur-[140px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#06B6D4]/10 rounded-md blur-[120px] -ml-40 -mb-40 pointer-events-none"></div>
        
        <div className="z-10 flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#2563EB] mb-6" />
          <h2 className="font-serif text-3xl font-normal mb-2 tracking-tight">Otentikasi Berhasil</h2>
          <p className="text-[#94A3B8] font-sans text-sm text-center max-w-sm">
            Menghubungkan sesi aman Anda ke ekosistem Guwigo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#FAF9F6] flex overflow-hidden font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] transition-all duration-700 ease-in-out ${
        !isLogin ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* 1. FORM PANEL */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 bg-white border-r border-[#E2E8F0] z-20 min-h-screen pt-24 pb-10 overflow-y-auto relative"
      >
        {/* TOMBOL KEMBALI KE BERANDA */}
        <Link
          href="/"
          className="absolute top-8 left-6 lg:top-12 lg:left-12 flex items-center gap-2 px-4 py-2 bg-[#FAF9F6] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 text-xs font-medium tracking-wide shadow-sm z-50 group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Beranda
        </Link>

        <div className="w-full max-w-md mx-auto my-auto pt-8">
          {/* Logo Guwigo */}
          <div className="mb-8 flex justify-center lg:justify-start">
            <div className="relative w-12 h-12">
              <Image
                src="/images/branding/loader.png"
                alt="Guwigo Icon"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          <header className="mb-8 text-center lg:text-left">
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#0F172A] mb-3 tracking-tight">
              {isLogin ? "Selamat Datang" : "Bergabung Bersama"}
            </h1>
            <p className="text-[#64748B] text-sm leading-relaxed">
              {isLogin
                ? "Akses dashboard untuk mengelola infrastruktur ekosistem digital Anda."
                : "Akselerasi transformasi digital bisnis Anda di ekosistem Guwigo."}
            </p>
          </header>

          <AnimatePresence>
            {error && (
              <motion.div
                role="alert"
                aria-live="assertive"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-md flex gap-3 items-start overflow-hidden shadow-sm"
              >
                <AlertCircle
                  size={18}
                  className="text-red-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs font-medium text-red-800 leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuthSubmit} className="space-y-5" noValidate>
            <AnimatePresence mode="wait">
              {isLogin ? (
                // --- LOGIN FORM ---
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-[11px] font-medium text-[#64748B] mb-1.5 uppercase tracking-wider"
                    >
                      Alamat Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={16} className="text-[#94A3B8]" />
                      </div>
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-11 pr-4 py-3.5 border border-[#E2E8F0] rounded-md focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all bg-[#FAF9F6] focus:bg-white text-[#0F172A] text-sm placeholder:text-[#94A3B8]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <label
                        htmlFor="login-password"
                        className="block text-[11px] font-medium text-[#64748B] uppercase tracking-wider"
                      >
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-[11px] font-medium text-[#2563EB] hover:underline transition-colors"
                      >
                        Lupa Password?
                      </Link>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={16} className="text-[#94A3B8]" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3.5 border border-[#E2E8F0] rounded-md focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all bg-[#FAF9F6] focus:bg-white text-[#0F172A] text-sm placeholder:text-[#94A3B8]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#0F172A] focus:outline-none"
                        aria-label={
                          showPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // --- REGISTER FORM ---
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="block text-[11px] font-medium text-[#64748B] mb-1.5 uppercase tracking-wider"
                    >
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={16} className="text-[#94A3B8]" />
                      </div>
                      <input
                        id="reg-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Resmi Anda"
                        className="w-full pl-11 pr-4 py-3.5 border border-[#E2E8F0] rounded-md focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all bg-[#FAF9F6] focus:bg-white text-[#0F172A] text-sm placeholder:text-[#94A3B8]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-[11px] font-medium text-[#64748B] mb-1.5 uppercase tracking-wider"
                    >
                      Alamat Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={16} className="text-[#94A3B8]" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-11 pr-4 py-3.5 border border-[#E2E8F0] rounded-md focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all bg-[#FAF9F6] focus:bg-white text-[#0F172A] text-sm placeholder:text-[#94A3B8]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <label
                        htmlFor="reg-password"
                        className="block text-[11px] font-medium text-[#64748B] uppercase tracking-wider"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswordRequirements(!showPasswordRequirements)
                        }
                        className="text-[11px] text-[#2563EB] font-medium hover:underline focus:outline-none transition-colors"
                      >
                        Info Keamanan
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={16} className="text-[#94A3B8]" />
                      </div>
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 Karakter"
                        className="w-full pl-11 pr-12 py-3.5 border border-[#E2E8F0] rounded-md focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all bg-[#FAF9F6] focus:bg-white text-[#0F172A] text-sm placeholder:text-[#94A3B8]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#0F172A] focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-3 flex gap-1.5 px-1">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const strengthMap = {
                            weak: 1,
                            fair: 2,
                            good: 3,
                            strong: 4,
                          };
                          const strengthLevel =
                            strengthMap[
                              passwordStrength as keyof typeof strengthMap
                            ] || 0;
                          const color =
                            level > strengthLevel
                              ? "bg-[#E2E8F0]"
                              : level <= 2
                                ? "bg-red-500"
                                : level === 3
                                  ? "bg-amber-500"
                                  : "bg-emerald-600";
                          return (
                            <div
                              key={level}
                              className={`h-1.5 w-full rounded-md transition-colors duration-300 ${color}`}
                            />
                          );
                        })}
                      </div>
                    )}

                    <AnimatePresence>
                      {showPasswordRequirements && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-[#FAF9F6] border border-[#E2E8F0] rounded-md overflow-hidden"
                        >
                          <p className="text-xs font-medium text-[#0F172A] mb-2 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#2563EB]" />
                            Syarat Password:
                          </p>
                          <ul className="space-y-1.5">
                            {[
                              "Minimal 8 karakter",
                              "Huruf besar & kecil",
                              "Mengandung angka",
                              "Simbol khusus (!@#$%)",
                            ].map((req, idx) => (
                              <li
                                key={idx}
                                className="text-[11px] text-[#64748B] flex items-center gap-2"
                              >
                                <CheckCircle2
                                  size={12}
                                  className="text-[#2563EB]"
                                />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-confirm"
                      className="block text-[11px] font-medium text-[#64748B] mb-1.5 uppercase tracking-wider"
                    >
                      Ulangi Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={16} className="text-[#94A3B8]" />
                      </div>
                      <input
                        id="reg-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3.5 border border-[#E2E8F0] rounded-md focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all bg-[#FAF9F6] focus:bg-white text-[#0F172A] text-sm placeholder:text-[#94A3B8]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#0F172A] focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full mt-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3.5 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Masuk Ekosistem" : "Daftar Akun"}
                  <ArrowRight size={14} />
                </span>
              )}
            </button>
          </form>

          {/* Social Auth (Google) */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[#94A3B8] uppercase tracking-wider text-[11px]">Atau lanjutkan dengan</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleAuth}
            className="w-full mt-5 bg-white border border-[#E2E8F0] text-[#0F172A] font-medium py-3 rounded-md hover:bg-[#FAF9F6] transition-all flex items-center justify-center gap-3 text-xs shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          {/* SSO Guwigo */}
          {process.env.NEXT_PUBLIC_AUTH_URL && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGuwigoSSO}
              className="w-full mt-3 bg-white border border-[#E2E8F0] text-[#0F172A] font-medium py-3 rounded-md hover:bg-[#FAF9F6] transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
            >
              <ShieldCheck size={16} className="text-[#2563EB]" />
              Masuk via Guwigo ID
            </button>
          )}

          {/* TOGGLE TEXT */}
          <div className="mt-8 text-center pb-6 border-t border-[#E2E8F0] pt-6">
            <p className="text-xs text-[#64748B]">
              {isLogin
                ? "Belum memiliki identitas digital?"
                : "Sudah bermitra dengan kami?"}{" "}
              <button
                onClick={toggleMode}
                type="button"
                className="text-[#2563EB] font-medium hover:underline focus:outline-none transition-colors ml-1"
              >
                {isLogin ? "Daftar Sekarang" : "Login di sini"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. IMAGE PANEL (Guwigo Midnight Navy Showcase) */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className="hidden lg:flex w-1/2 relative z-10 bg-[#0A0F1D] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/15 rounded-md blur-[140px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-md blur-[120px] -ml-32 -mb-32 pointer-events-none"></div>

        <div className="absolute inset-0 flex flex-col justify-between p-16 xl:p-20 z-20">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl tracking-[0.15em] text-[#FAF9F6]">GUWIGO</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-md">ID</span>
          </div>

          <div>
            <h2 className="font-serif text-4xl xl:text-5xl font-normal text-[#FAF9F6] leading-[1.15] mb-6 tracking-tight">
              Crafting Connected Systems <br />
              <span className="italic text-[#38BDF8]">for Modern Indonesia.</span>
            </h2>
            <p className="text-[15px] text-[#94A3B8] leading-relaxed max-w-lg border-l-2 border-[#2563EB] pl-6 font-sans">
              Standar rekayasa perangkat lunak enterprise dengan estetika yang tenang, performa tinggi, dan ketelitian arsitektur tanpa kompromi.
            </p>
          </div>

          <div className="text-xs text-[#64748B] font-mono tracking-wider">
            © {new Date().getFullYear()} PT Guwigo Teknologi Indonesia
          </div>
        </div>

        <Image
          src="/images/founder/teguh-coding-setup.jpg"
          alt="Guwigo Workspace"
          fill
          className="object-cover opacity-10 mix-blend-luminosity"
          priority
        />
      </motion.div>
    </div>
  );
}

// --- EXPORT UTAMA DIBUNGKUS SUSPENSE ---
export function AuthForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0A0F1D]">
          <Loader2 className="animate-spin text-[#2563EB] w-10 h-10" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
