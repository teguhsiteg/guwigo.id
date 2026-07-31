"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  ArrowRight,
  CheckCircle2,
  X,
  CreditCard,
  MessageCircle,
  Loader2,
  AlertCircle,
  Star,
  Layers,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Code2,
  Lock,
} from "lucide-react";

// ==========================================
// INTERFACES
// ==========================================
interface Feature {
  id: string;
  name: string;
  isIncluded: boolean;
}

interface ProductPackage {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  isPopular: boolean;
  actionType: "checkout" | "whatsapp";
  buttonText: string;
  waMessage: string;
  features: Feature[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive";
  imageUrl: string;
  packages: ProductPackage[];
}

interface ServicesBranding {
  tagline: string;
  title: string;
  subtitle: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Hero Branding (Default fallback)
  const [branding, setBranding] = useState<ServicesBranding>({
    tagline: "Enterprise Solutions",
    title: "Guwigo\nTech Ecosystem.",
    subtitle:
      "Satu pintu untuk semua kebutuhan arsitektur digital Anda. Kami merancang, membangun, dan memelihara sistem yang siap diskalakan.",
  });

  // States untuk Navigasi Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage | null>(
    null,
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // States untuk Form Checkout & In-line Auth
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authPassword, setAuthPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Fetch Branding Data dari /admin/services
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const docRef = doc(db, "admin", "services");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBranding(docSnap.data() as ServicesBranding);
        }
      } catch (error) {
        console.error("Error fetching services branding:", error);
      }
    };
    fetchBranding();
  }, []);

  // Fetch Products Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("status", "==", "active"),
        );
        const querySnapshot = await getDocs(q);
        const data: Product[] = [];
        querySnapshot.forEach((docSnapshot) => {
          data.push({ id: docSnapshot.id, ...docSnapshot.data() } as Product);
        });
        setProductsData(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch User Info
  useEffect(() => {
    // Gunakan onAuthStateChanged agar otomatis terupdate saat login di dalam modal
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          setCurrentUser({ uid: user.uid, ...userData });

          // Auto-fill form
          const fullName = userData?.name || user.displayName || "";
          const nameParts = fullName.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
          setEmail(user.email || "");
          setPhone(user.phoneNumber || userData?.phone || "");
        } catch (error) {
          console.error("Error getting user info:", error);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const categories = Array.from(new Set(productsData.map((p) => p.category)));

  // Buka Form Checkout
  const handleOpenCheckout = (pkg: ProductPackage) => {
    // Jika paket adalah WA, tidak perlu login, langsung buka popup eksternal (disimulasikan dengan fungsi proses)
    if (pkg.actionType === "whatsapp") {
      handleWhatsAppDirect(pkg);
      return;
    }

    // Jika Tripay, buka Modal Checkout
    setSelectedPackage(pkg);
    setCheckoutError(null);
  };

  // Fungsi Langsung ke WA tanpa buka modal
  const handleWhatsAppDirect = (pkg: ProductPackage) => {
    const waNumber = "6281234567890"; // Ganti dengan nomor WA Admin
    const text = `Halo Guwigo,\n\nSaya tertarik dengan Layanan *${selectedProduct?.name}* untuk Paket *${pkg.name}*.\nMohon informasi lebih lanjut untuk diskusi teknis dan pemesanan. Terima kasih.`;
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  // Handle In-line Authentication (Login/Register dalam modal)
  const handleInlineAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    setIsProcessing(true);

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, authPassword);
        // State currentUser akan otomatis terisi oleh onAuthStateChanged
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          authPassword,
        );
        // Buat document user dasar
        const nameFull = `${firstName} ${lastName}`.trim();
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: nameFull,
          email: email,
          role: "member",
          createdAt: new Date().toISOString(),
        });
        // Login berhasil, biarkan form berganti secara otomatis
      }
    } catch (error: any) {
      setCheckoutError(
        "Autentikasi gagal: Email atau Password salah / sudah terdaftar.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Proses Form Checkout Tripay
  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setCheckoutError(
        "Anda harus menyetujui Ketentuan Layanan untuk melanjutkan.",
      );
      return;
    }
    if (!firstName || !email || !phone) {
      setCheckoutError(
        "Mohon lengkapi data diri Anda yang diberi tanda bintang (*).",
      );
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/tripay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          userName: `${firstName} ${lastName}`.trim(),
          userEmail: email,
          userPhone: phone,
          serviceId: selectedProduct?.id,
          serviceName: selectedProduct?.name,
          packageName: selectedPackage?.name,
          amount: selectedPackage?.price,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Gagal membuat transaksi");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Tidak ada URL checkout dari server");
      }
    } catch (error: any) {
      console.error("Order error:", error);
      setCheckoutError(
        error.message || "Terjadi kesalahan saat memproses pesanan.",
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 font-sans selection:bg-[#22D3EE]/30 selection:text-[#0B1120]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* ==========================================
            HEADER / HERO SECTION (DYNAMIC)
        ========================================== */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
              <Code2 size={12} className="text-[#22D3EE]" />
              {branding.tagline}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight whitespace-pre-line">
              {branding.title.includes("Guwigo") ? (
                <>
                  Guwigo <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-[#22D3EE]">
                    {branding.title
                      .replace("Guwigo\n", "")
                      .replace("Guwigo", "")}
                  </span>
                </>
              ) : (
                branding.title
              )}
            </h1>
            <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              {branding.subtitle}
            </p>
          </div>

          {/* Abstract Hero Graphic - Menggunakan Favicon Guwigo */}
          <div className="hidden lg:flex relative w-80 h-80 items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            {/* Efek Cahaya / Glow */}
            <div className="absolute inset-0 bg-[#22D3EE]/20 rounded-full blur-[100px]"></div>

            {/* Logo yang melayang (floating) bebas */}
            <div className="relative w-64 h-64 animate-[bounce_5s_infinite] drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              <Image
                src="/images/branding/logosaja-hitam.png"
                alt="Guwigo Ecosystem Icon"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            LOADING & CATALOG GRID 
        ========================================== */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader2 size={48} className="animate-spin mb-4 text-[#22D3EE]" />
            <p className="font-bold tracking-widest uppercase text-sm">
              Memuat Arsitektur Sistem...
            </p>
          </div>
        ) : productsData.length === 0 ? (
          <div className="text-center py-32 bg-white border border-slate-200 rounded-[3rem] shadow-sm max-w-3xl mx-auto">
            <Layers size={64} className="text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Katalog Sedang Disusun
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Saat ini belum ada layanan publik yang tersedia. Hubungi tim
              representatif kami untuk proyek kustom.
            </p>
          </div>
        ) : (
          <div className="space-y-24">
            {categories.map((cat, idx) => (
              <div
                key={cat as string}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex items-center gap-6 mb-10">
                  <h2 className="text-xl md:text-2xl font-black text-[#0B1120] uppercase tracking-[0.2em]">
                    {cat as string}
                  </h2>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {productsData
                    .filter((p) => p.category === cat)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#22D3EE]/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col overflow-hidden relative"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="aspect-video bg-slate-50 relative overflow-hidden flex items-center justify-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                              {/* LOGO PENGGANTI IMAGE ICON KOSONG (Menggunakan Logo Baru) */}
                              <div className="relative w-20 h-20 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500 grayscale">
                                <Image
                                  src="/images/branding/loader.png"
                                  alt="Guwigo Icon Placeholder"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-[#0B1120]/0 group-hover:bg-[#0B1120]/5 transition-colors duration-300"></div>
                        </div>

                        <div className="p-8 flex flex-col flex-1 relative bg-white z-10">
                          <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-[#22D3EE] transition-colors line-clamp-2 tracking-tight">
                            {product.name}
                          </h3>
                          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1 line-clamp-3">
                            {product.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Layers size={14} className="text-slate-300" />{" "}
                              {product.packages?.length || 0} Tier Pilihan
                            </span>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0B1120] group-hover:text-[#22D3EE] text-slate-400 transition-colors">
                              <ChevronRight size={18} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL 1: PRICING TIERS SELECTION
      ========================================== */}
      {selectedProduct && !selectedPackage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B1120]/80 backdrop-blur-md">
          <div className="bg-slate-50 w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col border border-white/10">
            {/* Header Modal */}
            <div className="bg-white border-b border-slate-200 p-6 md:px-10 flex justify-between items-center z-10 shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt="Icon"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-10 h-10 opacity-40 grayscale">
                      <Image
                        src="/images/branding/loader.png"
                        alt="Guwigo Icon Placeholder"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-[10px] font-black text-[#22D3EE] uppercase tracking-[0.3em] mt-1.5">
                    Pilih Arsitektur Paket
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Modal (Pricing Cards) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
              {!selectedProduct.packages ||
              selectedProduct.packages.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">
                    Struktur Harga Sedang Diformulasikan
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {selectedProduct.packages.map((pkg, index) => (
                    <div
                      key={index}
                      className={`relative bg-white rounded-[2rem] p-8 md:p-10 flex flex-col h-full transition-all duration-300 ${
                        pkg.isPopular
                          ? "border-2 border-[#22D3EE] shadow-2xl shadow-[#22D3EE]/10 lg:-translate-y-4 z-10"
                          : "border border-slate-200 shadow-sm hover:shadow-lg"
                      }`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0B1120] text-[#22D3EE] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg border border-[#22D3EE]/30">
                          <Star size={12} className="fill-[#22D3EE]" />{" "}
                          Recommended
                        </div>
                      )}

                      <div className="mb-8">
                        <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                          {pkg.name}
                        </h3>
                        <div className="flex items-baseline text-slate-900">
                          <span className="text-3xl font-black tracking-tighter">
                            {pkg.price === 0
                              ? "Gratis"
                              : `Rp${pkg.price.toLocaleString("id-ID")}`}
                          </span>
                          <span className="text-slate-400 font-bold ml-2 text-[10px] uppercase tracking-widest">
                            / {pkg.billingPeriod}
                          </span>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100 w-full mb-8"></div>

                      <ul className="space-y-5 mb-10 flex-1">
                        {pkg.features?.map((feat) => (
                          <li key={feat.id} className="flex items-start gap-3">
                            {feat.isIncluded ? (
                              <CheckCircle2
                                size={18}
                                className="text-[#22D3EE] shrink-0 mt-0.5"
                              />
                            ) : (
                              <X
                                size={18}
                                className="text-slate-300 shrink-0 mt-0.5"
                              />
                            )}
                            <span
                              className={`text-xs leading-relaxed ${
                                feat.isIncluded
                                  ? "text-slate-700 font-semibold"
                                  : "text-slate-400 line-through font-medium"
                              }`}
                            >
                              {feat.name}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-4">
                        <button
                          onClick={() => handleOpenCheckout(pkg)}
                          className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                            pkg.isPopular
                              ? "bg-[#0B1120] hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                          }`}
                        >
                          {pkg.actionType === "whatsapp" ? (
                            <>
                              <MessageCircle size={14} /> Konsultasi WA
                            </>
                          ) : (
                            "Pilih Paket"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: IN-LINE AUTH / REVIEW CHECKOUT
      ========================================== */}
      {selectedPackage &&
        selectedProduct &&
        selectedPackage.actionType === "checkout" && (
          <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-[#0B1120]/90 backdrop-blur-md sm:p-6 lg:p-10">
            <div className="bg-slate-50 w-full max-w-5xl min-h-screen sm:min-h-0 sm:rounded-[2.5rem] shadow-2xl relative animate-in fade-in slide-in-from-bottom-10 duration-300 flex flex-col border border-white/10">
              {/* Header Checkout */}
              <div className="bg-[#0B1120] text-white p-6 md:px-10 flex justify-between items-center z-10 shrink-0 sm:rounded-t-[2.5rem] border-b border-white/10">
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
                  >
                    <ChevronLeft size={20} className="text-[#22D3EE]" />
                  </button>
                  <div>
                    <h2 className="text-xl font-black tracking-tight">
                      {currentUser
                        ? "Konfigurasi Pesanan"
                        : "Otentikasi Identitas"}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                      {currentUser
                        ? "Lengkapi data administratif"
                        : "Masuk untuk melanjutkan pesanan"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Checkout */}
              <div className="flex-1 p-4 md:p-8 lg:p-10">
                {checkoutError && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 text-red-700 animate-in slide-in-from-top-4 shadow-sm">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="font-bold text-sm leading-relaxed">
                      {checkoutError}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                  {/* KOLOM KIRI: IN-LINE AUTH ATAU FORM PENGISIAN */}
                  <div className="lg:col-span-7 space-y-8">
                    {!currentUser ? (
                      // === TAMPILAN JIKA BELUM LOGIN (IN-LINE AUTH) ===
                      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-2">
                          {isLoginMode
                            ? "Masuk ke Ekosistem"
                            : "Daftar Akun Baru"}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mb-8">
                          Identitas digital dibutuhkan untuk menerbitkan tagihan
                          dan akses layanan.
                        </p>

                        <form onSubmit={handleInlineAuth} className="space-y-5">
                          {!isLoginMode && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                  Nama Depan
                                </label>
                                <input
                                  required
                                  type="text"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all text-gray-900"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                  Nama Belakang
                                </label>
                                <input
                                  type="text"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all text-gray-900"
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                              Alamat Email *
                            </label>
                            <div className="relative">
                              <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                size={16}
                              />
                              <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all text-gray-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                              Password *
                            </label>
                            <div className="relative">
                              <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                size={16}
                              />
                              <input
                                required
                                type="password"
                                value={authPassword}
                                onChange={(e) =>
                                  setAuthPassword(e.target.value)
                                }
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all text-gray-900"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full mt-4 bg-[#0B1120] text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <ShieldCheck
                                size={16}
                                className="text-[#22D3EE]"
                              />
                            )}
                            {isLoginMode
                              ? "Verifikasi & Lanjutkan"
                              : "Daftar & Lanjutkan"}
                          </button>
                        </form>

                        <div className="mt-8 text-center border-t border-slate-100 pt-6">
                          <p className="text-xs font-medium text-slate-500">
                            {isLoginMode
                              ? "Belum punya akun?"
                              : "Sudah punya akun?"}{" "}
                            <button
                              onClick={() => setIsLoginMode(!isLoginMode)}
                              type="button"
                              className="text-[#0B1120] font-black hover:text-[#22D3EE] transition-colors ml-1"
                            >
                              {isLoginMode ? "Daftar Instan" : "Login di sini"}
                            </button>
                          </p>
                        </div>
                      </div>
                    ) : (
                      // === TAMPILAN JIKA SUDAH LOGIN (FORM CHECKOUT NORMAL) ===
                      <form
                        id="checkoutForm"
                        onSubmit={handleProcessOrder}
                        className="space-y-8 animate-in fade-in duration-500"
                      >
                        {/* Section: Personal Info */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <CheckCircle2 size={14} />
                            </div>
                            Akun Terverifikasi
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Nama Depan *
                              </label>
                              <input
                                required
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Nama Belakang
                              </label>
                              <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all text-gray-900"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Alamat Email *
                              </label>
                              <div className="relative">
                                <Mail
                                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                  size={16}
                                />
                                <input
                                  readOnly
                                  type="email"
                                  value={email}
                                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-500 cursor-not-allowed"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Nomor WhatsApp *
                              </label>
                              <div className="relative">
                                <Phone
                                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                  size={16}
                                />
                                <input
                                  required
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="0812xxxx"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all text-gray-900"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section: Additional Details */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              <Building size={14} />
                            </div>
                            Data Instansi
                          </h3>
                          <div className="space-y-6">
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Nama Perusahaan / Organisasi (Opsional)
                              </label>
                              <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="PT. Guwigo Teknologi..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Brief Singkat / Catatan (Opsional)
                              </label>
                              <div className="relative">
                                <FileText
                                  className="absolute left-4 top-4 text-slate-400"
                                  size={16}
                                />
                                <textarea
                                  rows={3}
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  placeholder="Jelaskan secara singkat visi sistem yang ingin Anda bangun..."
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-medium focus:outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all resize-none text-gray-900"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* KOLOM KANAN: RINGKASAN & PEMBAYARAN (STICKY) */}
                  <div className="lg:col-span-5">
                    <div
                      className={`bg-white rounded-3xl shadow-xl border overflow-hidden lg:sticky lg:top-8 flex flex-col transition-colors ${currentUser ? "border-slate-200" : "border-slate-100 opacity-80"}`}
                    >
                      <div className="bg-slate-50 p-6 border-b border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                          Summary
                        </p>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                          Detail Transaksi
                        </h3>
                      </div>

                      <div className="p-6">
                        <div className="mb-6">
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                            Layanan Dipilih
                          </p>
                          <p className="text-slate-900 font-black text-lg leading-tight">
                            {selectedProduct.name}
                          </p>
                          <div className="inline-flex mt-2 px-2.5 py-1 bg-[#22D3EE]/10 text-[#0B1120] font-bold text-[10px] uppercase tracking-widest rounded-md border border-[#22D3EE]/20">
                            {selectedPackage.name}
                          </div>
                        </div>

                        <div className="space-y-4 mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                            <span>Biaya Layanan</span>
                            <span>
                              Rp{selectedPackage.price.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold text-slate-500 pb-4 border-b border-slate-200">
                            <span>Siklus Penagihan</span>
                            <span className="uppercase tracking-widest text-[10px]">
                              {selectedPackage.billingPeriod}
                            </span>
                          </div>
                          <div className="flex justify-between items-end pt-2">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                              Total Tagihan
                            </span>
                            <span className="text-xl font-black text-[#0B1120] tracking-tighter">
                              Rp{selectedPackage.price.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        {/* Tampilkan Tombol Bayar HANYA JIKA SUDAH LOGIN */}
                        {currentUser ? (
                          <>
                            <label className="flex items-start gap-3 mb-6 cursor-pointer group bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                                <input
                                  type="checkbox"
                                  required
                                  checked={agreeToTerms}
                                  onChange={(e) =>
                                    setAgreeToTerms(e.target.checked)
                                  }
                                  className="w-4 h-4 peer appearance-none border-2 border-slate-300 rounded focus:outline-none checked:bg-[#0B1120] checked:border-[#0B1120] transition-all cursor-pointer"
                                />
                                <CheckCircle2
                                  size={12}
                                  className="text-[#22D3EE] absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                />
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold leading-relaxed group-hover:text-slate-700 transition-colors">
                                Saya menyatakan bahwa data yang diisi benar dan
                                menyetujui Ketentuan Layanan Guwigo Tech.
                              </span>
                            </label>

                            <button
                              type="submit"
                              disabled={isProcessing || !agreeToTerms}
                              form="checkoutForm"
                              className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-[#0B1120] hover:bg-slate-800 text-[#22D3EE] shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2
                                    size={16}
                                    className="animate-spin text-white"
                                  />{" "}
                                  <span className="text-white">
                                    Memproses...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <CreditCard size={16} /> Lanjutkan Pembayaran
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-center">
                            <p className="text-xs font-bold text-orange-600 mb-1">
                              Menunggu Otentikasi
                            </p>
                            <p className="text-[10px] font-medium text-orange-500">
                              Silakan selesaikan form di sebelah kiri untuk
                              mengaktifkan pembayaran.
                            </p>
                          </div>
                        )}

                        {/* Security Badge */}
                        <div className="mt-5 flex items-center justify-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <ShieldCheck size={12} className="text-[#22D3EE]" />{" "}
                          End-to-End Encryption
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
