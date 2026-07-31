"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1. KAMUS KATA (LENGKAP: HOME, STORE, CART, CHECKOUT)
const translations = {
  EN: {
    navbar: {
      journey: "Journey",
      services: "Services",
      portfolio: "Portfolio",
      store: "Store",
      contact: "Contact",
      signin: "Sign In",
    },
    home: {
      // ... (Bagian Home tetap sama seperti sebelumnya) ...
      badge: "Est. 2015 — Yogyakarta, Indonesia",
      heroTitle1: "We Engineer",
      heroTitle2: "Digital Ecosystems.",
      heroDesc:
        "Guwigo Teknologi Indonesia is a Venture Builder & Software House turning complexity into precision solutions.",
      cta1: "View Masterpieces",
      cta2: "Partner With Us",
      trusted: "Trusted by Forward-Thinking Organizations",
      pillars: {
        p1_title: "Engineering First",
        p1_desc: "We write clean, scalable, and secure code.",
        p2_title: "Enterprise Grade",
        p2_desc: "High security and reliability standards.",
        p3_title: "Creative Fusion",
        p3_desc: "Technology is not just function, but feeling.",
      },
      ecosystem: {
        subtitle: "The Ecosystem",
        title: "Our Masterpieces",
        link: "View All",
        dsn_desc: "Smart Village Platform.",
        rentara_desc: "Console Marketplace.",
        stats_exp: "Years Experience",
        stats_growth: "Growth",
      },
      retail: {
        subtitle: "Retail",
        title: "Services",
        link: "Visit Store",
        card1_title: "Hardware Repair",
        card1_desc: "Professional repair services.",
        card2_title: "Gadgets",
        card2_desc: "Buy & Sell quality devices.",
        card3_title: "Apparel",
        card3_desc: "Exclusive merchandise.",
      },
      cta_bottom: {
        title: "Ready to Scale?",
        desc: "Discuss your ideas with our team.",
        button: "Start Project",
      },
    },
    // --- BARU: STORE ---
    store: {
      badge: "Guwigo Official Store",
      title1: "Premium Gear.",
      title2: "Exclusive Merch.",
      desc: "Get the best gadgets with official warranty and exclusive apparel.",
      btn_gadget: "Shop Gadgets",
      btn_apparel: "View Apparel",
      filter_title: "Collection",
      filter_subtitle: "Curated by Guwigo Team.",
      filter_all: "All",
      promo_title: "Guwigo Creative Merch",
      promo_desc: "Wear your passion. Designed by developers.",
      promo_link: "See All Merch",
      tradein_title: "Trade-In Program",
      tradein_desc: "Exchange your old gadget for the best price.",
      tradein_btn: "Check Price",
      buy_btn: "Buy",
    },
    // --- BARU: CART ---
    cart: {
      title: "Your Shopping Bag",
      items: "Items",
      empty_title: "Your Bag is Empty",
      empty_desc: "Looks like you haven't added any cool gadgets yet.",
      empty_btn: "Start Shopping",
      summary_title: "Order Summary",
      subtotal: "Subtotal",
      tax: "Tax (11%)",
      shipping: "Shipping",
      shipping_calc: "Calculated at Checkout",
      total: "Total",
      checkout_btn: "Checkout Securely",
      trust_warranty: "Official Warranty",
      trust_payment: "Secure Payment",
    },
  },
  ID: {
    navbar: {
      journey: "Tentang Kami",
      services: "Layanan",
      portfolio: "Portofolio",
      store: "Toko",
      contact: "Hubungi",
      signin: "Masuk",
    },
    home: {
      // ... (Bagian Home tetap sama) ...
      badge: "Est. 2015 — Yogyakarta, Indonesia",
      heroTitle1: "Kami Merancang",
      heroTitle2: "Ekosistem Digital.",
      heroDesc:
        "Guwigo Teknologi Indonesia adalah Venture Builder & Software House yang mengubah kompleksitas menjadi solusi presisi.",
      cta1: "Lihat Karya",
      cta2: "Kerjasama",
      trusted: "Dipercaya oleh Organisasi Maju",
      pillars: {
        p1_title: "Engineering First",
        p1_desc: "Kami menulis kode yang bersih, scalable, dan aman.",
        p2_title: "Enterprise Grade",
        p2_desc: "Standar keamanan tinggi untuk ribuan pengguna.",
        p3_title: "Creative Fusion",
        p3_desc: "Teknologi bukan hanya fungsi, tapi rasa.",
      },
      ecosystem: {
        subtitle: "Ekosistem",
        title: "Karya Kami",
        link: "Lihat Semua",
        dsn_desc: "Platform Desa Cerdas.",
        rentara_desc: "Marketplace Konsol.",
        stats_exp: "Tahun Pengalaman",
        stats_growth: "Pertumbuhan",
      },
      retail: {
        subtitle: "Retail",
        title: "Layanan",
        link: "Kunjungi Toko",
        card1_title: "Servis Hardware",
        card1_desc: "Perbaikan profesional & presisi.",
        card2_title: "Gadget",
        card2_desc: "Jual beli perangkat berkualitas.",
        card3_title: "Apparel",
        card3_desc: "Merchandise eksklusif.",
      },
      cta_bottom: {
        title: "Siap Bertumbuh?",
        desc: "Diskusikan ide Anda dengan kami.",
        button: "Mulai Proyek",
      },
    },
    // --- BARU: STORE (Indonesian) ---
    store: {
      badge: "Toko Resmi Guwigo",
      title1: "Gadget Premium.",
      title2: "Merch Eksklusif.",
      desc: "Dapatkan gadget terbaik dengan garansi resmi dan koleksi apparel eksklusif.",
      btn_gadget: "Belanja Gadget",
      btn_apparel: "Lihat Apparel",
      filter_title: "Koleksi",
      filter_subtitle: "Dikurasi oleh Tim Guwigo.",
      filter_all: "Semua",
      promo_title: "Merch Kreatif Guwigo",
      promo_desc: "Tunjukkan passion-mu. Didesain oleh developer.",
      promo_link: "Lihat Semua Merch",
      tradein_title: "Program Tukar Tambah",
      tradein_desc: "Tukar gadget lama Anda dengan harga terbaik.",
      tradein_btn: "Cek Harga",
      buy_btn: "Beli",
    },
    // --- BARU: CART (Indonesian) ---
    cart: {
      title: "Keranjang Belanja",
      items: "Barang",
      empty_title: "Keranjang Kosong",
      empty_desc: "Sepertinya Anda belum menambahkan gadget keren.",
      empty_btn: "Mulai Belanja",
      summary_title: "Ringkasan Pesanan",
      subtotal: "Subtotal",
      tax: "PPN (11%)",
      shipping: "Ongkir",
      shipping_calc: "Dihitung saat Checkout",
      total: "Total",
      checkout_btn: "Checkout Aman",
      trust_warranty: "Garansi Resmi",
      trust_payment: "Pembayaran Aman",
    },
  },
};

type Language = "EN" | "ID";
type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.EN;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
