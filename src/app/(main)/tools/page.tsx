"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  MonitorPlay,
  Copy,
  CheckCircle,
  ArrowRight,
  Sparkles,
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
  Users,
  Wand2,
  Crown,
} from "lucide-react";

export default function ToolsHubPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleCopyOBS = (path: string) => {
    const fullUrl = `${baseUrl}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(path);
    setTimeout(() => setCopiedLink(null), 2000);
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
            <Sparkles size={12} /> Guwigo Utilities & SaaS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Tingkatkan Produktivitas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-blue-500">
              Tanpa Batas.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Kumpulan alat pengembangan, optimasi pemasaran, dan aset penyiaran
            yang dirancang khusus untuk ekosistem digital Anda.{" "}
            <strong className="text-white">
              Akses gratis tanpa login & Uji coba SaaS eksklusif.
            </strong>
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-10 relative z-20">
        {/* ==========================================
            KELOMPOK 1: WEB TOOLS UTAMA
        ========================================== */}
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
          <h2 className="text-xl font-black text-[#0B1324] mb-8 flex items-center gap-3 uppercase tracking-widest">
            <LayoutGrid size={24} className="text-[#00D4FF]" /> Web & Marketing
            Utilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* KARTU 1: QR CODE */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-[#00D4FF]/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-[340px] group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00D4FF] group-hover:text-[#0B1324] transition-colors">
                <QrCode size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-[#00D4FF] transition-colors">
                QR Code Generator
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-auto">
                Ubah Teks, URL, atau Nomor WhatsApp menjadi QR Code resolusi
                tinggi secara real-time. Bebas masa kedaluwarsa.
              </p>
              <Link
                href="/tools/qrcode"
                className="w-full bg-slate-100 group-hover:bg-[#0B1324] text-[#0B1324] group-hover:text-[#00D4FF] py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-slate-900/20 mt-6"
              >
                Buka Console <ArrowRight size={16} />
              </Link>
            </div>

            {/* KARTU 2: PASSWORD */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-[#00D4FF]/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-[340px] group">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00D4FF] group-hover:text-[#0B1324] transition-colors">
                <KeyRound size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-[#00D4FF] transition-colors">
                Password Generator
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-auto">
                Rakit kata sandi & token acak tingkat militer yang sangat kuat.
                Seluruh kriptografi diproses aman secara offline di browser
                Anda.
              </p>
              <Link
                href="/tools/password"
                className="w-full bg-slate-100 group-hover:bg-[#0B1324] text-[#0B1324] group-hover:text-[#00D4FF] py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-slate-900/20 mt-6"
              >
                Buka Console <ArrowRight size={16} />
              </Link>
            </div>

            {/* KARTU 3: WA LINK GENERATOR */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-[#00D4FF]/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-[340px] group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00D4FF] group-hover:text-[#0B1324] transition-colors">
                <MessageCircle size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-[#00D4FF] transition-colors">
                WA Link Builder
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-auto">
                Rakit tautan WhatsApp dinamis dengan pesan otomatis. Dilengkapi
                fitur live chat preview yang sangat memanjakan mata.
              </p>
              <Link
                href="/tools/wa-generator"
                className="w-full bg-slate-100 group-hover:bg-[#0B1324] text-[#0B1324] group-hover:text-[#00D4FF] py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-slate-900/20 mt-6"
              >
                Buka Console <ArrowRight size={16} />
              </Link>
            </div>

            {/* KARTU 4: SEO PREVIEWER */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-[#00D4FF]/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-[340px] group">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00D4FF] group-hover:text-[#0B1324] transition-colors">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-[#00D4FF] transition-colors">
                SEO & Social Preview
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-auto">
                Simulasikan metadata website Anda di Google, FB, Twitter, dan WA
                secara real-time. Otomatis generate kode HTML Open Graph.
              </p>
              <Link
                href="/tools/seo-preview"
                className="w-full bg-slate-100 group-hover:bg-[#0B1324] text-[#0B1324] group-hover:text-[#00D4FF] py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-slate-900/20 mt-6"
              >
                Buka Console <ArrowRight size={16} />
              </Link>
            </div>

            {/* KARTU 5: EDUPROMPT (FEATURED & POPULAR) */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-[2.5rem] p-8 border-2 border-amber-200 shadow-lg shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2 transition-all duration-300 flex flex-col h-[340px] relative overflow-hidden group">
              {/* Featured Badge */}
              <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-bl-xl shadow-md flex items-center gap-1.5">
                <Sparkles size={12} className="fill-amber-950" /> Most Popular
              </div>

              <div className="w-14 h-14 bg-amber-500 text-amber-950 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-black text-amber-900 mb-3 tracking-tight">
                EduPrompt AI Generator
              </h3>
              <p className="text-amber-700/80 text-sm font-medium leading-relaxed mb-auto">
                Hasilkan instruksi desain (prompt) pendidikan super spesifik
                untuk ChatGPT, Midjourney, atau Desainer Grafis hanya dalam
                hitungan detik.
              </p>

              {/* Statistic Text */}
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 mb-4 bg-amber-100 w-fit px-3 py-1 rounded-lg">
                <Users size={14} /> +12,400 Prompts Generated
              </div>

              <Link
                href="/tools/eduprompt"
                className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl hover:shadow-amber-500/40"
              >
                Gunakan Tools <ArrowRight size={16} />
              </Link>
            </div>

            {/* KARTU 6: AI PROPOSAL ARCHITECT (PREMIUM SAAS) */}
            <div className="bg-gradient-to-br from-[#0B1324] to-slate-900 rounded-[2.5rem] p-8 border-2 border-[#00D4FF]/30 shadow-lg shadow-[#00D4FF]/10 hover:shadow-2xl hover:shadow-[#00D4FF]/30 hover:-translate-y-2 transition-all duration-300 flex flex-col h-[340px] relative overflow-hidden group">
              {/* Premium Trial Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#00D4FF] to-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-bl-xl shadow-md flex items-center gap-1.5">
                <Crown size={12} className="fill-white" /> 3-Day Trial
              </div>

              <div className="w-14 h-14 bg-white/5 text-[#00D4FF] rounded-2xl flex items-center justify-center mb-6 shadow-md border border-white/10 group-hover:scale-110 transition-transform">
                <Wand2 size={28} />
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">
                AI Proposal Architect
              </h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-auto">
                Sistem analisis cerdas untuk merumuskan draf proposal arsitektur
                IT level Enterprise dalam hitungan detik. Export ke PDF & DOCX.
              </p>

              {/* Pricing Text */}
              <div className="flex items-center gap-2 text-xs font-bold text-[#00D4FF] mb-4 bg-[#00D4FF]/10 border border-[#00D4FF]/20 w-fit px-3 py-1 rounded-lg">
                Pro SaaS Feature
              </div>

              <Link
                href="/tools/ai-proposal"
                className="w-full bg-[#00D4FF] hover:bg-white text-[#0B1324] py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:shadow-[#00D4FF]/40"
              >
                Mulai Trial <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* ==========================================
            KELOMPOK 2: WIDGET OBS / STREAMER
        ========================================== */}
        <div className="border-t border-slate-200 pt-16 animate-in fade-in duration-1000 delay-300">
          <h2 className="text-xl font-black text-[#0B1324] mb-4 flex items-center gap-3 uppercase tracking-widest">
            <MonitorPlay size={24} className="text-red-500" /> OBS Stream Assets
          </h2>
          <p className="text-slate-500 font-medium mb-10 max-w-2xl leading-relaxed">
            Aset gratis untuk mempercantik tata letak Live Streaming Anda di OBS
            Studio. Salin link dan jadikan sebagai{" "}
            <strong>Browser Source</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* OBS 1: RUNNING TEXT */}
            <div className="bg-[#0B1324] rounded-[2rem] p-8 border border-slate-800 shadow-xl flex flex-col relative overflow-hidden group h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-white/5 text-blue-400 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                  <Type size={20} />
                </div>
                <h3 className="font-black text-white text-sm leading-tight tracking-tight uppercase">
                  Running Text <br /> Marquee
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-400 mb-auto relative z-10 leading-relaxed">
                Buat teks berjalan kustom. Atur teks, warna teks, dan kecepatan
                lari sendiri.
              </p>
              <div className="relative z-10 mt-6">
                <Link
                  href="/tools/marquee"
                  className="w-full bg-[#00D4FF] hover:bg-white text-[#0B1324] font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#00D4FF]/20"
                >
                  Rakit Widget <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* OBS 2: BUKA PUASA */}
            <div className="bg-[#0B1324] rounded-[2rem] p-8 border border-slate-800 shadow-xl flex flex-col relative overflow-hidden group h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-white/5 text-yellow-400 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                  <MoonStar size={20} />
                </div>
                <h3 className="font-black text-white text-sm leading-tight tracking-tight uppercase">
                  Countdown <br /> Buka Puasa
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-400 mb-auto relative z-10 leading-relaxed">
                Overlay transparan penunjuk waktu maghrib otomatis untuk area
                Yogyakarta.
              </p>
              <div className="space-y-2 relative z-10 mt-6">
                <button
                  onClick={() => handleCopyOBS("/obs/buka.html")}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-[#0B1324] font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                  {copiedLink === "/obs/buka.html" ? (
                    <>
                      <CheckCircle size={14} /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Source URL
                    </>
                  )}
                </button>
                <a
                  href="/obs/buka.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-colors border border-white/5 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={12} /> Preview
                </a>
              </div>
            </div>

            {/* OBS 3: IMSAK */}
            <div className="bg-[#0B1324] rounded-[2rem] p-8 border border-slate-800 shadow-xl flex flex-col relative overflow-hidden group h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-white/5 text-purple-400 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                  <Sunrise size={20} />
                </div>
                <h3 className="font-black text-white text-sm leading-tight tracking-tight uppercase">
                  Countdown <br /> Imsak
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-400 mb-auto relative z-10 leading-relaxed">
                Sangat cocok untuk streaming edisi sahur. Hitung mundur imsak
                berjalan otomatis.
              </p>
              <div className="space-y-2 relative z-10 mt-6">
                <button
                  onClick={() => handleCopyOBS("/obs/imsak.html")}
                  className="w-full bg-purple-500 hover:bg-purple-400 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  {copiedLink === "/obs/imsak.html" ? (
                    <>
                      <CheckCircle size={14} /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Source URL
                    </>
                  )}
                </button>
                <a
                  href="/obs/imsak.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-colors border border-white/5 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={12} /> Preview
                </a>
              </div>
            </div>

            {/* OBS 4: JADWAL SHOLAT */}
            <div className="bg-[#0B1324] rounded-[2rem] p-8 border border-slate-800 shadow-xl flex flex-col relative overflow-hidden group h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-white/5 text-emerald-400 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                  <CalendarClock size={20} />
                </div>
                <h3 className="font-black text-white text-sm leading-tight tracking-tight uppercase">
                  Schedule <br /> 5 Waktu
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-400 mb-auto relative z-10 leading-relaxed">
                Tampilkan tabel jadwal sholat hari ini. Data sinkron otomatis
                via API Aladhan.
              </p>
              <div className="space-y-2 relative z-10 mt-6">
                <button
                  onClick={() => handleCopyOBS("/obs/jadwal-sholat.html")}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0B1324] font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {copiedLink === "/obs/jadwal-sholat.html" ? (
                    <>
                      <CheckCircle size={14} /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Source URL
                    </>
                  )}
                </button>
                <a
                  href="/obs/jadwal-sholat.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-colors border border-white/5 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={12} /> Preview
                </a>
              </div>
            </div>
          </div>

          {/* INFO BOX OBS */}
          <div className="mt-10 bg-white border border-slate-200 text-slate-600 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center gap-6 text-sm shadow-sm max-w-4xl mx-auto">
            <div className="bg-[#00D4FF]/10 text-[#00D4FF] w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-[#00D4FF]/20">
              <MonitorPlay size={20} />
            </div>
            <p className="leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-1">
                Cara Pemasangan di OBS Studio:
              </strong>
              Klik tombol{" "}
              <em className="text-[#00D4FF] font-bold not-italic">
                "Copy Source URL"
              </em>
              . Buka aplikasi OBS, klik logo
              <strong className="text-slate-900"> + </strong> pada menu Sources,
              lalu pilih
              <strong className="text-slate-900"> Browser</strong>. Paste URL
              tersebut ke kolom yang tersedia, sesuaikan Width & Height, dan
              centang opsi{" "}
              <strong className="text-slate-900">"Clear Background"</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
