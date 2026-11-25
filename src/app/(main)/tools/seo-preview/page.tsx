"use client";

import { useState } from "react";
import {
  Search,
  Globe,
  Image as ImageIcon,
  FileText,
  Copy,
  CheckCircle,
  Eye,
  Settings2,
  Code2,
  MonitorSmartphone,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SEOPreviewerPage() {
  const [title, setTitle] = useState("PT Guwigo Teknologi Indonesia");
  const [description, setDescription] = useState(
    "Arsitek perangkat lunak dan ekosistem digital skala enterprise dari Yogyakarta. Solusi web, mobile, dan sistem kustom berkinerja tinggi.",
  );
  const [url, setUrl] = useState("https://guwigo.com");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  );

  const [activeTab, setActiveTab] = useState<
    "google" | "facebook" | "wa"
  >("google");
  const [copied, setCopied] = useState(false);

  const generatedCode = `<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDomain = (fullUrl: string) => {
    try {
      const parsedUrl = new URL(
        fullUrl.startsWith("http") ? fullUrl : `https://${fullUrl}`,
      );
      return parsedUrl.hostname;
    } catch {
      return "website.com";
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION (EDITORIAL BRAND THEME)
      ========================================== */}
      <section className="pt-36 md:pt-44 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center border-b border-[#E2E8F0] text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#2563EB]/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-medium text-[#1D4ED8] mb-6 shadow-sm">
            <Search size={13} className="text-[#2563EB]" /> Metadata & Open Graph Utility
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0F172A] mb-5 tracking-tight leading-[1.1] font-normal">
            SEO & Open Graph <br />
            <span className="italic text-[#2563EB]">Previewer.</span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Simulasikan tampilan website Anda saat muncul di hasil pencarian Google, kartu Facebook, dan obrolan WhatsApp. Lengkap dengan generator tag HTML otomatis.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. THE TOOL (SPLIT SCREEN LAYOUT)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 py-14 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* PANEL KIRI: INPUT FORM (LIGHT CARD) */}
          <div className="w-full lg:w-5/12 bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-5">
              <div className="w-9 h-9 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Settings2 size={18} />
              </div>
              <div>
                <h2 className="text-base font-serif font-normal text-[#0F172A] tracking-tight">
                  Metadata Parameter
                </h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Konfigurasikan informasi halaman website Anda
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* URL */}
              <div>
                <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Globe size={13} className="text-[#2563EB]" /> Alamat URL
                </label>
                <input
                  type="url"
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                  placeholder="https://guwigo.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* Title */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={13} className="text-[#2563EB]" /> Judul (Meta Title)
                  </label>
                  <span
                    className={`text-[11px] font-mono ${title.length > 60 ? "text-red-500 font-semibold" : "text-[#64748B]"}`}
                  >
                    {title.length} / 60
                  </span>
                </div>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                  placeholder="Judul halaman..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={13} className="text-[#2563EB]" /> Deskripsi Meta
                  </label>
                  <span
                    className={`text-[11px] font-mono ${description.length > 160 ? "text-red-500 font-semibold" : "text-[#64748B]"}`}
                  >
                    {description.length} / 160
                  </span>
                </div>
                <textarea
                  rows={4}
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all resize-none leading-relaxed"
                  placeholder="Deskripsi ringkas yang menarik klik calon pengunjung..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-[#2563EB]" /> Open Graph Image URL
                </label>
                <input
                  type="url"
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                  placeholder="https://domain.com/og-image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="text-[11px] text-[#64748B] mt-1.5">
                  Rasio ideal: 1200 × 630 pixels (1.91:1)
                </p>
              </div>
            </div>
          </div>

          {/* PANEL KANAN: PREVIEW & OUTPUT (DARK CARD) */}
          <div className="w-full lg:w-7/12 bg-[#0A0F1D] rounded-xl shadow-sm border border-[#1E293B] flex flex-col p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 min-w-0 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#1E293B] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#2563EB]/20 text-[#60A5FA] flex items-center justify-center border border-[#2563EB]/40">
                  <Eye size={18} />
                </div>
                <div>
                  <h2 className="text-base font-serif font-normal text-white tracking-tight">
                    Live Simulator
                  </h2>
                  <p className="text-[11px] text-[#38BDF8] mt-0.5">
                    Visualisasi kartu di berbagai platform
                  </p>
                </div>
              </div>

              {/* TABS SIMULATOR */}
              <div className="flex bg-[#131C31] rounded-lg p-1 border border-[#1E293B]">
                <button
                  onClick={() => setActiveTab("google")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === "google"
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <Search size={13} /> Google
                </button>
                <button
                  onClick={() => setActiveTab("facebook")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === "facebook"
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <MonitorSmartphone size={13} /> Sosmed
                </button>
                <button
                  onClick={() => setActiveTab("wa")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === "wa"
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <MessageCircle size={13} /> WhatsApp
                </button>
              </div>
            </div>

            {/* AREA RENDER PREVIEW */}
            <div className="flex-1 bg-white rounded-lg p-5 mb-6 flex items-center justify-center shadow-inner relative overflow-hidden text-slate-900 min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-sm relative z-10"
                >
                  {/* GOOGLE PREVIEW */}
                  {activeTab === "google" && (
                    <div className="bg-white p-2 text-left">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="favicon"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Globe size={13} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-slate-800 font-medium leading-tight">
                            {title || "Nama Website"}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {url || "https://website.com"}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-[#1a0dab] text-base font-medium hover:underline cursor-pointer mb-1 line-clamp-1 leading-tight">
                        {title || "Judul Halaman Website"}
                      </h3>
                      <p className="text-[#4d5156] text-xs line-clamp-2 leading-relaxed">
                        {description ||
                          "Deskripsi meta akan dibaca oleh pengunjung saat mencari di Google."}
                      </p>
                    </div>
                  )}

                  {/* FACEBOOK / SOSMED PREVIEW */}
                  {activeTab === "facebook" && (
                    <div className="bg-[#f0f2f5] rounded-lg border border-[#dadde1] overflow-hidden text-left shadow-sm">
                      <div className="aspect-[1.91/1] w-full bg-slate-200 border-b border-[#dadde1] relative overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Open Graph"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={28} />
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-white">
                        <p className="text-[10px] text-[#606770] uppercase tracking-wider mb-0.5 font-semibold">
                          {getDomain(url)}
                        </p>
                        <h4 className="text-sm font-bold text-[#1d2129] leading-tight mb-1 line-clamp-1">
                          {title || "Judul Open Graph Website"}
                        </h4>
                        <p className="text-xs text-[#606770] line-clamp-1">
                          {description || "Deskripsi singkat tampilan kartu media sosial."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* WHATSAPP PREVIEW */}
                  {activeTab === "wa" && (
                    <div className="bg-[#e9edef] p-2 rounded-lg rounded-tr-none w-fit max-w-[280px] ml-auto shadow-sm text-left">
                      <div className="bg-[#f2f4f5] rounded-md overflow-hidden border border-[#d1d7db] flex flex-col mb-1">
                        <div className="aspect-[1.91/1] w-full bg-slate-200 relative overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="WhatsApp Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon size={22} />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <h4 className="text-xs font-bold text-[#111b21] leading-tight mb-0.5 line-clamp-1">
                            {title || "Judul Halaman"}
                          </h4>
                          <p className="text-[11px] text-[#667781] line-clamp-1 mb-1">
                            {description || "Deskripsi singkat tautan"}
                          </p>
                          <p className="text-[10px] text-[#667781] lowercase">
                            {getDomain(url)}
                          </p>
                        </div>
                      </div>
                      <div className="px-1 flex justify-between items-end gap-3 text-xs text-[#111b21]">
                        <span className="text-[#2563EB] underline break-all text-[11px]">
                          {url || "https://website.com"}
                        </span>
                        <span className="text-[9px] text-[#667781] shrink-0">14:00</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Output Meta Tags & Copy Action */}
            <div className="mt-auto bg-black/40 border border-[#1E293B] rounded-lg p-4 w-full">
              <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 size={13} className="text-[#60A5FA]" /> Kode Meta Tags HTML
              </p>

              <div className="w-full bg-black/60 text-emerald-400 text-xs font-mono p-3 rounded-md border border-white/5 overflow-x-auto whitespace-pre mb-3 max-h-[140px]">
                {generatedCode}
              </div>

              <button
                onClick={handleCopy}
                className={`w-full py-2.5 rounded-lg font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle size={15} /> Script HTML Tersalin
                  </>
                ) : (
                  <>
                    <Copy size={15} /> Salin Kode Meta Tag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
