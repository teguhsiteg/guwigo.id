"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowRight,
  Globe,
  Layers,
  Smartphone,
  Cpu,
  ShieldCheck,
  Zap,
  ChevronDown,
  Code2,
} from "lucide-react";

// Tipe data harus sama dengan yang di Admin
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

export default function Home() {
  // STATE DEFAULT: Diselaraskan dengan Konsep Desain Terbaru
  const [branding, setBranding] = useState<HeroBranding>({
    siteName: "PT Guwigo Teknologi Indonesia",
    tagline: "Building Smarter Digital Future",
    description: "Ekosistem teknologi terdepan dari Yogyakarta untuk Indonesia",
    heroTitle: "Building\nConnected\nSolutions\nfor the Future",
    heroSubtitle:
      "Guwigo Teknologi Indonesia menghadirkan solusi digital terintegrasi untuk membantu bisnis bertumbuh dan siap menghadapi masa depan.",
    ctaText: "Jelajahi Solusi",
    ctaLink: "/services",
    theme: "dark",
    primaryColor: "#0B1324", // Midnight Navy
    accentColor: "#00D4FF", // Electric Cyan
    logoUrl: "/images/branding/loader.png", // Menggunakan file PNG lokal
  });

  // SEDOT DATA DARI FIREBASE
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const docRef = doc(db, "admin", "hero-branding");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBranding(docSnap.data() as HeroBranding);
        }
      } catch (error) {
        console.error("Gagal mengambil data Hero Branding:", error);
      }
    };

    fetchBranding();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen relative z-10 font-sans selection:bg-[#00D4FF]/30 selection:text-white">
      {/* ==========================================
          1. HERO SECTION (DARK ENTERPRISE THEME)
      ========================================== */}
      <section className="relative w-full bg-[#0B1324] pt-40 pb-32 overflow-hidden flex items-center min-h-[90vh]">
        {/* Background Visual Effects (Glowing Horizon) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
          {/* Bottom Horizon Glow */}
          <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[120%] md:w-[800px] h-[300px] bg-[#00D4FF]/20 rounded-[100%] blur-[80px]"></div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent shadow-[0_0_20px_rgba(0,212,255,0.8)]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Kiri: Tipografi & CTA */}
            <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
                Building <br />
                Connected <br />
                <span className="text-[#00D4FF]">Solutions</span> <br />
                for the Future
              </h1>
              <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-lg mb-10">
                {branding.heroSubtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={branding.ctaLink}
                  className="bg-[#00D4FF] text-[#0B1324] px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-white hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  {branding.ctaText} <ArrowRight size={16} />
                </Link>
                <Link
                  href="/about"
                  className="bg-transparent border border-slate-600 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:border-white hover:bg-white/5 transition-colors duration-300"
                >
                  Tentang Kami
                </Link>
              </div>
            </div>

            {/* Kanan: Logo Melayang (Menggunakan framer-motion) */}
            <div className="flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-72 h-72 md:w-[450px] md:h-[450px] drop-shadow-[0_0_40px_rgba(0,212,255,0.25)]"
              >
                <Image
                  src={branding.logoUrl}
                  alt="Guwigo Final Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. TRUSTED BY 
      ========================================== */}
      <section className="bg-white py-12 mb-24 overflow-hidden border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-black text-slate-800 tracking-tight">
              UII YOGYAKARTA
            </span>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              DESIGN MANUFACTURING
            </span>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              DESA SARDONOHARJO
            </span>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              IKA UII DIY
            </span>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              LANDKARTE TOYS
            </span>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. CORE PILLARS 
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 mb-32 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 group">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0B1324] mb-4 group-hover:bg-[#00D4FF] group-hover:text-[#0B1324] transition-colors duration-300">
              <Cpu size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Engineering First
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Kami menulis kode yang bersih, scalable, dan aman. Menggunakan
              teknologi modern untuk performa maksimal tingkat korporat.
            </p>
          </div>
          <div className="space-y-4 group">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0B1324] mb-4 group-hover:bg-[#00D4FF] group-hover:text-[#0B1324] transition-colors duration-300">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Enterprise Grade
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Standar keamanan dan reliabilitas tinggi. Sistem kami dirancang
              untuk menangani ribuan pengguna secara serentak tanpa kendala.
            </p>
          </div>
          <div className="space-y-4 group">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0B1324] mb-4 group-hover:bg-[#F4B942] group-hover:text-white transition-colors duration-300">
              <Zap size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Creative Fusion
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Teknologi bukan hanya soal fungsi, tapi juga rasa. Kami
              menggabungkan UI/UX kelas dunia dengan fungsionalitas backend yang
              kokoh.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. ECOSYSTEM BENTO GRID 
      ========================================== */}
      <section className="bg-[#0B1324] py-32 rounded-t-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#00D4FF]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <span className="text-[#00D4FF] font-bold tracking-widest text-xs uppercase mb-4 block">
                The Guwigo Ecosystem
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                Our Masterpieces
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="hidden md:flex text-white font-bold items-center gap-2 border-b border-white/30 pb-1 hover:text-[#00D4FF] hover:border-[#00D4FF] transition-all"
            >
              View All Projects <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[700px]">
            {/* DSN CONNECT */}
            <div className="md:col-span-2 md:row-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group hover:border-[#00D4FF]/50 transition-all duration-500">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-[#00D4FF] rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(0,212,255,0.4)] group-hover:scale-110 transition-transform">
                    <Globe className="text-[#0B1324]" size={28} />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-4 tracking-tight">
                    DSN Connect
                  </h3>
                  <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                    Platform Smart Village terintegrasi untuk Desa Sardonoharjo.
                    Sistem Persuratan Digital, Live Streaming TV, & Marketplace
                    Lokal.
                  </p>
                </div>
                <div className="mt-10">
                  <span className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest group-hover:bg-[#00D4FF] group-hover:text-[#0B1324] group-hover:border-[#00D4FF] transition-all">
                    Flagship Project
                  </span>
                </div>
              </div>
            </div>

            {/* EDUPASS */}
            <div className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-blue-900 to-[#0B1324] border border-blue-800/50 rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <Layers
                className="text-blue-500/20 absolute -bottom-4 -right-4 group-hover:scale-110 transition-transform duration-500"
                size={120}
              />
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  EduPass System
                </h3>
                <p className="text-[#00D4FF] text-sm mt-2 font-medium">
                  10+ Modul Terintegrasi FMIPA UII.
                </p>
              </div>
            </div>

            {/* RENTARA */}
            <div className="md:col-span-1 md:row-span-1 bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-[#F4B942]/50 transition-all">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center group-hover:bg-[#F4B942] group-hover:text-[#0B1324] transition-colors">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Rentara App
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium">
                    Console Rental Marketplace.
                  </p>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="md:col-span-2 md:row-span-1 bg-[#00D4FF] text-[#0B1324] rounded-[2.5rem] p-8 flex items-center justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-6xl font-black mb-1 tracking-tighter">
                  10+
                </h3>
                <p className="font-bold uppercase tracking-[0.2em] text-xs opacity-80">
                  Years Experience
                </p>
              </div>
              <div className="text-right relative z-10">
                <h3 className="text-6xl font-black mb-1 tracking-tighter">
                  100%
                </h3>
                <p className="font-bold uppercase tracking-[0.2em] text-xs opacity-80">
                  Bootstrap Growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. STORE & SERVICE 
      ========================================== */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-[#00D4FF] font-bold tracking-widest text-xs uppercase mb-4 block">
                Beyond Software
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                Retail & Services
              </h2>
            </div>
            <Link
              href="/store"
              className="text-slate-900 font-bold items-center gap-2 border-b-2 border-slate-900 pb-1 hover:text-[#00D4FF] hover:border-[#00D4FF] transition-all hidden md:flex"
            >
              Visit Guwigo Store <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-[#00D4FF]/10 border border-slate-100 transition-all duration-300 group flex flex-col">
              <div className="h-48 bg-slate-200 rounded-2xl mb-8 flex items-center justify-center overflow-hidden">
                <div className="w-24 h-32 border-4 border-slate-300 rounded-xl bg-white group-hover:scale-110 transition-transform duration-500"></div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                Hardware Service
              </h3>
              <p className="text-slate-500 font-medium text-sm mb-8 flex-1 leading-relaxed">
                Perbaikan tingkat lanjut untuk Smartphone & Laptop. Ditangani
                menggunakan alat presisi tinggi dan teknisi bersertifikasi.
              </p>
              <Link
                href="/contact"
                className="text-[#0B1324] font-bold text-xs uppercase tracking-widest hover:text-[#00D4FF] transition-colors mt-auto flex items-center gap-2"
              >
                Book Service <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-[#00D4FF]/10 border border-slate-100 transition-all duration-300 group flex flex-col">
              <div className="h-48 bg-blue-100 rounded-2xl mb-8 flex items-center justify-center overflow-hidden">
                <div className="w-32 h-20 border-4 border-blue-200 rounded-xl bg-white group-hover:rotate-6 transition-transform duration-500"></div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                Premium Gadgets
              </h3>
              <p className="text-slate-500 font-medium text-sm mb-8 flex-1 leading-relaxed">
                Jual beli perangkat iOS & Android berkualitas istimewa. Melewati
                Quality Control ketat dengan garansi purnajual terpercaya.
              </p>
              <Link
                href="/store"
                className="text-[#0B1324] font-bold text-xs uppercase tracking-widest hover:text-[#00D4FF] transition-colors mt-auto flex items-center gap-2"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-[#00D4FF]/10 border border-slate-100 transition-all duration-300 group flex flex-col">
              <div className="h-48 bg-[#0B1324] rounded-2xl mb-8 flex items-center justify-center overflow-hidden">
                <div className="w-24 h-24 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                Creative Apparel
              </h3>
              <p className="text-slate-500 font-medium text-sm mb-8 flex-1 leading-relaxed">
                Merchandise eksklusif identitas Guwigo. Pakaian premium dan
                aksesoris yang dirancang khusus untuk komunitas tech &
                developer.
              </p>
              <Link
                href="/store?cat=apparel"
                className="text-[#0B1324] font-bold text-xs uppercase tracking-widest hover:text-[#00D4FF] transition-colors mt-auto flex items-center gap-2"
              >
                View Collection <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FAQ 
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 py-32 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 text-center tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="border border-slate-200 bg-white rounded-3xl p-6 md:p-8 hover:border-[#00D4FF]/50 transition-colors cursor-pointer group shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-lg">
                Apakah Guwigo menerima proyek skala kecil atau UMKM?
              </h4>
              <ChevronDown className="text-slate-400 group-hover:text-[#00D4FF] transition-colors shrink-0" />
            </div>
            <p className="text-slate-500 font-medium leading-relaxed mt-4 hidden group-hover:block animate-in slide-in-from-top-2">
              Tentu. Meskipun kami telah berevolusi menjadi perusahaan berskala
              enterprise, kami lahir dari semangat memajukan UMKM lokal. Kami
              merancang arsitektur paket khusus untuk website profil bisnis dan
              sistem digitalisasi mendasar yang ramah biaya.
            </p>
          </div>
          <div className="border border-slate-200 bg-white rounded-3xl p-6 md:p-8 hover:border-[#00D4FF]/50 transition-colors cursor-pointer group shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-lg">
                Berapa estimasi waktu proses pengembangan aplikasi custom?
              </h4>
              <ChevronDown className="text-slate-400 group-hover:text-[#00D4FF] transition-colors shrink-0" />
            </div>
            <p className="text-slate-500 font-medium leading-relaxed mt-4 hidden group-hover:block animate-in slide-in-from-top-2">
              Waktu pengerjaan sangat bergantung pada tingkat kompleksitas
              fitur. Untuk Website Company Profile umumnya membutuhkan 1 hingga
              2 minggu. Sedangkan untuk Sistem Enterprise, SaaS, atau aplikasi
              ERP kompleks bisa memakan waktu 3 hingga 6 bulan pengembangan
              intensif.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. CTA (DARK PREMIUM)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 pb-24 max-w-6xl">
        <div className="bg-[#0B1324] rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl border border-white/5">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">
              Ready to Scale?
            </h2>
            <p className="text-slate-400 font-medium text-lg md:text-xl mb-12 leading-relaxed">
              Jangan biarkan visi arsitektur digital Anda hanya menjadi sebatas
              wacana. Diskusikan dan wujudkan bersama tim engineer kami hari
              ini.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-[#00D4FF] text-[#0B1324] px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.3)]"
            >
              Start Your Project <ArrowRight size={18} />
            </Link>
          </div>

          {/* Abstract Glowing Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-[100px] -ml-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mb-20 pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
