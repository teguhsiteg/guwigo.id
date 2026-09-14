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
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324]">
      {/* 1. HERO PORTFOLIO */}
      <section className="container mx-auto px-4 sm:px-6 mb-20 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
          <Code2 size={12} className="text-[#00D4FF]" />
          The Masterpieces & Portofolio
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
          Building Digital <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-[#00D4FF]">
            Civilizations.
          </span>
        </h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Jejak inovasi dan karya teknologi Guwigo: Solusi Enterprise, GovTech, Super App, Ekosistem Kampus, hingga Produk Digital Masa Depan.
        </p>
      </section>

      {/* 2. FEATURED SHOWCASE (IF ANY) */}
      {!isLoading && featuredProjects.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 mb-24 max-w-6xl">
          <div className="flex items-center gap-2 mb-8">
            <Star className="text-amber-400 fill-amber-400" size={20} />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Featured Flagships
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0B1324] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl group border border-white/10 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#00D4FF]/15 rounded-full blur-[90px] pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="px-4 py-1.5 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-black uppercase tracking-widest">
                      {proj.category || "Flagship"}
                    </span>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-[#00D4FF] transition-colors p-2 bg-white/5 rounded-xl border border-white/10"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>

                  <h3 className="text-3xl font-black text-white tracking-tight pt-2">
                    {proj.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                {proj.image && (
                  <div className="relative z-10 mt-6 h-56 w-full rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
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
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div>
            <span className="text-[#00D4FF] font-bold tracking-widest text-xs uppercase mb-2 block">
              Exploration
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              All Projects & Creations
            </h2>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-[#0B1324] text-[#00D4FF] shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
            <Loader2 size={40} className="animate-spin text-[#00D4FF] mb-4" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Memuat data karya...
            </p>
          </div>
        )}

        {/* State: Empty */}
        {!isLoading && filteredPortfolios.length === 0 && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-16 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={30} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Belum Ada Data Portofolio
            </h3>
            <p className="text-slate-500 font-medium text-sm">
              Tambahkan portofolio baru dari halaman Admin Panel untuk menampilkannya di sini.
            </p>
            <Link
              href="/admin/portfolio"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#0B1324] text-[#00D4FF] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-slate-800 transition-colors"
            >
              Buka Admin Portfolio <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* State: Data List */}
        {!isLoading && filteredPortfolios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((item, idx) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2rem] p-6 border border-slate-200 hover:border-[#00D4FF]/40 hover:shadow-xl hover:shadow-[#00D4FF]/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {item.image ? (
                    <div className="h-52 w-full bg-slate-100 rounded-2xl mb-6 relative overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 w-full bg-slate-100 rounded-2xl mb-6 flex items-center justify-center text-slate-400">
                      <Layers size={36} />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.category || "General"}
                    </span>
                    {item.featured && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Star size={10} className="fill-amber-600" /> Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 mb-6">
                    {item.description}
                  </p>
                </div>

                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-slate-100 text-xs font-bold uppercase tracking-widest text-[#0B1324] group-hover:text-[#00D4FF] transition-colors"
                  >
                    <span>Lihat Proyek</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <div className="pt-4 border-t border-slate-100 text-xs font-medium text-slate-400">
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

