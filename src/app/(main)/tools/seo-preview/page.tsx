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
import Image from "next/image";

export default function SEOPreviewerPage() {
  const [title, setTitle] = useState("PT Guwigo Teknologi Indonesia");
  const [description, setDescription] = useState(
    "Ekosistem teknologi terdepan dari Yogyakarta untuk Indonesia. Kami merancang, membangun, dan memelihara sistem digital skala enterprise.",
  );
  const [url, setUrl] = useState("https://guwigo.com");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  );

  const [activeTab, setActiveTab] = useState<
    "google" | "facebook" | "twitter" | "wa"
  >("google");
  const [copied, setCopied] = useState(false);

  // Auto-generate meta tags based on input
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

  // Helper untuk format domain
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
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION EKSKLUSIF (DARK PREMIUM THEME)
      ========================================== */}
      <section className="bg-[#0B1324] pt-40 pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[45vh]">
        {/* Background Visual Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00D4FF]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black text-[#00D4FF] uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Search size={12} /> Guwigo Free Tools
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            SEO & Open Graph <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-blue-500">
              Previewer.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Simulasikan bagaimana website Anda terlihat di mesin pencari dan
            media sosial. Optimalkan *Click-Through Rate* (CTR) Anda dengan
            metadata yang sempurna.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. THE TOOL (SPLIT SCREEN LAYOUT)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* PANEL KIRI: INPUT FORM (LIGHT MODE) */}
          <div className="w-full lg:w-5/12 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-900/5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <Settings2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Metadata Parameter
                </h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                  Konfigurasi Website Anda
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* URL */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1 flex items-center gap-2">
                  <Globe size={14} className="text-[#00D4FF]" /> Alamat URL
                  Website
                </label>
                <input
                  type="url"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none transition-all shadow-sm"
                  placeholder="https://domain-anda.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* Title */}
              <div>
                <div className="flex justify-between items-end mb-3 ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-[#00D4FF]" /> Judul
                    Halaman (Meta Title)
                  </label>
                  <span
                    className={`text-[10px] font-bold ${title.length > 60 ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {title.length} / 60
                  </span>
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none transition-all shadow-sm"
                  placeholder="Judul website Anda..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-end mb-3 ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-[#00D4FF]" /> Deskripsi
                    (Meta Description)
                  </label>
                  <span
                    className={`text-[10px] font-bold ${description.length > 160 ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {description.length} / 160
                  </span>
                </div>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none transition-all resize-none shadow-sm"
                  placeholder="Penjelasan singkat mengenai website Anda yang akan menarik klik pengunjung..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1 flex items-center gap-2">
                  <ImageIcon size={14} className="text-[#00D4FF]" /> Open Graph
                  Image URL
                </label>
                <input
                  type="url"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none transition-all shadow-sm mb-2"
                  placeholder="https://domain.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="text-[10px] font-medium text-slate-400 ml-1">
                  *Rekomendasi ukuran: 1200 x 630 pixels.
                </p>
              </div>
            </div>
          </div>

          {/* PANEL KANAN: PREVIEW & OUTPUT (DARK MODE) */}
          <div className="w-full lg:w-7/12 bg-[#0B1324] rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-800 flex flex-col p-8 md:p-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF]">
                  <Eye size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Live Simulator
                  </h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                    Visualisasi Platform
                  </p>
                </div>
              </div>

              {/* TABS SIMULATOR */}
              <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
                <button
                  onClick={() => setActiveTab("google")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === "google" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <Search size={14} /> Google
                </button>
                <button
                  onClick={() => setActiveTab("facebook")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === "facebook" ? "bg-slate-800 text-[#1877F2] shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <MonitorSmartphone size={14} /> FB/X
                </button>
                <button
                  onClick={() => setActiveTab("wa")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === "wa" ? "bg-slate-800 text-[#25D366] shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <MessageCircle size={14} /> WA
                </button>
              </div>
            </div>

            {/* AREA RENDER PREVIEW */}
            <div className="flex-1 bg-white rounded-3xl p-6 mb-8 flex items-center justify-center shadow-inner relative overflow-hidden">
              {/* Pattern Background for White Area */}
              <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-sm relative z-10"
                >
                  {/* GOOGLE PREVIEW */}
                  {activeTab === "google" && (
                    <div className="bg-white p-4 rounded-xl border border-transparent">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="favicon"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Globe size={14} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] text-slate-800 font-medium leading-tight">
                            {title || "Nama Website"}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {url || "https://website.com"}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer mb-1 line-clamp-1 leading-tight">
                        {title ||
                          "Judul Halaman Website Anda Akan Muncul Di Sini"}
                      </h3>
                      <p className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed">
                        {description ||
                          "Ini adalah contoh deskripsi meta yang akan dibaca oleh pengunjung saat mencari di Google. Usahakan ringkas dan relevan."}
                      </p>
                    </div>
                  )}

                  {/* FACEBOOK / TWITTER PREVIEW */}
                  {activeTab === "facebook" && (
                    <div className="bg-[#f0f2f5] rounded-xl border border-[#dadde1] overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="aspect-[1.91/1] w-full bg-slate-200 border-b border-[#dadde1] relative overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Open Graph"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={32} />
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-[#f0f2f5]">
                        <p className="text-[11px] text-[#606770] uppercase tracking-wider mb-0.5 font-semibold">
                          {getDomain(url)}
                        </p>
                        <h4 className="text-[15px] font-bold text-[#1d2129] leading-tight mb-1 line-clamp-1">
                          {title || "Judul Open Graph Website"}
                        </h4>
                        <p className="text-[13px] text-[#606770] line-clamp-1">
                          {description ||
                            "Deskripsi singkat yang akan muncul di bawah judul saat dibagikan."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* WHATSAPP PREVIEW */}
                  {activeTab === "wa" && (
                    <div className="bg-[#e9edef] p-2 rounded-xl rounded-tr-none w-fit max-w-[300px] ml-auto shadow-sm relative mr-2">
                      <div className="bg-[#f2f4f5] rounded-lg overflow-hidden border border-[#d1d7db] flex flex-col mb-1 cursor-pointer hover:bg-[#e8ebed]">
                        <div className="aspect-[1.91/1] w-full bg-slate-200 relative overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="WhatsApp Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <h4 className="text-[14px] font-bold text-[#111b21] leading-tight mb-1 line-clamp-1">
                            {title || "Judul Halaman"}
                          </h4>
                          <p className="text-[13px] text-[#667781] line-clamp-1 mb-1.5">
                            {description || "Deskripsi singkat tautan"}
                          </p>
                          <p className="text-[11px] text-[#667781] lowercase">
                            {getDomain(url)}
                          </p>
                        </div>
                      </div>
                      {/* Pesan Teks Bawah WA */}
                      <div className="px-1 pb-1 flex justify-between items-end gap-3 text-[13px] text-[#111b21]">
                        <span className="text-blue-500 underline break-all">
                          {url || "https://website.com"}
                        </span>
                        <span className="text-[10px] text-[#667781] shrink-0">
                          14:00
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Output Meta Tags & Copy Action */}
            <div className="mt-auto bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner w-full">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Code2 size={14} className="text-[#00D4FF]" /> Generated HTML
                Meta Tags
              </p>

              <div className="w-full bg-black/50 text-emerald-400 text-xs font-mono p-4 rounded-xl border border-white/5 overflow-x-auto whitespace-pre custom-scrollbar mb-4 min-w-0 max-h-[160px]">
                {generatedCode}
              </div>

              <button
                onClick={handleCopy}
                className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
                  copied
                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                    : "bg-[#00D4FF] hover:bg-white text-[#0B1324] shadow-[#00D4FF]/20"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} /> Script Tersalin
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy HTML Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 8px; margin: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `,
        }}
      />
    </div>
  );
}
