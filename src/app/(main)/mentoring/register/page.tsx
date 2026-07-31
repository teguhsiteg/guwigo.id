"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  ShieldCheck,
  Lock,
  CreditCard,
  Loader2,
  AlertCircle,
  Rocket,
} from "lucide-react";

// --- DATA PAKET ---
const PLANS = {
  trial: {
    name: "Free Trial (3 Hari)",
    price: 0,
    features: [
      "Akses Modul Dasar",
      "Full Akses 3 Hari",
      "Setelahnya View-Only",
    ],
    buttonText: "Daftar & Mulai Belajar (Gratis)",
  },
  pro: {
    name: "Pro Access (Selamanya)",
    price: 150000,
    features: [
      "Semua Modul Video",
      "Basic SIM Boilerplate",
      "Akses Seumur Hidup",
    ],
    buttonText: "Lanjut ke Pembayaran",
  },
  vip: {
    name: "VIP Mentoring (Batch 1)",
    price: 250000,
    features: [
      "Semua Fitur Pro",
      "Premium Boilerplate",
      "1 Bulan VIP Mentoring & Grup",
    ],
    buttonText: "Lanjut ke Pembayaran",
  },
};

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter(); // <-- Tambahkan router untuk redirect
  const planQuery = searchParams.get("plan") as keyof typeof PLANS;
  const selectedPlan = PLANS[planQuery] || PLANS["trial"];

  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // <-- State untuk popup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: "",
  });

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi loading ke server (1.5 detik)
    setTimeout(() => {
      setIsLoading(false);

      if (selectedPlan.price === 0) {
        // JIKA TRIAL -> Munculkan Popup Custom
        setShowPopup(true);

        // Redirect otomatis ke halaman login setelah 3 detik
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 3000);
      } else {
        // JIKA BERBAYAR -> Panggil Midtrans (Ini akan kita buat di tahap selanjutnya)
        alert(
          `Sistem sedang membuat tagihan Rp ${selectedPlan.price.toLocaleString("id-ID")} untuk ${formData.name}...\n\n(Nanti di titik ini POPUP MIDTRANS akan muncul secara otomatis) 💳`,
        );
      }
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 mb-24 relative">
      {/* POPUP SUKSES CUSTOM (Hanya muncul jika showPopup === true) */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Pendaftaran Sukses!
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Akun <strong>{formData.name || "Siswa"}</strong> berhasil dibuat.
              Waktu Trial 3 Hari Anda dimulai SEKARANG! 🚀
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-bold bg-blue-50 py-3 rounded-xl">
              <Loader2 size={16} className="animate-spin" /> Mengalihkan ke Area
              Member...
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto">
        {/* KOLOM KIRI: FORMULIR AKUN */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Pendaftaran Kelas
            </h1>
            <p className="text-slate-500">
              Buat akun untuk mengakses materi mentoring Guwigo.
            </p>
          </div>

          <form
            onSubmit={handleProcess}
            className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock size={20} className="text-blue-500" /> Informasi Akun
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                    Email Aktif
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="john@example.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="0812xxxxxx"
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                  Password Akun
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Minimal 6 karakter"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  *Gunakan password ini untuk login ke materi kelas nanti.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: ORDER SUMMARY */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-24 shadow-2xl shadow-blue-900/20">
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">
              Ringkasan Pesanan
            </h3>

            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-1">Paket Terpilih:</p>
              <h4 className="text-2xl font-black text-blue-400">
                {selectedPlan.name}
              </h4>
            </div>

            <ul className="space-y-3 mb-8">
              {selectedPlan.features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm text-slate-300"
                >
                  <CheckCircle
                    size={18}
                    className="text-green-400 shrink-0 mt-0.5"
                  />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {selectedPlan.price === 0 && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-6 flex items-start gap-2 text-xs text-red-200">
                <AlertCircle
                  size={16}
                  className="shrink-0 mt-0.5 text-red-400"
                />
                <p>
                  Setelah 3 hari, akun Anda akan terkunci menjadi{" "}
                  <strong>View Only</strong> (tidak bisa download boilerplate &
                  akses tertutup).
                </p>
              </div>
            )}

            <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-center">
              <span className="text-slate-400">Total Tagihan</span>
              <span className="text-3xl font-black text-white">
                {selectedPlan.price === 0
                  ? "GRATIS"
                  : `Rp ${selectedPlan.price.toLocaleString("id-ID")}`}
              </span>
            </div>

            <button
              onClick={handleProcess}
              disabled={isLoading || showPopup}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedPlan.price === 0
                  ? "bg-white text-slate-900 hover:bg-slate-200"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {selectedPlan.price === 0 ? (
                    <Rocket size={20} />
                  ) : (
                    <CreditCard size={20} />
                  )}
                  {selectedPlan.buttonText}
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} className="text-green-400" /> Pembayaran
              aman terenkripsi 256-bit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32">
      <Suspense
        fallback={
          <div className="text-center py-20 animate-pulse text-slate-500">
            Memuat form pendaftaran...
          </div>
        }
      >
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
