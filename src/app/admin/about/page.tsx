"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import {
  FileText,
  Save,
  Loader2,
  AlertCircle,
  Building,
  Target,
  User,
  Calendar,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

interface AboutContent {
  title: string;
  subtitle: string;
  vision: string;
  mission: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  founderImageUrl: string;
  founded: string;
  companyStory: string;
}

export default function AboutAdminPage() {
  const [data, setData] = useState<AboutContent>({
    title: "Lahir di Sleman, Mendunia dari Yogyakarta",
    subtitle: "The Journey of Guwigo",
    vision:
      "Menciptakan ekosistem digital yang memberdayakan UMKM dan individu",
    mission: "Menyediakan solusi teknologi terjangkau dan mudah digunakan",
    founderName: "Teguh Dwi Prayogo",
    founderTitle: "CEO & Founder",
    founderBio:
      "Pengusaha teknologi dengan pengalaman 8+ tahun di industri digital",
    founderImageUrl: "/images/founder/teguh-ceo-profile.jpg",
    founded: "2015",
    companyStory:
      "Dimulai dari passion untuk membantu UMKM Indonesia go digital...",
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
      const docRef = doc(db, "admin", "about-content");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data() as AboutContent);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      setMessage({
        type: "error",
        text: "Gagal memuat data. Periksa koneksi Anda.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const docRef = doc(db, "admin", "about-content");
      await setDoc(docRef, { ...data, updatedAt: Timestamp.now() });
      setMessage({
        type: "success",
        text: "Halaman About berhasil diperbarui secara live!",
      });
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Profil Perusahaan...
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
            <Building className="text-blue-600" /> Profil Perusahaan
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Atur sejarah, visi-misi, dan profil founder untuk halaman About Us.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 w-full md:w-auto justify-center"
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {/* NOTIFIKASI */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 mb-8 font-bold text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          } animate-in fade-in slide-in-from-top-4`}
        >
          <AlertCircle size={20} />
          <p>{message.text}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* =======================================
            SECTION 1: PAGE HEADER (JUDUL)
        ======================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sparkles size={20} className="text-blue-500" /> Header Halaman
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Judul Halaman (Headline)
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-lg font-black text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Sub-judul (Teks Pendukung)
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 2: COMPANY INFORMATION
        ======================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Target size={20} className="text-blue-500" /> Visi, Misi & Sejarah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Tahun Berdiri
              </label>
              <div className="relative group w-full md:w-1/2">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  value={data.founded}
                  onChange={(e) =>
                    setData({ ...data, founded: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Visi Perusahaan
              </label>
              <textarea
                value={data.vision}
                onChange={(e) => setData({ ...data, vision: e.target.value })}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Misi Perusahaan
              </label>
              <textarea
                value={data.mission}
                onChange={(e) => setData({ ...data, mission: e.target.value })}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Cerita Perjalanan (Company Story)
              </label>
              <textarea
                value={data.companyStory}
                onChange={(e) =>
                  setData({ ...data, companyStory: e.target.value })
                }
                rows={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 3: FOUNDER INFORMATION
        ======================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <User size={20} className="text-blue-500" /> Profil Founder
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Nama Lengkap Founder
              </label>
              <input
                type="text"
                value={data.founderName}
                onChange={(e) =>
                  setData({ ...data, founderName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Jabatan / Gelar
              </label>
              <input
                type="text"
                value={data.founderTitle}
                onChange={(e) =>
                  setData({ ...data, founderTitle: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Bio Singkat Founder
              </label>
              <textarea
                value={data.founderBio}
                onChange={(e) =>
                  setData({ ...data, founderBio: e.target.value })
                }
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                URL Foto Founder
              </label>
              <div className="relative group">
                <ImageIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  value={data.founderImageUrl}
                  onChange={(e) =>
                    setData({ ...data, founderImageUrl: e.target.value })
                  }
                  placeholder="/images/founder/profile.jpg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-11 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
