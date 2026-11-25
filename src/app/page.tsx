"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, limit, query, where } from "firebase/firestore";
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
  ExternalLink,
  ShoppingBag,
  Star,
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

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  link?: string;
  featured?: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  image?: string;
  price?: number;
}

interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
}

export default function Home() {
  const [branding, setBranding] = useState<HeroBranding>({
    siteName: "PT Guwigo Teknologi Indonesia",
    tagline: "Ekosistem Solusi Digital Terintegrasi",
    description: "Arsitek perangkat lunak dan ekosistem digital skala enterprise dari Yogyakarta.",
    heroTitle: "Building Connected Solutions\nfor the Future.",
    heroSubtitle:
      "Guwigo Teknologi Indonesia merancang arsitektur perangkat lunak terintegrasi untuk membantu bisnis bertumbuh dengan integritas, ketahanan, dan skalabilitas tinggi.",
    ctaText: "Jelajahi Solusi",
    ctaLink: "/services",
    theme: "light",
    primaryColor: "#2563EB",
    accentColor: "#06B6D4",
    logoUrl: "/images/branding/loader.png",
  });

  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch Branding
        const docRef = doc(db, "admin", "hero-branding");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBranding(docSnap.data() as HeroBranding);
        }

        // 2. Fetch Portfolios
        const portSnap = await getDocs(collection(db, "portfolio"));
        const portData: PortfolioItem[] = [];
        portSnap.forEach((d) => {
          portData.push({ id: d.id, ...d.data() } as PortfolioItem);
        });
        setPortfolios(portData);

        // 3. Fetch Products
        const prodSnap = await getDocs(collection(db, "products"));
        const prodData: ProductItem[] = [];
        prodSnap.forEach((d) => {
          prodData.push({ id: d.id, ...d.data() } as ProductItem);
        });
        setProducts(prodData);
      } catch (error) {
        console.error("Gagal mengambil data Landing Page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const featuredPortfolios = portfolios.filter((p) => p.featured);
  const displayPortfolios = featuredPortfolios.length > 0 ? featuredPortfolios.slice(0, 4) : portfolios.slice(0, 4);

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative z-10 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A]">
      {/* ==========================================
          1. HERO SECTION (EDITORIAL + GUWIGO ID)
      ========================================== */}
      <section className="relative w-full pt-36 md:pt-44 pb-20 md:pb-28 overflow-hidden border-b border-[#E2E8F0]">
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] md:w-[1000px] h-[350px] bg-[#2563EB]/[0.05] rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#06B6D4]/[0.04] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Kiri: Tipografi Editorial & Tindakan */}
            <div className="lg:col-span-7 text-left animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-medium tracking-tight mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]"></span>
                <span>{branding.tagline || "PT Guwigo Teknologi Indonesia"}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#0F172A] font-normal tracking-tight leading-[1.12] mb-6">
                Building Connected Solutions <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#2563EB]">for the Future.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] font-normal leading-relaxed max-w-xl mb-10">
                {branding.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  href={branding.ctaLink || "/services"}
                  className="bg-[#2563EB] text-white px-6 py-3.5 rounded-md font-medium text-sm hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150 flex items-center gap-2 shadow-sm shadow-blue-500/20"
                >
                  {branding.ctaText || "Jelajahi Solusi"} <ArrowRight size={15} />
                </Link>
                <Link
                  href="/about"
                  className="bg-white border border-[#E2E8F0] text-[#0F172A] px-6 py-3.5 rounded-md font-medium text-sm hover:bg-[#F1F5F9] hover:border-[#CBD5E1] active:scale-[0.98] transition-all duration-150 shadow-sm"
                >
                  Tentang Perusahaan
                </Link>
              </div>

              {/* Subdued Trust Badges */}
              <div className="mt-12 pt-8 border-t border-[#E2E8F0] flex flex-wrap items-center gap-6 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#2563EB]" />
                  <span>ISO-ready Standards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-[#2563EB]" />
                  <span>Modular Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-[#06B6D4]" />
                  <span>Sleman, D.I. Yogyakarta</span>
                </div>
              </div>
            </div>

            {/* Kanan: Editorial Showcase Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
              <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-lg p-7 md:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] relative">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center p-1.5">
                      <Image
                        src={branding.logoUrl || "/images/branding/loader.png"}
                        alt="Guwigo Monogram"
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-[#0F172A] font-normal">Guwigo Studio</h3>
                      <p className="text-xs text-[#64748B]">Enterprise Software House</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-[11px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Active
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 rounded-md bg-[#FAF9F6] border border-[#E2E8F0]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Rekayasa Perangkat Lunak</span>
                      <span className="text-xs font-semibold text-[#2563EB]">10+ Tahun</span>
                    </div>
                    <p className="text-xs text-[#0F172A] font-medium">
                      Web, Cloud Infrastructure & Smart Village System
                    </p>
                  </div>

                  <div className="p-4 rounded-md bg-[#FAF9F6] border border-[#E2E8F0]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Ekosistem Terintegrasi</span>
                      <span className="text-xs font-semibold text-[#06B6D4]">Ready</span>
                    </div>
                    <p className="text-xs text-[#0F172A] font-medium">
                      TeGe Omni CRM, POS & SaaS Enterprise Suite
                    </p>
                  </div>

                  <div className="p-4 rounded-md bg-[#FAF9F6] border border-[#E2E8F0]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Jejak Wilayah</span>
                      <span className="text-xs font-semibold text-[#2563EB]">Nasional</span>
                    </div>
                    <p className="text-xs text-[#0F172A] font-medium">
                      Melayani instansi pendidikan, UMKM, hingga entitas korporat
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                  <span>Yogyakarta Rooted</span>
                  <Link href="/about" className="text-[#2563EB] hover:text-[#1D4ED8] font-medium flex items-center gap-1">
                    Pelajari Jejak Kami <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. TRUSTED BY 
      ========================================== */}
      <section className="bg-[#FAF9F6] py-12 border-b border-[#E2E8F0] overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#94A3B8] mb-6">
            Dipercaya oleh institusi, lembaga, dan mitra bisnis terkemuka
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-75 hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm md:text-base font-serif font-normal text-[#0F172A] tracking-wide">
              FMIPA UII YOGYAKARTA
            </span>
            <span className="text-sm md:text-base font-serif font-normal text-[#0F172A] tracking-wide">
              DESIGN MANUFACTURING
            </span>
            <span className="text-sm md:text-base font-serif font-normal text-[#0F172A] tracking-wide">
              DESA SARDONOHARJO
            </span>
            <span className="text-sm md:text-base font-serif font-normal text-[#0F172A] tracking-wide">
              IKA UII DIY
            </span>
            <span className="text-sm md:text-base font-serif font-normal text-[#0F172A] tracking-wide">
              LANDKARTE TOYS
            </span>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. CORE PILLARS 
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 py-24 md:py-32 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#2563EB] mb-3 block">
            Prinsip Arsitektur
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#0F172A] font-normal tracking-tight">
            Fondasi Rekayasa yang Teruji
          </h2>
          <p className="text-[#64748B] text-base mt-3 leading-relaxed">
            Kombinasi ketelitian kode, kehandalan infrastruktur, dan kehangatan pengalaman pengguna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 hover:border-[#93C5FD] hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 bg-[#EFF6FF] rounded-md flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-serif text-[#0F172A] font-normal mb-3">
              Engineering First
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed font-normal">
              Kami menulis kode yang bersih, scalable, dan terdokumentasi rapi. Menghindari hutang teknis demi performa maksimal jangka panjang.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 hover:border-[#93C5FD] hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 bg-[#EFF6FF] rounded-md flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-serif text-[#0F172A] font-normal mb-3">
              Enterprise Reliability
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed font-normal">
              Standar integritas dan reliabilitas data tingkat tinggi. Dirancang untuk menangani beban operasional nyata dengan stabilitas tanpa kompromi.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 hover:border-[#93C5FD] hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 bg-[#EFF6FF] rounded-md flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-serif text-[#0F172A] font-normal mb-3">
              Human-Centric Craft
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed font-normal">
              Teknologi hebat adalah teknologi yang nyaman digunakan manusia. Kami memadukan arsitektur kokoh dengan estetika editorial yang elegan.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. MASTERPIECES / PORTOFOLIO SHOWCASE (GUWIGO DARK NAVY CONTRAST)
      ========================================== */}
      <section className="bg-[#0A0F1D] text-[#FAF9F6] py-24 md:py-32 border-y border-[#1E293B] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/[0.1] rounded-full blur-[140px] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
          <div className="mb-14 md:flex justify-between items-end">
            <div>
              <span className="text-[#38BDF8] font-medium tracking-[0.2em] text-xs uppercase mb-3 block">
                Portofolio & Rekam Jejak
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-tight">
                Karya Pilihan Guwigo
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="hidden md:flex text-[#60A5FA] font-medium text-sm items-center gap-2 border-b border-[#2563EB]/40 pb-1 hover:text-white hover:border-white transition-all"
            >
              Lihat Seluruh Portofolio ({portfolios.length}) <ArrowRight size={15} />
            </Link>
          </div>

          {displayPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayPortfolios.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#131C31] border border-[#1E293B] rounded-lg p-7 md:p-9 relative overflow-hidden group hover:border-[#2563EB]/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-5">
                      <span className="px-3 py-1 rounded-md bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#60A5FA] text-xs font-medium">
                        {item.category || "Project"}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-[#0A0F1D] rounded-md border border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#2563EB] transition-colors"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                    <h3 className="text-2xl font-serif font-normal text-white mb-2.5 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[#94A3B8] text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                      {item.description}
                    </p>
                  </div>

                  {item.image && (
                    <div className="relative z-10 h-52 w-full rounded-md overflow-hidden bg-[#0A0F1D] border border-[#1E293B]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#131C31] border border-[#1E293B] rounded-lg p-8">
                <div className="w-12 h-12 bg-[#2563EB] rounded-md flex items-center justify-center mb-6 text-white">
                  <Globe size={24} />
                </div>
                <h3 className="text-2xl font-serif font-normal text-white mb-3">DSN Connect</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  Platform Smart Village terpadu untuk tata kelola persuratan digital, siaran komunitas, dan layanan warga Desa Sardonoharjo.
                </p>
              </div>

              <div className="bg-[#131C31] border border-[#1E293B] rounded-lg p-8">
                <div className="w-12 h-12 bg-[#2563EB] rounded-md flex items-center justify-center mb-6 text-white">
                  <Cpu size={24} />
                </div>
                <h3 className="text-2xl font-serif font-normal text-white mb-3">EduPass FMIPA UII</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  Ekosistem manajemen akademik terpadu dengan 10+ modul digitalisasi alur administrasi kampus secara seamless.
                </p>
              </div>

              <div className="bg-[#131C31] border border-[#1E293B] rounded-lg p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-4xl font-serif font-normal text-white mb-2">100%</h3>
                  <p className="text-[#38BDF8] text-xs uppercase tracking-wider font-medium">Production Tested</p>
                  <p className="text-[#94A3B8] text-sm mt-3 leading-relaxed">
                    Sistem beroperasi aktif di ranah publik dengan SLA tinggi dan pemeliharaan berkesinambungan.
                  </p>
                </div>
                <Link
                  href="/portfolio"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-white hover:text-[#60A5FA] transition-colors"
                >
                  Buka Katalog Lengkap <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          5. STORE & PLATFORM HIGHLIGHTS
      ========================================== */}
      <section className="py-24 md:py-32 bg-[#FAF9F6] border-b border-[#E2E8F0]">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-[#2563EB] font-medium tracking-[0.2em] text-xs uppercase mb-3 block">
                Produk & Platform
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#0F172A] font-normal tracking-tight">
                Ekosistem Siap Pakai
              </h2>
            </div>
            <Link
              href="/store"
              className="text-[#0F172A] font-medium text-sm items-center gap-2 border-b border-[#E2E8F0] pb-1 hover:text-[#2563EB] hover:border-[#2563EB] transition-all hidden md:flex"
            >
              Lihat Guwigo Store <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white p-7 rounded-lg shadow-sm hover:shadow-md border border-[#E2E8F0] hover:border-[#93C5FD] transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    {prod.imageUrl ? (
                      <div className="h-48 w-full bg-[#FAF9F6] rounded-md mb-5 relative overflow-hidden border border-[#E2E8F0]">
                        <Image
                          src={prod.imageUrl}
                          alt={prod.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-[#FAF9F6] rounded-md mb-5 flex items-center justify-center text-[#94A3B8] border border-[#E2E8F0]">
                        <ShoppingBag size={36} />
                      </div>
                    )}
                    <span className="px-2.5 py-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md text-[11px] font-medium text-[#1D4ED8]">
                      {prod.category || "Platform"}
                    </span>
                    <h3 className="text-xl font-serif text-[#0F172A] mt-3 mb-2 font-normal">
                      {prod.name}
                    </h3>
                    <p className="text-[#64748B] text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                      {prod.description}
                    </p>
                  </div>
                  <Link
                    href="/store"
                    className="text-[#2563EB] font-medium text-xs uppercase tracking-wider hover:text-[#1D4ED8] transition-colors flex items-center gap-2 pt-4 border-t border-[#E2E8F0]"
                  >
                    Buka Produk <ArrowRight size={13} />
                  </Link>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white p-7 rounded-lg border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-md transition-all group flex flex-col">
                  <div className="h-44 bg-[#FAF9F6] rounded-md mb-6 flex items-center justify-center text-[#64748B] border border-[#E2E8F0]">
                    <Smartphone size={32} />
                  </div>
                  <span className="px-2.5 py-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md text-[11px] font-medium text-[#1D4ED8] self-start mb-2">
                    Layanan Perangkat
                  </span>
                  <h3 className="text-xl font-serif text-[#0F172A] mb-2 font-normal">
                    Hardware Engineering
                  </h3>
                  <p className="text-[#64748B] text-sm mb-6 flex-1 leading-relaxed font-normal">
                    Pemeliharaan dan perbaikan perangkat keras presisi untuk laptop, workstation, dan perangkat operasional bisnis.
                  </p>
                  <Link
                    href="/contact"
                    className="text-[#2563EB] font-medium text-xs uppercase tracking-wider hover:text-[#1D4ED8] transition-colors mt-auto flex items-center gap-2 pt-4 border-t border-[#E2E8F0]"
                  >
                    Konsultasi Service <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="bg-white p-7 rounded-lg border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-md transition-all group flex flex-col">
                  <div className="h-44 bg-[#FAF9F6] rounded-md mb-6 flex items-center justify-center text-[#64748B] border border-[#E2E8F0]">
                    <Layers size={32} />
                  </div>
                  <span className="px-2.5 py-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md text-[11px] font-medium text-[#1D4ED8] self-start mb-2">
                    SaaS Ecosystem
                  </span>
                  <h3 className="text-xl font-serif text-[#0F172A] mb-2 font-normal">
                    Enterprise SaaS & POS
                  </h3>
                  <p className="text-[#64748B] text-sm mb-6 flex-1 leading-relaxed font-normal">
                    Solusi platform siap pakai untuk sistem persewaan, point of sale, manajemen inventori, dan otomasi WhatsApp CRM.
                  </p>
                  <Link
                    href="/services"
                    className="text-[#2563EB] font-medium text-xs uppercase tracking-wider hover:text-[#1D4ED8] transition-colors mt-auto flex items-center gap-2 pt-4 border-t border-[#E2E8F0]"
                  >
                    Jelajahi Solusi <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="bg-white p-7 rounded-lg border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-md transition-all group flex flex-col">
                  <div className="h-44 bg-[#FAF9F6] rounded-md mb-6 flex items-center justify-center text-[#64748B] border border-[#E2E8F0]">
                    <Globe size={32} />
                  </div>
                  <span className="px-2.5 py-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md text-[11px] font-medium text-[#1D4ED8] self-start mb-2">
                    GovTech & Publik
                  </span>
                  <h3 className="text-xl font-serif text-[#0F172A] mb-2 font-normal">
                    Smart Village Platform
                  </h3>
                  <p className="text-[#64748B] text-sm mb-6 flex-1 leading-relaxed font-normal">
                    Sistem informasi tata kelola pemerintahan desa dan komunitas lokal untuk digitalisasi pelayanan publik yang transparan.
                  </p>
                  <Link
                    href="/store"
                    className="text-[#2563EB] font-medium text-xs uppercase tracking-wider hover:text-[#1D4ED8] transition-colors mt-auto flex items-center gap-2 pt-4 border-t border-[#E2E8F0]"
                  >
                    Buka Detail <ArrowRight size={13} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FAQ 
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 py-24 md:py-32 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] font-normal mb-12 text-center tracking-tight">
          Pertanyaan yang Sering Diajukan
        </h2>
        <div className="space-y-4">
          <div className="border border-[#E2E8F0] bg-white rounded-md p-6 md:p-7 hover:border-[#93C5FD] transition-colors cursor-pointer group shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-[#0F172A] text-lg font-normal">
                Apakah Guwigo menerima proyek skala kecil atau UMKM?
              </h4>
              <ChevronDown className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors shrink-0" />
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed mt-4 hidden group-hover:block animate-in slide-in-from-top-2">
              Tentu. Guwigo berakar dari dedikasi mendampingi UMKM lokal di Yogyakarta sejak 2015. Kami merancang arsitektur paket modular yang ramah anggaran namun tetap kokoh dan siap diskalakan seiring pertumbuhan usaha Anda.
            </p>
          </div>
          <div className="border border-[#E2E8F0] bg-white rounded-md p-6 md:p-7 hover:border-[#93C5FD] transition-colors cursor-pointer group shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-[#0F172A] text-lg font-normal">
                Berapa estimasi waktu proses pengembangan aplikasi custom?
              </h4>
              <ChevronDown className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors shrink-0" />
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed mt-4 hidden group-hover:block animate-in slide-in-from-top-2">
              Waktu pengerjaan disesuaikan dengan lingkup kebutuhan. Untuk Website Profil Perusahaan atau Landing Page umumnya memakan waktu 1 hingga 2 minggu. Sedangkan untuk Sistem Enterprise, SaaS, atau aplikasi ERP kustom berkisar antara 1 hingga 4 bulan dengan sprint mingguan yang transparan.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. CTA (GUWIGO DARK NAVY BANNER)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 pb-24 max-w-6xl">
        <div className="bg-[#0A0F1D] rounded-lg p-12 md:p-20 text-center text-white relative overflow-hidden border border-[#1E293B]">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[#38BDF8] font-medium tracking-[0.2em] text-xs uppercase mb-4 block">
              Kolaborasi & Konsultasi
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal mb-5 tracking-tight leading-tight">
              Siap Membangun Arsitektur Digital Masa Depan?
            </h2>
            <p className="text-[#94A3B8] font-normal text-base md:text-lg mb-10 leading-relaxed">
              Diskusikan tantangan teknis dan visi bisnis Anda bersama tim engineer kami. Kami siap mendengarkan dan merancang solusi terbaik.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-[#2563EB] text-white px-8 py-4 rounded-md font-medium text-sm hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150 shadow-lg shadow-blue-500/25"
            >
              Mulai Konsultasi Proyek <ArrowRight size={16} />
            </Link>
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2563EB]/[0.1] rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}

