"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Calendar,
  ArrowRight,
  Search,
  Tag,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { NewsArticle, NEWS_CATEGORIES } from "@/types/news";

export default function PublicNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPublicNews = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "news"),
          where("status", "==", "published"),
          orderBy("publishedAt", "desc")
        );
        const snap = await getDocs(q);
        const list: NewsArticle[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as NewsArticle);
        });
        setArticles(list);
      } catch (err) {
        console.error("Error fetching news:", err);
        // Fallback jika belum ada index komposit publishedAt
        try {
          const fallbackSnap = await getDocs(collection(db, "news"));
          const list: NewsArticle[] = [];
          fallbackSnap.forEach((doc) => {
            const d = doc.data();
            if (d.status === "published" || !d.status) {
              list.push({ id: doc.id, ...d } as NewsArticle);
            }
          });
          setArticles(list);
        } catch (e) {
          console.error("Fallback error:", e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicNews();
  }, []);

  const filteredArticles = articles.filter((a) => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch =
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const regularArticles = articles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24 font-sans selection:bg-blue-600 selection:text-white">
      {/* HERO HEADER */}
      <section className="container mx-auto px-4 sm:px-6 max-w-7xl mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest">
            <Newspaper size={14} /> Newsroom & Inovasi
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Kabar, Wawasan & Rilis Resmi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Guwigo Indonesia
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">
            Ikuti perkembangan produk, pembaruan arsitektur teknologi, serta gagasan kami dalam membangun ekosistem digital Indonesia.
          </p>
        </div>

        {/* SEARCH & CATEGORY BAR */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto p-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Semua Topik
            </button>
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari artikel berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-50 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all border border-slate-200"
            />
          </div>
        </div>
      </section>

      {/* CONTENT AREA */}
      <section className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {loading ? (
          <div className="p-20 text-center space-y-4">
            <Loader2 size={36} className="animate-spin text-blue-600 mx-auto" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Memuat Warta Guwigo...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <p className="text-base font-bold text-slate-800">Tidak ada artikel yang cocok</p>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* FEATURED STORY BANNER */}
            {featuredArticle && activeCategory === "all" && !searchQuery && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[320px] bg-slate-100 overflow-hidden">
                    {featuredArticle.coverImage ? (
                      <Image
                        src={featuredArticle.coverImage}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : null}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md">
                        {featuredArticle.category}
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Calendar size={13} />
                        {featuredArticle.publishedAt?.toDate?.()?.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }) || "Terkini"}
                      </div>
                      <Link href={`/news/${featuredArticle.slug}`}>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {featuredArticle.title}
                        </h2>
                      </Link>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {featuredArticle.summary || featuredArticle.content.slice(0, 160)}
                      </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Oleh: {featuredArticle.author?.name || "Redaksi Guwigo"}
                      </span>
                      <Link
                        href={`/news/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-700 group/link"
                      >
                        Baca Selengkapnya
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ARTICLES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeCategory === "all" && !searchQuery ? regularArticles : filteredArticles).map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  <Link href={`/news/${item.slug}`} className="relative h-52 bg-slate-100 overflow-hidden block">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </Link>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
                        <Calendar size={12} />
                        {item.publishedAt?.toDate?.()?.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }) || "Terkini"}
                      </div>
                      <Link href={`/news/${item.slug}`}>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {item.summary || item.content.slice(0, 120)}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">
                        {item.author?.name || "Guwigo Editorial"}
                      </span>
                      <Link
                        href={`/news/${item.slug}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Baca <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
