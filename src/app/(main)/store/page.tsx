"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Star,
  ArrowRight,
  Plus,
  Loader2,
  Sparkles,
  RefreshCcw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Definisi Interface untuk Produk Store
interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating?: number;
  desc: string;
  tag?: string;
  status: "active" | "inactive";
}

export default function StorePage() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [filter, setFilter] = useState("All");

  // State untuk Data Firebase
  const [productsData, setProductsData] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Products Data dari Firestore
  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        // Asumsi koleksi bernama 'store_products'
        const q = query(
          collection(db, "store_products"),
          where("status", "==", "active"),
        );
        const querySnapshot = await getDocs(q);
        const data: StoreProduct[] = [];
        querySnapshot.forEach((docSnapshot) => {
          data.push({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as StoreProduct);
        });

        // Urutkan berdasarkan nama
        setProductsData(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching store products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreProducts();
  }, []);

  // Ekstrak kategori unik dari data yang ditarik
  const dynamicCategories = [
    "All",
    ...Array.from(new Set(productsData.map((p) => p.category))),
  ];

  const filteredProducts =
    filter === "All"
      ? productsData
      : productsData.filter((p) => p.category === filter);

  const toRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION EKSKLUSIF (DARK PREMIUM THEME)
      ========================================== */}
      <section className="bg-[#0B1324] pt-40 pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        {/* Background Visual Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00D4FF]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black text-[#00D4FF] uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <ShoppingBag size={12} />{" "}
            {t.store?.badge || "GUWIGO MERCH & RETAIL"}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            {t.store?.title1 || "Premium Tech"} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-blue-500">
              {t.store?.title2 || "Masterpieces."}
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            {t.store?.desc ||
              "Dari apparel eksklusif untuk komunitas developer hingga perangkat premium yang menunjang produktivitas Anda tanpa batas."}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8 border-t border-white/10 pt-8 max-w-2xl mx-auto">
            <button
              onClick={() => {
                const element = document.getElementById("store-catalog");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#00D4FF] text-[#0B1324] px-8 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            >
              Eksplorasi Katalog <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. PRODUCT SHOWCASE (CATALOG)
      ========================================== */}
      <section
        id="store-catalog"
        className="container mx-auto px-4 sm:px-6 -mt-10 relative z-20"
      >
        {/* Filter Controls (Ditampilkan hanya jika tidak loading) */}
        {!isLoading && productsData.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {filter === "All"
                  ? t.store?.filter_title || "Semua Koleksi"
                  : `${filter} ${t.store?.filter_title || "Collection"}`}
              </h2>
              <p className="text-slate-500 font-medium mt-2">
                {t.store?.filter_subtitle ||
                  "Pilih kategori untuk memfilter produk kami."}
              </p>
            </div>

            <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-sm">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    filter === cat
                      ? "bg-[#0B1324] text-[#00D4FF] shadow-md"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  {cat === "All" ? t.store?.filter_all || "All Items" : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* State: Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={48} className="animate-spin text-[#00D4FF] mb-4" />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
              Menarik Data Katalog...
            </p>
          </div>
        )}

        {/* State: Kosong */}
        {!isLoading && productsData.length === 0 && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-16 text-center shadow-sm max-w-3xl mx-auto flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-slate-500 font-medium">
              Katalog produk saat ini sedang dikosongkan atau diatur ulang oleh
              Administrator.
            </p>
          </div>
        )}

        {/* State: Menampilkan Produk */}
        {!isLoading && productsData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="group bg-white rounded-[2rem] p-6 border border-slate-200 hover:border-[#00D4FF]/30 hover:shadow-2xl hover:shadow-[#00D4FF]/10 transition-all duration-500 flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Image Area */}
                <div className="h-72 bg-slate-50 rounded-2xl mb-6 relative overflow-hidden group-hover:bg-[#00D4FF]/5 transition-colors">
                  {/* Badge Label (Optional) */}
                  {product.tag && (
                    <div className="absolute top-4 left-4 z-20 bg-[#0B1324] text-[#00D4FF] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                      {product.tag}
                    </div>
                  )}

                  {/* Fallback Jika Gambar Kosong */}
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/images/branding/loader.png"
                        alt="Placeholder"
                        width={80}
                        height={80}
                        className="opacity-20 grayscale"
                      />
                    </div>
                  )}

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-[#0B1324]/0 group-hover:bg-[#0B1324]/10 transition-colors duration-300 z-10 flex items-end justify-end p-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Hindari ter-click elemen di belakangnya jika dibungkus link nanti
                        addToCart(product as any);
                      }}
                      className="w-12 h-12 bg-[#00D4FF] text-[#0B1324] rounded-full shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center justify-center translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                      title="Tambahkan ke Keranjang"
                    >
                      <Plus size={24} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                {/* Product Detail Area */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-[#00D4FF] transition-colors">
                        {product.name}
                      </h3>
                      {/* Rating (Opsional) */}
                      {product.rating && (
                        <div className="flex gap-1 text-yellow-500 items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100 shrink-0">
                          <Star size={12} fill="currentColor" />
                          <span className="text-[10px] text-yellow-700 font-black">
                            {product.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {product.desc}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex justify-between items-center pt-5 border-t border-slate-100 mt-auto">
                    <span className="text-lg font-black text-[#0B1324] tracking-tight">
                      {toRupiah(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product as any)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black hover:bg-[#0B1324] hover:text-[#00D4FF] transition-all uppercase tracking-widest shadow-sm"
                    >
                      <ShoppingBag size={14} /> {t.store?.buy_btn || "Beli"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==========================================
          3. PROMO BANNER & TRADE-IN (OPSIONAL JIKA ADA KONTEN)
      ========================================== */}
      {!isLoading && productsData.length > 0 && (
        <>
          <section className="container mx-auto px-4 sm:px-6 mb-24 max-w-6xl">
            <div className="bg-[#0B1324] rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl border border-white/5">
              {/* Glow Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/10 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-start md:items-end justify-between relative z-10 gap-6">
                <div className="max-w-xl">
                  <span className="text-[#00D4FF] text-[10px] font-black uppercase tracking-widest mb-3 block">
                    <Sparkles size={14} className="inline mr-1 -mt-0.5" />{" "}
                    Special Offer
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    {t.store?.promo_title || "Diskon Spesial Merch Kemerdekaan"}
                  </h2>
                  <p className="text-slate-400 mt-3 font-medium leading-relaxed">
                    {t.store?.promo_desc ||
                      "Dapatkan potongan harga eksklusif hingga 30% untuk seluruh lini produk apparel edisi terbatas kami."}
                  </p>
                </div>
                <button
                  onClick={() => setFilter("Apparel")}
                  className="inline-flex items-center gap-2 text-[#0B1324] bg-[#00D4FF] hover:bg-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] shrink-0"
                >
                  {t.store?.promo_link || "Lihat Koleksi"}{" "}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-900/5">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <RefreshCcw size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                  {t.store?.tradein_title || "Program Tukar Tambah"}
                </h2>
                <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                  {t.store?.tradein_desc ||
                    "Tukarkan device lama Anda untuk mendapatkan potongan harga eksklusif pada pembelian perangkat baru di Guwigo Store."}
                </p>
              </div>
              <Link
                href="/contact"
                className="px-8 py-4 bg-slate-100 hover:bg-[#0B1324] hover:text-[#00D4FF] text-slate-900 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-colors whitespace-nowrap shadow-sm"
              >
                {t.store?.tradein_btn || "Hubungi Konsultan"}
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
