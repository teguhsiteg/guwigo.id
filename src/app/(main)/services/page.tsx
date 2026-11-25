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
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* ==========================================
            HEADER / HERO SECTION (DYNAMIC)
        ========================================== */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <span className="text-[#2563EB] font-medium tracking-[0.2em] text-xs uppercase mb-3 block">
              {branding.tagline || "Enterprise Solutions"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#0F172A] mb-6 tracking-tight leading-[1.1] font-normal">
              {branding.title.includes("Guwigo") ? (
                <>
                  Guwigo <br />
                  <span className="italic text-[#2563EB]">
                    {branding.title
                      .replace("Guwigo\n", "")
                      .replace("Guwigo", "")}
                  </span>
                </>
              ) : (
                branding.title
              )}
            </h1>
            <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              {branding.subtitle}
            </p>
          </div>

          {/* Abstract Hero Graphic - Menggunakan Favicon Guwigo */}
          <div className="hidden lg:flex relative w-80 h-80 items-center justify-center animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <div className="relative w-56 h-56 drop-shadow-md">
              <Image
                src="/images/branding/loader.png"
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
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin text-[#2563EB]" />
          </div>
        ) : productsData.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-lg max-w-3xl mx-auto border border-[#E2E8F0]">
            <Layers size={48} className="text-[#94A3B8] mx-auto mb-4" />
            <h3 className="text-xl font-serif font-normal text-[#0F172A] mb-2 tracking-tight">
              Katalog Sedang Disusun
            </h3>
            <p className="text-sm text-[#64748B]">
              Saat ini belum ada layanan publik yang tersedia. Hubungi tim
              representatif kami untuk proyek kustom.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {categories.map((cat, idx) => (
              <div
                key={cat as string}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-serif text-[#0F172A] tracking-tight font-normal">
                    {cat as string}
                  </h2>
                  <div className="h-px bg-[#E2E8F0] flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsData
                    .filter((p) => p.category === cat)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg p-6 border border-[#E2E8F0] hover:shadow-md hover:border-[#2563EB]/40 transition-all duration-200 cursor-pointer flex flex-col"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="h-48 bg-[#FAF9F6] rounded-md mb-5 relative overflow-hidden flex items-center justify-center border border-[#E2E8F0]">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-contain p-4"
                            />
                          ) : (
                            <Layers size={44} className="text-[#94A3B8]" />
                          )}
                        </div>

                        <div className="flex flex-col flex-1">
                          <h3 className="text-lg font-serif font-normal text-[#0F172A] mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#64748B] leading-relaxed mb-6 flex-1 line-clamp-3 font-normal">
                            {product.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                            <span className="text-xs font-medium text-[#64748B]">
                              {product.packages?.length || 0} Pilihan Paket
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                              <ChevronRight size={15} />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A0F1D]/60 backdrop-blur-sm">
          <div className="bg-[#FAF9F6] w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl relative flex flex-col border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="bg-white border-b border-[#E2E8F0] p-6 flex justify-between items-center z-10 shrink-0">
              <div>
                <h2 className="text-2xl font-serif font-normal text-[#0F172A] tracking-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Pilih Paket Layanan
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F1F5F9]"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content Modal (Pricing Cards) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {!selectedProduct.packages ||
              selectedProduct.packages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-[#E2E8F0]">
                  <p className="text-sm text-[#64748B]">
                    Harga belum tersedia.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedProduct.packages.map((pkg, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-lg p-7 flex flex-col h-full border ${
                        pkg.isPopular ? "border-[#2563EB] shadow-md relative" : "border-[#E2E8F0]"
                      }`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2563EB] text-white px-3 py-0.5 rounded-md text-[11px] font-medium shadow-sm">
                          Rekomendasi
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-lg font-serif font-normal text-[#0F172A] mb-2">
                          {pkg.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-serif text-[#0F172A]">
                            {pkg.price === 0
                              ? "Gratis"
                              : `Rp${pkg.price.toLocaleString("id-ID")}`}
                          </span>
                          <span className="text-xs text-[#64748B]">
                            / {pkg.billingPeriod}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-3.5 mb-8 flex-1 border-t border-[#E2E8F0] pt-6">
                        {pkg.features?.map((feat) => (
                          <li key={feat.id} className="flex items-start gap-2.5">
                            {feat.isIncluded ? (
                              <CheckCircle2
                                size={16}
                                className="text-[#2563EB] shrink-0 mt-0.5"
                              />
                            ) : (
                              <X
                                size={16}
                                className="text-[#94A3B8] shrink-0 mt-0.5"
                              />
                            )}
                            <span
                              className={`text-xs leading-relaxed ${
                                feat.isIncluded
                                  ? "text-[#0F172A]"
                                  : "text-[#94A3B8] line-through"
                              }`}
                            >
                              {feat.name}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleOpenCheckout(pkg)}
                          className={`w-full py-3 rounded-md text-xs font-medium uppercase tracking-wider transition-colors ${
                            pkg.isPopular
                              ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm"
                              : "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#E2E8F0]"
                          }`}
                        >
                          {pkg.actionType === "whatsapp" ? (
                            "Konsultasi WA"
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
      {selectedPackage && selectedProduct && selectedPackage.actionType === "checkout" && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A0F1D]/60 backdrop-blur-sm">
          <div className="bg-[#FAF9F6] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative flex flex-col border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200">
            {/* Header Checkout */}
            <div className="bg-white border-b border-[#E2E8F0] p-6 flex justify-between items-center z-10 shrink-0">
              <div>
                <h2 className="text-2xl font-serif font-normal text-[#0F172A] tracking-tight">
                  {currentUser ? "Konfirmasi Pesanan" : "Masuk Akun"}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F1F5F9]"
              >
                <X size={22} />
              </button>
            </div>

              {/* Content Checkout */}
              <div className="flex-1 p-6 md:p-8">
                {checkoutError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-100 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {checkoutError}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* KOLOM KIRI */}
                  <div className="space-y-6">
                      <form id="checkoutForm" onSubmit={handleProcessOrder} className="bg-white rounded-lg p-6 space-y-4 border border-[#E2E8F0]">
                        <h3 className="text-base font-serif font-normal text-[#0F172A] mb-4">
                          Detail Pemesan
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            required
                            type="text"
                            placeholder="Nama Depan"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Nama Belakang"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:outline-none"
                          />
                        </div>
                        <input
                          required
                          type="email"
                          placeholder="Alamat Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:outline-none"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            required
                            type="tel"
                            placeholder="Nomor WhatsApp"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full col-span-2 bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Nama Perusahaan (Opsional)"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full col-span-2 bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:outline-none"
                          />
                          <textarea
                            rows={3}
                            placeholder="Catatan Tambahan (Opsional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full col-span-2 bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:outline-none resize-none"
                          ></textarea>
                        </div>
                      </form>
                  </div>

                  {/* KOLOM KANAN */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 border border-[#E2E8F0]">
                      <h3 className="text-base font-serif font-normal text-[#0F172A] mb-4">
                        Ringkasan Pesanan
                      </h3>

                      <div className="bg-[#FAF9F6] p-4 rounded-md mb-6 border border-[#E2E8F0]">
                        <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1">
                          Layanan Dipilih
                        </p>
                        <p className="text-sm font-serif font-normal text-[#0F172A]">
                          {selectedProduct.name} - {selectedPackage.name}
                        </p>
                      </div>

                      <div className="border-t border-[#E2E8F0] pt-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#64748B] text-xs">Subtotal</span>
                          <span className="text-[#0F172A] text-sm font-medium">
                            Rp{selectedPackage.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[#64748B] text-xs">Biaya Administrasi</span>
                          <span className="text-[#0F172A] text-xs font-medium">Gratis</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]">
                          <span className="font-medium text-[#0F172A] text-sm">Total Pembayaran</span>
                          <span className="text-lg font-serif text-[#2563EB]">
                            Rp{selectedPackage.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mb-6">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-[#2563EB] border-[#E2E8F0] rounded focus:ring-[#2563EB]"
                        />
                        <label className="text-xs text-[#64748B]">
                          Saya setuju dengan Ketentuan Layanan.
                        </label>
                      </div>
                      <button
                        form="checkoutForm"
                        type="submit"
                        disabled={isProcessing || !agreeToTerms}
                        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#E2E8F0] disabled:text-[#94A3B8] text-white py-3 rounded-md text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        {isProcessing ? "Memproses..." : "Lanjutkan Pembayaran"}
                      </button>
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
