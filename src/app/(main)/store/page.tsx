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
  Tag,
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
        // Cek koleksi 'store_products' terlebih dahulu
        let q = query(
          collection(db, "store_products"),
          where("status", "==", "active"),
        );
        let querySnapshot = await getDocs(q);
        let data: StoreProduct[] = [];
        querySnapshot.forEach((docSnapshot) => {
          data.push({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as StoreProduct);
        });

        // Jika store_products kosong, coba tarik dari 'products'
        if (data.length === 0) {
          const fallbackSnapshot = await getDocs(collection(db, "products"));
          fallbackSnapshot.forEach((docSnapshot) => {
            const p = docSnapshot.data();
            if (p.status === "active" || !p.status) {
              const minPrice = p.packages && p.packages.length > 0
                ? Math.min(...p.packages.map((pkg: any) => pkg.price || 0))
                : (p.price || 0);

              data.push({
                id: docSnapshot.id,
                name: p.name || "Produk",
                category: p.category || "General",
                price: minPrice,
                image: p.imageUrl || p.image || "",
                desc: p.description || p.desc || "",
                tag: p.tag || (p.packages && p.packages.length > 0 ? `${p.packages.length} Paket` : "Tersedia"),
                status: "active",
              } as StoreProduct);
            }
          });
        }

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
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION (EDITORIAL BRAND THEME)
      ========================================== */}
      <section className="pt-36 md:pt-44 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="text-[#2563EB] font-medium tracking-[0.2em] text-xs uppercase mb-3 block">
            Guwigo Tech Store
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#0F172A] mb-5 tracking-tight leading-[1.1] font-normal">
            {t.store?.title1 || "Premium Tech."} <br />
            <span className="italic text-[#2563EB]">
              {t.store?.title2 || "Masterpieces."}
            </span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            {t.store?.desc ||
              "Dari platform software siap pakai, perlengkapan esensial engineer, hingga perangkat terkurasi yang mendukung produktivitas Anda."}
          </p>

          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => {
                const element = document.getElementById("store-catalog");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#2563EB] text-white px-7 py-3 rounded-md font-medium text-xs uppercase tracking-wider hover:bg-[#1D4ED8] transition-colors shadow-sm flex items-center gap-2"
            >
              Eksplorasi Katalog
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. PRODUCT SHOWCASE (CATALOG)
      ========================================== */}
      <section
        id="store-catalog"
        className="container mx-auto px-4 sm:px-6 py-12 relative z-20"
      >
        {/* Filter Controls */}
        {!isLoading && productsData.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6 border-b border-[#E2E8F0] pb-6">
            <div>
              <h2 className="text-2xl font-serif text-[#0F172A] tracking-tight font-normal">
                {filter === "All"
                  ? t.store?.filter_title || "Semua Koleksi"
                  : `${filter} ${t.store?.filter_title || "Collection"}`}
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5 bg-[#F1F5F9] p-1.5 rounded-md border border-[#E2E8F0]">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === cat
                      ? "bg-white text-[#2563EB] shadow-sm font-semibold"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/60"
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
            <Loader2 size={32} className="animate-spin text-[#2563EB] mb-4" />
          </div>
        )}

        {/* State: Kosong */}
        {!isLoading && productsData.length === 0 && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-16 text-center shadow-sm max-w-3xl mx-auto flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#FAF9F6] text-[#94A3B8] rounded-md flex items-center justify-center mb-6 border border-[#E2E8F0]">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-2xl font-serif font-normal text-[#0F172A] mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-[#64748B] text-sm">
              Katalog produk saat ini sedang dikosongkan atau diatur ulang oleh
              Administrator.
            </p>
          </div>
        )}

        {/* State: Menampilkan Produk */}
        {!isLoading && productsData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg p-5 border border-[#E2E8F0] hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-200 flex flex-col h-full animate-in fade-in"
              >
                {/* Image Area */}
                <div className="h-64 bg-[#FAF9F6] rounded-md mb-5 relative overflow-hidden transition-colors border border-[#E2E8F0]">
                  {/* Badge Label */}
                  {product.tag && (
                    <div className="absolute top-3 left-3 z-20 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] px-3 py-0.5 rounded-md text-[11px] font-medium shadow-sm">
                      {product.tag}
                    </div>
                  )}

                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag size={44} className="text-[#94A3B8]" />
                    </div>
                  )}
                </div>

                {/* Product Detail Area */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1 mb-5">
                    <h3 className="text-lg font-serif font-normal text-[#0F172A] line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {product.desc}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0] mt-auto">
                    <span className="text-base font-serif font-normal text-[#0F172A]">
                      {toRupiah(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product as any)}
                      className="px-4 py-1.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-lg text-xs font-medium hover:bg-[#2563EB] hover:text-white transition-colors"
                    >
                      {t.store?.buy_btn || "Beli"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==========================================
          3. PROMO BANNER & TRADE-IN
      ========================================== */}
      {!isLoading && productsData.length > 0 && (
        <>
          <section className="container mx-auto px-4 sm:px-6 mb-16 max-w-5xl">
            <div className="bg-[#0A0F1D] text-white rounded-lg p-10 md:p-14 text-center border border-[#1E293B] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/[0.12] blur-[80px] rounded-full pointer-events-none"></div>
              <span className="text-[#06B6D4] text-xs uppercase tracking-wider font-medium mb-2 block relative z-10">Penawaran Eksklusif</span>
              <h2 className="text-3xl md:text-4xl font-serif font-normal text-white mb-3 tracking-tight relative z-10">
                {t.store?.promo_title || "Diskon Spesial Mitra Bisnis."}
              </h2>
              <p className="text-[#94A3B8] text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed relative z-10">
                {t.store?.promo_desc ||
                  "Dapatkan potongan harga eksklusif hingga 30% untuk seluruh paket bundling lisensi platform dan perakitan software kami."}
              </p>
              <button
                onClick={() => setFilter("Apparel")}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3 rounded-md font-medium text-xs uppercase tracking-wider transition-colors shadow-sm relative z-10"
              >
                {t.store?.promo_link || "Lihat Koleksi"}
              </button>
            </div>
          </section>

          <section className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="bg-white rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#E2E8F0] shadow-sm">
              <div>
                <h2 className="text-2xl font-serif font-normal text-[#0F172A] mb-2 tracking-tight">
                  {t.store?.tradein_title || "Program Konsultasi & Migrasi Sistem."}
                </h2>
                <p className="text-[#64748B] text-sm max-w-xl leading-relaxed">
                  {t.store?.tradein_desc ||
                    "Ingin memigrasikan sistem warisan Anda ke cloud modern? Tim arsitek kami siap membantu audit dan pemindahan data dengan zero downtime."}
                </p>
              </div>
              <Link
                href="/contact"
                className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shadow-sm"
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
