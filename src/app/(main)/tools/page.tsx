"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  MonitorPlay,
  Copy,
  CheckCircle,
  ArrowRight,
  Star,
  Wrench,
  MoonStar,
  Sunrise,
  CalendarClock,
  ExternalLink,
  KeyRound,
  Type,
  MessageCircle,
  Search,
  LayoutGrid,
  GraduationCap,
  Wand2,
  Crown,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DynamicToolItem {
  id: string;
  title: string;
  description: string;
  category: "utility" | "obs" | "saas";
  link: string;
  badge?: string;
  actionText?: string;
  isExternal?: boolean;
  order?: number;
}

export default function ToolsHubPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [tools, setTools] = useState<DynamicToolItem[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    setBaseUrl(window.location.origin);

    const fetchTools = async () => {
      try {
        const snap = await getDocs(collection(db, "tools_items"));
        const data = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as DynamicToolItem
        );
        if (data.length > 0) {
          data.sort((a, b) => (a.order || 0) - (b.order || 0));
          setTools(data);
        }
      } catch (e) {
        console.error("Error fetching tools:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleCopyOBS = (path: string) => {
    const fullUrl = `${baseUrl}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(path);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getCategoryIcon = (title: string, category: string) => {
    const t = title.toLowerCase();
    if (t.includes("qr")) return <QrCode size={24} />;
    if (t.includes("password")) return <KeyRound size={24} />;
    if (t.includes("wa")) return <MessageCircle size={24} />;
    if (t.includes("seo")) return <Search size={24} />;
    if (t.includes("edu")) return <GraduationCap size={24} />;
    if (t.includes("proposal") || category === "saas")
      return <Wand2 size={24} />;
    if (t.includes("marquee") || t.includes("running")) return <Type size={18} />;
    if (t.includes("buka") || t.includes("puasa")) return <MoonStar size={18} />;
    if (t.includes("imsak")) return <Sunrise size={18} />;
    if (t.includes("sholat") || t.includes("jadwal"))
      return <CalendarClock size={18} />;
    return <Wrench size={22} />;
  };

  const utilityTools = tools.filter(
    (t) => t.category === "utility" || t.category === "saas"
  );
  const obsTools = tools.filter((t) => t.category === "obs");

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION (EDITORIAL BRAND THEME)
      ========================================== */}
      <section className="pt-36 md:pt-44 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center border-b border-[#E2E8F0] text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#2563EB]/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-medium text-[#1D4ED8] mb-6 shadow-sm">
            <Wrench size={13} className="text-[#2563EB]" /> Guwigo Utilities & Ecosystem
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#0F172A] mb-5 tracking-tight leading-[1.1] font-normal">
            Tingkatkan Produktivitas <br />
            <span className="italic text-[#2563EB]">Tanpa Batas.</span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Kumpulan instrumen pengembangan, optimasi metadata, dan aset penyiaran yang dirancang khusus untuk mempercepat alur kerja dan operasional digital Anda.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-16 relative z-20">
        {/* ==========================================
            KELOMPOK 1: WEB TOOLS UTAMA
        ========================================== */}
        <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-md bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
              <LayoutGrid size={18} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#0F172A] tracking-tight">
                Web & Marketing Utilities
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Alat praktis siap pakai untuk tim teknis dan pemasaran, gratis tanpa registrasi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilityTools.length > 0 ? (
              utilityTools.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-[330px] relative overflow-hidden group"
                >
                  {item.badge && (
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium tracking-tight ${
                          item.category === "saas"
                            ? "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]"
                            : "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                        }`}
                      >
                        <Star size={10} className="fill-current" /> {item.badge}
                      </span>
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-sm">
                    {getCategoryIcon(item.title, item.category)}
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] mb-2 tracking-tight group-hover:text-[#2563EB] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#64748B] font-normal leading-relaxed mb-auto line-clamp-3">
                    {item.description}
                  </p>

                  <Link
                    href={item.link}
                    className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors bg-[#FAF9F6] hover:bg-[#2563EB] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#2563EB] mt-5 shadow-sm"
                  >
                    {item.actionText || "Buka Console"} <ArrowRight size={14} />
                  </Link>
                </div>
              ))
            ) : (
              <>
                {/* KARTU 1: QR CODE */}
                <div className="bg-white rounded-xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-[330px] group">
                  <div className="w-12 h-12 bg-[#EFF6FF] text-[#2563EB] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-sm">
                    <QrCode size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] mb-2 tracking-tight group-hover:text-[#2563EB] transition-colors">
                    QR Code Generator
                  </h3>
                  <p className="text-xs text-[#64748B] font-normal leading-relaxed mb-auto">
                    Ubah Teks, URL, atau Kontak WhatsApp menjadi QR Code resolusi tinggi secara real-time. Bebas masa kedaluwarsa.
                  </p>
                  <Link
                    href="/tools/qrcode"
                    className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors bg-[#FAF9F6] hover:bg-[#2563EB] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#2563EB] mt-5 shadow-sm"
                  >
                    Buka Console <ArrowRight size={14} />
                  </Link>
                </div>

                {/* KARTU 2: PASSWORD */}
                <div className="bg-white rounded-xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-[330px] group">
                  <div className="w-12 h-12 bg-[#0A0F1D] text-white rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#2563EB] transition-colors shadow-sm">
                    <KeyRound size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] mb-2 tracking-tight group-hover:text-[#2563EB] transition-colors">
                    Password Generator
                  </h3>
                  <p className="text-xs text-[#64748B] font-normal leading-relaxed mb-auto">
                    Rakit kata sandi dan token acak tingkat militer yang sangat kuat. Seluruh proses kriptografi diproses aman secara lokal di browser.
                  </p>
                  <Link
                    href="/tools/password"
                    className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors bg-[#FAF9F6] hover:bg-[#2563EB] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#2563EB] mt-5 shadow-sm"
                  >
                    Buka Console <ArrowRight size={14} />
                  </Link>
                </div>

                {/* KARTU 3: WA LINK GENERATOR */}
                <div className="bg-white rounded-xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-[330px] group">
                  <div className="w-12 h-12 bg-[#ECFDF5] text-[#059669] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-sm">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] mb-2 tracking-tight group-hover:text-[#2563EB] transition-colors">
                    WA Link Builder
                  </h3>
                  <p className="text-xs text-[#64748B] font-normal leading-relaxed mb-auto">
                    Rakit tautan WhatsApp dinamis dengan pesan otomatis. Dilengkapi fitur live chat preview untuk kenyamanan konversi Anda.
                  </p>
                  <Link
                    href="/tools/wa-generator"
                    className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors bg-[#FAF9F6] hover:bg-[#2563EB] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#2563EB] mt-5 shadow-sm"
                  >
                    Buka Console <ArrowRight size={14} />
                  </Link>
                </div>

                {/* KARTU 4: SEO PREVIEWER */}
                <div className="bg-white rounded-xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-[330px] group">
                  <div className="w-12 h-12 bg-[#FAF5FF] text-[#7E22CE] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-sm">
                    <Search size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] mb-2 tracking-tight group-hover:text-[#2563EB] transition-colors">
                    SEO & Social Preview
                  </h3>
                  <p className="text-xs text-[#64748B] font-normal leading-relaxed mb-auto">
                    Simulasikan metadata website Anda di Google, Facebook, Twitter, dan WhatsApp secara real-time. Otomatis menghasilkan kode Open Graph.
                  </p>
                  <Link
                    href="/tools/seo-preview"
                    className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors bg-[#FAF9F6] hover:bg-[#2563EB] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#2563EB] mt-5 shadow-sm"
                  >
                    Buka Console <ArrowRight size={14} />
                  </Link>
                </div>

                {/* KARTU 5: EDUPROMPT */}
                <div className="bg-white rounded-xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-[330px] relative overflow-hidden group">
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium tracking-tight bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                      <Star size={10} className="fill-current" /> Populer
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-[#FFFBEB] text-[#B45309] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-sm">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] mb-2 tracking-tight group-hover:text-[#2563EB] transition-colors">
                    EduPrompt AI Generator
                  </h3>
                  <p className="text-xs text-[#64748B] font-normal leading-relaxed mb-auto">
                    Hasilkan prompt spesifik untuk AI Image Generator atau Desainer Grafis untuk materi pendaftaran sekolah dan kampus.
                  </p>
                  <Link
                    href="/tools/eduprompt"
                    className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors bg-[#FAF9F6] hover:bg-[#2563EB] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#2563EB] mt-5 shadow-sm"
                  >
                    Gunakan Tools <ArrowRight size={14} />
                  </Link>
                </div>

                {/* KARTU 6: AI PROPOSAL */}
                <div className="bg-white rounded-xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-[330px] relative overflow-hidden group">
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium tracking-tight bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      <Crown size={10} /> Enterprise
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-[#EFF6FF] text-[#2563EB] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-sm">
                    <Wand2 size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] mb-2 tracking-tight group-hover:text-[#2563EB] transition-colors">
                    AI Proposal Architect
                  </h3>
                  <p className="text-xs text-[#64748B] font-normal leading-relaxed mb-auto">
                    Sistem analisis cerdas untuk merumuskan draf proposal arsitektur IT level Enterprise secara instan dengan export Word & PDF.
                  </p>
                  <Link
                    href="/tools/ai-proposal"
                    className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#2563EB] mt-5 shadow-sm shadow-blue-500/20"
                  >
                    Buka Architect <ArrowRight size={14} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ==========================================
            KELOMPOK 2: WIDGET OBS / STREAMER
        ========================================== */}
        <div className="border-t border-[#E2E8F0] pt-14 animate-in fade-in duration-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center shrink-0">
              <MonitorPlay size={18} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#0F172A] tracking-tight">
                OBS Stream Overlays
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Aset penyiaran siap pakai untuk OBS Studio. Salin link dan gunakan sebagai Browser Source
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {obsTools.length > 0 ? (
              obsTools.map((obs) => (
                <div
                  key={obs.id}
                  className="bg-[#0A0F1D] rounded-xl p-6 border border-[#1E293B] shadow-sm flex flex-col relative overflow-hidden group h-[290px]"
                >
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-9 h-9 bg-white/10 text-[#38BDF8] rounded-md flex items-center justify-center border border-white/10 shrink-0">
                      {getCategoryIcon(obs.title, "obs")}
                    </div>
                    <h3 className="font-serif font-normal text-white text-sm tracking-tight">
                      {obs.title}
                    </h3>
                  </div>
                  <p className="text-xs font-normal text-[#94A3B8] mb-auto relative z-10 leading-relaxed line-clamp-3">
                    {obs.description}
                  </p>
                  <div className="space-y-2 relative z-10 mt-5">
                    {obs.link.startsWith("/obs/") ? (
                      <>
                        <button
                          onClick={() => handleCopyOBS(obs.link)}
                          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          {copiedLink === obs.link ? (
                            <>
                              <CheckCircle size={13} /> Tersalin!
                            </>
                          ) : (
                            <>
                              <Copy size={13} /> Salin URL Source
                            </>
                          )}
                        </button>
                        <a
                          href={obs.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-1.5 rounded-lg text-xs transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink size={12} /> Preview
                        </a>
                      </>
                    ) : (
                      <Link
                        href={obs.link}
                        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {obs.actionText || "Rakit Widget"}{" "}
                        <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* OBS 1: RUNNING TEXT */}
                <div className="bg-[#0A0F1D] rounded-xl p-6 border border-[#1E293B] shadow-sm flex flex-col relative overflow-hidden group h-[290px]">
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-9 h-9 bg-white/10 text-[#38BDF8] rounded-md flex items-center justify-center border border-white/10 shrink-0">
                      <Type size={18} />
                    </div>
                    <h3 className="font-serif font-normal text-white text-sm tracking-tight">
                      Running Text Marquee
                    </h3>
                  </div>
                  <p className="text-xs font-normal text-[#94A3B8] mb-auto relative z-10 leading-relaxed">
                    Buat teks berjalan kustom untuk siaran live streaming. Atur teks, warna, dan kecepatan rotasi secara visual.
                  </p>
                  <div className="relative z-10 mt-5">
                    <Link
                      href="/tools/marquee"
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Rakit Widget <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* OBS 2: BUKA PUASA */}
                <div className="bg-[#0A0F1D] rounded-xl p-6 border border-[#1E293B] shadow-sm flex flex-col relative overflow-hidden group h-[290px]">
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-9 h-9 bg-white/10 text-amber-400 rounded-md flex items-center justify-center border border-white/10 shrink-0">
                      <MoonStar size={18} />
                    </div>
                    <h3 className="font-serif font-normal text-white text-sm tracking-tight">
                      Countdown Buka Puasa
                    </h3>
                  </div>
                  <p className="text-xs font-normal text-[#94A3B8] mb-auto relative z-10 leading-relaxed">
                    Overlay transparan penunjuk waktu maghrib otomatis untuk penyiaran di wilayah Yogyakarta dan sekitarnya.
                  </p>
                  <div className="space-y-2 relative z-10 mt-5">
                    <button
                      onClick={() => handleCopyOBS("/obs/buka.html")}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {copiedLink === "/obs/buka.html" ? (
                        <>
                          <CheckCircle size={13} /> Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Salin URL Source
                        </>
                      )}
                    </button>
                    <a
                      href="/obs/buka.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-1.5 rounded-lg text-xs transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={12} /> Preview
                    </a>
                  </div>
                </div>

                {/* OBS 3: IMSAK */}
                <div className="bg-[#0A0F1D] rounded-xl p-6 border border-[#1E293B] shadow-sm flex flex-col relative overflow-hidden group h-[290px]">
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-9 h-9 bg-white/10 text-purple-400 rounded-md flex items-center justify-center border border-white/10 shrink-0">
                      <Sunrise size={18} />
                    </div>
                    <h3 className="font-serif font-normal text-white text-sm tracking-tight">
                      Countdown Imsak
                    </h3>
                  </div>
                  <p className="text-xs font-normal text-[#94A3B8] mb-auto relative z-10 leading-relaxed">
                    Cocok untuk streaming program sahur. Menghitung mundur waktu imsak secara real-time dan akurat.
                  </p>
                  <div className="space-y-2 relative z-10 mt-5">
                    <button
                      onClick={() => handleCopyOBS("/obs/imsak.html")}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {copiedLink === "/obs/imsak.html" ? (
                        <>
                          <CheckCircle size={13} /> Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Salin URL Source
                        </>
                      )}
                    </button>
                    <a
                      href="/obs/imsak.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-1.5 rounded-lg text-xs transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={12} /> Preview
                    </a>
                  </div>
                </div>

                {/* OBS 4: JADWAL SHOLAT */}
                <div className="bg-[#0A0F1D] rounded-xl p-6 border border-[#1E293B] shadow-sm flex flex-col relative overflow-hidden group h-[290px]">
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-9 h-9 bg-white/10 text-emerald-400 rounded-md flex items-center justify-center border border-white/10 shrink-0">
                      <CalendarClock size={18} />
                    </div>
                    <h3 className="font-serif font-normal text-white text-sm tracking-tight">
                      Jadwal Sholat 5 Waktu
                    </h3>
                  </div>
                  <p className="text-xs font-normal text-[#94A3B8] mb-auto relative z-10 leading-relaxed">
                    Tampilan tabel jadwal sholat harian yang sinkron secara otomatis via API resmi untuk kebutuhan siaran.
                  </p>
                  <div className="space-y-2 relative z-10 mt-5">
                    <button
                      onClick={() => handleCopyOBS("/obs/jadwal-sholat.html")}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {copiedLink === "/obs/jadwal-sholat.html" ? (
                        <>
                          <CheckCircle size={13} /> Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Salin URL Source
                        </>
                      )}
                    </button>
                    <a
                      href="/obs/jadwal-sholat.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-1.5 rounded-lg text-xs transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={12} /> Preview
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* INFO BOX OBS */}
          <div className="mt-8 bg-white border border-[#E2E8F0] p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs shadow-sm">
            <div className="bg-[#EFF6FF] text-[#2563EB] w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-[#BFDBFE]">
              <MonitorPlay size={18} />
            </div>
            <p className="leading-relaxed text-[#64748B]">
              <strong className="text-[#0F172A] font-medium block mb-0.5">
                Cara Pemasangan di OBS Studio:
              </strong>
              Klik tombol <strong className="text-[#2563EB]">Salin URL Source</strong>. Buka aplikasi OBS Studio, klik tombol <strong className="text-[#0F172A]">+</strong> pada panel Sources, pilih <strong className="text-[#0F172A]">Browser</strong>, lalu paste URL tersebut ke kolom URL. Centang opsi &quot;Shutdown source when not visible&quot; untuk menghemat memori.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
