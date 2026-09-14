"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import {
  LayoutTemplate,
  Save,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Palette,
} from "lucide-react";

interface HeroBranding {
  siteName: string;
  tagline: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  ctaLink: string;
  theme: "light" | "dark";
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
}

export default function HeroAdminPage() {
  // State default akan di-overwrite saat fetch berhasil
  const [data, setData] = useState<HeroBranding>({
    siteName: "Guwigo Indonesia",
    tagline: "Building Digital Civilizations",
    description: "Platform teknologi terdepan dari Yogyakarta",
    heroTitle: "Lahir di Sleman, Mendunia dari Yogyakarta",
    heroSubtitle: "Ekosistem teknologi lengkap untuk transformasi digital",
    ctaText: "Mulai Perjalanan",
    ctaLink: "#services",
    theme: "light",
    primaryColor: "#2563eb",
    accentColor: "#0d47a1",
    logoUrl: "/images/branding/logo.png",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const docRef = doc(db, "admin", "hero-branding");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data() as HeroBranding);
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
      setMessage({
        type: "error",
        text: "Koneksi terputus. Gagal mengambil data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const docRef = doc(db, "admin", "hero-branding");
      await setDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      setMessage({
        type: "success",
        text: "Hero & Branding berhasil diperbarui secara live!",
      });

      // Auto-hide notifikasi setelah 3 detik
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setMessage({
        type: "error",
        text: "Gagal menyimpan perubahan ke database.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Tampilkan loader halus saat pertama kali load
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Data Branding...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-sans max-w-5xl mx-auto pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <LayoutTemplate className="text-blue-600" /> Hero & Branding
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Atur teks, warna, dan tombol utama halaman depan website Anda di
            sini. Perubahan akan langsung terlihat di Landing Page.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {/* NOTIFIKASI */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 mb-8 font-bold text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          } animate-in fade-in slide-in-from-top-4 duration-300`}
        >
          <AlertCircle size={20} />
          <p>{message.text}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* =======================================
            SECTION 1: IDENTITAS UTAMA WEBSITE
        ======================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Type size={20} className="text-blue-500" /> Identitas Dasar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Nama Website / Bisnis
              </label>
              <input
                type="text"
                value={data.siteName}
                onChange={(e) => setData({ ...data, siteName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Misal: Guwigo"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Tagline Singkat (Label Badge)
              </label>
              <input
                type="text"
                value={data.tagline}
                onChange={(e) => setData({ ...data, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Misal: Guwigo Ecosystem"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Deskripsi Singkat (Meta / Ringkasan)
              </label>
              <textarea
                rows={2}
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                placeholder="Deskripsi singkat seputar apa itu Guwigo..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                URL Logo (Link Gambar Utama)
              </label>
              <div className="relative group">
                <ImageIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  value={data.logoUrl}
                  onChange={(e) =>
                    setData({ ...data, logoUrl: e.target.value })
                  }
                  placeholder="https://contoh.com/logo.png"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-11 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 2: HERO SECTION TEXT
        ======================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <LayoutTemplate size={20} className="text-blue-500" /> Teks Hero Utama
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Judul Hero (Headline Besar)
              </label>
              <input
                type="text"
                value={data.heroTitle}
                onChange={(e) =>
                  setData({ ...data, heroTitle: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-lg font-black text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Sub-judul Hero (Paragraf Penjelasan)
              </label>
              <textarea
                value={data.heroSubtitle}
                onChange={(e) =>
                  setData({ ...data, heroSubtitle: e.target.value })
                }
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Teks Tombol Aksi (CTA)
                </label>
                <input
                  type="text"
                  value={data.ctaText}
                  onChange={(e) =>
                    setData({ ...data, ctaText: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-blue-700 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Link Tombol (Destinasi URL)
                </label>
                <div className="relative group">
                  <LinkIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    value={data.ctaLink}
                    onChange={(e) =>
                      setData({ ...data, ctaLink: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-11 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 3: TEMA & WARNA
        ======================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Palette size={20} className="text-blue-500" /> Warna & Tema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Tema Keseluruhan
              </label>
              <select
                value={data.theme}
                onChange={(e) =>
                  setData({
                    ...data,
                    theme: e.target.value as "light" | "dark",
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="light">Light Mode (Terang)</option>
                <option value="dark">Dark Mode (Gelap)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Warna Utama (Tombol CTA)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) =>
                    setData({ ...data, primaryColor: e.target.value })
                  }
                  className="w-14 h-12 border-2 border-slate-200 rounded-xl cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={data.primaryColor}
                  onChange={(e) =>
                    setData({ ...data, primaryColor: e.target.value })
                  }
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Warna Aksen (Ornamen / Dot)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.accentColor}
                  onChange={(e) =>
                    setData({ ...data, accentColor: e.target.value })
                  }
                  className="w-14 h-12 border-2 border-slate-200 rounded-xl cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={data.accentColor}
                  onChange={(e) =>
                    setData({ ...data, accentColor: e.target.value })
                  }
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all uppercase"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
