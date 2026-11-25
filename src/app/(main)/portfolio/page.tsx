"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Layers,
  Loader2,
  FolderOpen,
  Tag,
  Star,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  link?: string;
  featured?: boolean;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const items: PortfolioItem[] = [];
        querySnapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as PortfolioItem);
        });
        setPortfolios(items);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(portfolios.map((p) => p.category).filter(Boolean))),
  ];

  const filteredPortfolios =
    selectedCategory === "All"
      ? portfolios
      : portfolios.filter((p) => p.category === selectedCategory);

  const featuredProjects = portfolios.filter((p) => p.featured);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A]">
      {/* 1. HERO PORTFOLIO */}
      <section className="container mx-auto px-4 sm:px-6 mb-20 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-medium tracking-tight mb-6 shadow-sm">
          <Code2 size={13} className="text-[#2563EB]" />
          Mahakarya & Rekam Jejak
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#0F172A] mb-6 tracking-tight leading-[1.15] font-normal">
          Building Digital <br />
          <span className="italic text-[#2563EB]">
            Civilizations.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
          Jejak inovasi dan rekayasa perangkat lunak Guwigo: Solusi Enterprise, GovTech, Smart Village, Ekosistem Kampus, hingga Produk Digital Skala Nasional.
        </p>
      </section>

      {/* 2. FEATURED SHOWCASE (IF ANY) */}
      {!isLoading && featuredProjects.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 mb-24 max-w-6xl">
          <div className="flex items-center gap-2 mb-8">
            <Star className="text-[#2563EB] fill-[#2563EB]" size={18} />
            <h2 className="text-2xl font-serif text-[#0F172A] font-normal tracking-tight">
              Karya Pilihan (Flagship)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0A0F1D] rounded-lg p-7 md:p-9 text-[#FAF9F6] relative overflow-hidden shadow-xl group border border-[#1E293B] flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/[0.1] rounded-md blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="px-3 py-1 rounded-md bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-xs font-medium">
                      {proj.category || "Flagship"}
                    </span>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#94A3B8] hover:text-white transition-colors p-2 bg-[#131C31] rounded-md border border-[#1E293B]"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-serif font-normal text-white tracking-tight pt-1">
                    {proj.title}
                  </h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed line-clamp-3 font-normal">
                    {proj.description}
                  </p>
                </div>

                {proj.image && (
                  <div className="relative z-10 mt-6 h-56 w-full rounded-md overflow-hidden bg-[#131C31] border border-[#1E293B]">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. MAIN CATALOG GRID & CATEGORY FILTER */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-[#E2E8F0] pb-8">
          <div>
            <span className="text-[#2563EB] font-medium tracking-[0.2em] text-xs uppercase mb-2 block">
              Eksplorasi
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] font-normal tracking-tight">
              Seluruh Karya & Proyek
            </h2>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-1 bg-[#F1F5F9] p-1 rounded-md border border-[#E2E8F0]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-white text-[#2563EB] shadow-sm font-semibold"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* State: Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-[#2563EB] mb-4" />
            <p className="text-[#64748B] font-medium text-xs uppercase tracking-wider">
              Memuat data karya...
            </p>
          </div>
        )}

        {/* State: Empty */}
        {!isLoading && filteredPortfolios.length === 0 && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-16 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 bg-[#FAF9F6] text-[#94A3B8] rounded-md flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
              <FolderOpen size={26} />
            </div>
            <h3 className="text-2xl font-serif font-normal text-[#0F172A] mb-2">
              Belum Ada Data Portofolio
            </h3>
            <p className="text-[#64748B] font-normal text-sm">
              Tambahkan portofolio baru dari halaman Admin Panel untuk menampilkannya di sini.
            </p>
            <Link
              href="/admin/portfolio"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#2563EB] text-white font-medium text-xs uppercase tracking-wider rounded-md hover:bg-[#1D4ED8] transition-colors shadow-sm"
            >
              Buka Admin Portfolio <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* State: Data List */}
        {!isLoading && filteredPortfolios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-lg p-6 border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {item.image ? (
                    <div className="h-52 w-full bg-[#FAF9F6] rounded-md mb-5 relative overflow-hidden border border-[#E2E8F0]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 w-full bg-[#FAF9F6] rounded-md mb-5 flex items-center justify-center text-[#94A3B8] border border-[#E2E8F0]">
                      <Layers size={32} />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#1D4ED8] rounded-md text-[11px] font-medium border border-[#BFDBFE]">
                      {item.category || "General"}
                    </span>
                    {item.featured && (
                      <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-md text-[11px] font-medium flex items-center gap-1">
                        <Star size={10} className="fill-[#92400E]" /> Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-serif font-normal text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                    {item.description}
                  </p>
                </div>

                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-[#E2E8F0] text-xs font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors"
                  >
                    <span>Kunjungi Proyek</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <div className="pt-4 border-t border-[#E2E8F0] text-xs font-normal text-[#94A3B8]">
                    Internal Enterprise Project
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

