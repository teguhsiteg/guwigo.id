"use client";

import Link from "next/link";
import {
  ArrowRight,
  Smartphone,
  Globe,
  Gamepad2,
  FileText,
  Wrench,
  QrCode,
  Instagram,
  Layers,
  Radio,
  Video,
  Code2,
  User, // <-- Ini yang ditambahkan
} from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 font-sans selection:bg-[#22D3EE]/30 selection:text-[#0B1120]">
      {/* 1. HERO PORTFOLIO */}
      <section className="container mx-auto px-4 sm:px-6 mb-24 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
          <Code2 size={12} className="text-[#22D3EE]" />
          The Masterpieces
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
          Building Digital <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-[#22D3EE]">
            Civilizations.
          </span>
        </h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Jejak karya teknologi Guwigo: Dari Super App Desa, Ekosistem Digital
          Kampus, hingga Manajemen Broadcast Event tingkat Enterprise.
        </p>
      </section>

      {/* 2. FEATURED PROJECT 1: DSN CONNECT */}
      <section className="container mx-auto px-4 sm:px-6 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <div className="bg-[#0B1120] rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl group border border-white/5">
          {/* Abstract Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#22D3EE]/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                Flagship Project 2026
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                DSN Connect: <br />
                <span className="text-orange-500">Sardonoharjo Super App</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed max-w-lg">
                Platform digital terintegrasi untuk mendigitalisasi birokrasi
                dan ekonomi Desa Sardonoharjo. Meliputi: Surat Digital, DSN TV
                (Streaming), Portal Berita, & Marketplace UMKM.
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                  GovTech Ecosystem
                </span>
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                  Android & Web Console
                </span>
              </div>
            </div>

            {/* Visual Mockup Sederhana (Refined) */}
            <div className="flex-1 w-full flex justify-center lg:justify-end perspective-1000">
              <div className="relative w-[240px] h-[480px] border-[10px] border-slate-800 rounded-[2.5rem] bg-slate-50 overflow-hidden shadow-2xl transform rotate-y-[-10deg] rotate-x-[5deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-all duration-700 ease-out">
                {/* Status Bar */}
                <div className="absolute top-0 w-full h-6 flex justify-center pt-2 z-20">
                  <div className="w-16 h-4 bg-slate-800 rounded-full"></div>
                </div>
                {/* App Header */}
                <div className="bg-gradient-to-b from-orange-500 to-orange-600 h-40 w-full relative">
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"></div>
                </div>
                {/* App Body */}
                <div className="p-4 grid grid-cols-2 gap-3 mt-4">
                  <div className="h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <FileText
                      size={20}
                      className="text-orange-400 opacity-50"
                    />
                  </div>
                  <div className="h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <Video size={20} className="text-orange-400 opacity-50" />
                  </div>
                  <div className="h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <Layers size={20} className="text-orange-400 opacity-50" />
                  </div>
                  <div className="h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <Globe size={20} className="text-orange-400 opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROJECT 2: EDUPASS ECOSYSTEM */}
      <section className="container mx-auto px-4 sm:px-6 mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-[#0B1120] rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5">
          {/* Grid Pattern Background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE]/30 text-[#22D3EE] text-[10px] font-black uppercase tracking-widest">
                <Layers size={12} /> Massive Ecosystem
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                EduPass FMIPA UII <br />
                <span className="text-blue-200">Integrated Campus System</span>
              </h2>
              <p className="text-blue-100/80 text-base leading-relaxed max-w-lg">
                Bukan sekadar satu aplikasi, melainkan arsitektur{" "}
                <strong className="text-white">10+ Modul Terintegrasi</strong>{" "}
                yang mengotomatisasi seluruh aktivitas akademik dan operasional
                fakultas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs font-bold text-blue-100 pt-4">
                <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <Globe size={14} className="text-[#22D3EE]" /> Sistem KTM
                  Online
                </div>
                <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <Layers size={14} className="text-[#22D3EE]" /> MIPA Stock
                  (Inventory)
                </div>
                <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <FileText size={14} className="text-[#22D3EE]" /> Verifikasi
                  Dispensasi
                </div>
                <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <User size={14} className="text-[#22D3EE]" /> Presensi Kerja
                  Staff
                </div>
              </div>
            </div>

            <div className="flex-1 w-full bg-white/5 rounded-[2rem] p-8 backdrop-blur-md border border-white/10 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>

              {/* Abstract Dashboard UI */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="w-24 h-4 bg-white/20 rounded-full"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10"></div>
                  <div className="w-8 h-8 rounded-full bg-white/10"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 opacity-70">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-[#22D3EE]/20 transition-colors duration-300"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-xl"></div>
                  </div>
                ))}
              </div>
              <div className="mt-6 h-24 w-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-2xl border border-white/10"></div>

              <p className="text-center text-[10px] font-black uppercase tracking-widest mt-6 text-[#22D3EE]">
                System Dashboard Architecture Preview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VENTURES & SERVICES (Grid) */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[#22D3EE] font-bold tracking-widest text-xs uppercase mb-4 block">
            Expanding The Horizon
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Ventures & Expertise
          </h2>
          <p className="text-slate-500 font-medium">
            Portofolio keahlian spesifik dan unit bisnis ekosistem Guwigo
            lainnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. RENTARA */}
          <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-[#22D3EE]/10 hover:border-[#22D3EE]/30 hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:bg-[#22D3EE] group-hover:text-[#0B1120] transition-colors">
              <Gamepad2 size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Rentara App
            </h3>
            <p className="text-[10px] font-black text-blue-600 mb-4 uppercase tracking-widest">
              Console Marketplace
            </p>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Pusat rental konsol #1. Arsitektur platform yang menghubungkan
              juragan rental PS5/Switch secara langsung dengan ekosistem gamers.
            </p>
          </div>

          {/* 2. GUWIGO TASBIH */}
          <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-300 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-6 right-6 bg-green-100 text-green-700 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
              BETA PHASE
            </div>
            <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:bg-green-500 transition-colors">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Guwigo Tasbih
            </h3>
            <p className="text-[10px] font-black text-green-600 mb-4 uppercase tracking-widest">
              Mobile Application
            </p>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
              Aplikasi Tasbih Digital dengan UI/UX modern. Saat ini sedang dalam
              masa pengujian (Beta Testing) di ekosistem Play Store.
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=id.guwigo.tasbih"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-green-600 transition-colors"
            >
              View on Play Store <ArrowRight size={14} />
            </a>
          </div>

          {/* 3. MULTIMEDIA & BROADCAST */}
          <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-300 hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:bg-red-500 transition-colors">
              <Video size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Broadcast System
            </h3>
            <p className="text-[10px] font-black text-red-600 mb-4 uppercase tracking-widest">
              Live Stream Engineering
            </p>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
              Infrastruktur Operator Resmi untuk Webinar & Event Enterprise
              Kampus (UII). Menangani arsitektur Zoom, OBS VMIX, dan
              Multi-Platform Streaming.
            </p>
            <ul className="space-y-2 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                <Radio size={14} className="text-red-400" /> Webinar Pojok
                Statistik
              </li>
              <li className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                <Radio size={14} className="text-red-400" /> Webinar Kajian
                Islam
              </li>
            </ul>
          </div>

          {/* 4. GUWIGO SERVICE */}
          <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-500/10 hover:border-slate-400 hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 bg-slate-700 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:bg-slate-600 transition-colors">
              <Wrench size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Hardware Clinic
            </h3>
            <p className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">
              Guwigo Service
            </p>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Divisi teknis perbaikan Hardware (Smartphone & Laptop) yang
              menerapkan standar kerja profesional dan komponen presisi tinggi.
            </p>
          </div>

          {/* 5. OTHER WEB APPS */}
          <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-300 hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:bg-purple-500 transition-colors">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Micro Web Apps
            </h3>
            <p className="text-[10px] font-black text-purple-600 mb-4 uppercase tracking-widest">
              Various Utility Projects
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 p-2 bg-slate-50 rounded-xl">
                <QrCode size={16} className="text-purple-500" /> Himasteg QR
                System
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 p-2 bg-slate-50 rounded-xl">
                <FileText size={16} className="text-purple-500" /> Enthusiastic
                Journal
              </li>
            </ul>
          </div>

          {/* 6. SOCIAL MEDIA */}
          <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-pink-500/10 hover:border-pink-300 hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Instagram size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Creative Content
            </h3>
            <p className="text-[10px] font-black text-pink-600 mb-4 uppercase tracking-widest">
              Social Media Mgmt
            </p>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Manajemen arsitektur konten Instagram korporat @ikauii.diy dan
              *post-production* (editing video) profesional untuk ekosistem
              Podcast kampus.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
