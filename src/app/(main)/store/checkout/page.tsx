"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartCount } = useCart();

  // State Form Data Pembeli
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  // State Metode Pengiriman
  const [shippingMethod, setShippingMethod] = useState<"shipping" | "cod">(
    "shipping",
  );

  // Redirect jika keranjang kosong
  useEffect(() => {
    if (cartCount === 0) {
      router.push("/store");
    }
  }, [cartCount, router]);

  // Hitung Total
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.11; // PPN 11%
  // Jika COD = Gratis Ongkir (Ambil Sendiri), Jika Kirim = Konfirmasi Admin
  const shippingCost = shippingMethod === "cod" ? 0 : 0;
  const total = subtotal + tax + shippingCost;

  // Format Rupiah
  const toRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  // State Metode Pembayaran
  const [paymentType, setPaymentType] = useState<"midtrans" | "manual" | "whatsapp">("midtrans");
  const [isProcessingMidtrans, setIsProcessingMidtrans] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Bank Info
  const bankInfo = {
    name: process.env.NEXT_PUBLIC_BANK_NAME || "Mandiri",
    number: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO || "1370028404453",
    holder: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "GUWIGO TEKNOLOGI IND",
  };

  const copyRekening = () => {
    navigator.clipboard.writeText(bankInfo.number);
    setCopiedBank(true);
    toast.success("Nomor Rekening Mandiri tersalin!");
    setTimeout(() => setCopiedBank(false), 2500);
  };

  // LOGIC CHECKOUT KE MIDTRANS
  const handleMidtransPayment = async () => {
    if (!formData.name || !formData.phone) {
      toast.error("Mohon lengkapi Nama dan Nomor WhatsApp.");
      return;
    }
    if (shippingMethod === "shipping" && !formData.address) {
      toast.error("Mohon lengkapi Alamat Pengiriman.");
      return;
    }

    try {
      setIsProcessingMidtrans(true);
      const res = await fetch("/api/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: formData.name,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat sesi pembayaran Midtrans");
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error("Tidak ada URL redirect pembayaran Midtrans");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Gagal memproses Midtrans. Silakan coba Transfer Manual.");
    } finally {
      setIsProcessingMidtrans(false);
    }
  };

  // LOGIC CHECKOUT KE WHATSAPP / MANUAL TRANSFER
  const handleCheckout = () => {
    if (!formData.name || !formData.phone) {
      toast.error("Mohon lengkapi Nama dan Nomor WhatsApp.");
      return;
    }
    if (shippingMethod === "shipping" && !formData.address) {
      toast.error("Mohon lengkapi Alamat Pengiriman.");
      return;
    }

    if (paymentType === "midtrans") {
      handleMidtransPayment();
      return;
    }

    // Susun Pesan WhatsApp
    let message = `*Halo Admin Guwigo Store!* 👋%0A`;
    message += `Saya ingin konfirmasi pesanan (${paymentType === "manual" ? "Transfer Manual Bank Mandiri" : "Bayar via Chat"}):%0A%0A`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.quantity}x) - ${toRupiah(item.price * item.quantity)}%0A`;
    });

    message += `%0A--------------------------------%0A`;
    message += `*Subtotal:* ${toRupiah(subtotal)}%0A`;
    message += `*PPN (11%):* ${toRupiah(tax)}%0A`;
    message += `*Total Pembayaran:* ${toRupiah(total)}%0A`;
    message += `%0A--------------------------------%0A`;
    message += `*Data Pembeli:*%0A`;
    message += `Nama: ${formData.name}%0A`;
    message += `No. WA: ${formData.phone}%0A`;
    message += `Metode Pengiriman: *${shippingMethod === "cod" ? "COD (Ambil di Toko)" : "Kirim Ekspedisi"}*%0A`;
    message += `Metode Pembayaran: *${paymentType === "manual" ? "Transfer Manual Mandiri" : "WhatsApp Chat"}*%0A`;

    if (shippingMethod === "shipping") {
      message += `Alamat: ${formData.address}%0A`;
    } else {
      message += `Lokasi COD: *Guwigo HQ (Sardonoharjo)*%0A`;
    }
    message += `Catatan: ${formData.notes || "-"}`;

    const adminPhone = "6285179594146";
    window.open(`https://wa.me/${adminPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324]">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/store/cart"
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Checkout & Pembayaran
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Pilih Midtrans (Instant Gateway), Transfer Manual Mandiri, atau Chat WA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: FORM DATA */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Informasi Kontak */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" /> Informasi Kontak
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Teguh Prayogo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="0812xxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* 2. Metode Pengiriman */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Truck size={18} className="text-blue-600" /> Metode Pengiriman
              </h3>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div
                  onClick={() => setShippingMethod("shipping")}
                  className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    shippingMethod === "shipping" ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      shippingMethod === "shipping" ? "border-blue-600" : "border-slate-300"
                    }`}
                  >
                    {shippingMethod === "shipping" && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Kirim Ekspedisi</h4>
                    <p className="text-xs text-slate-500">JNE / J&T / SiCepat</p>
                  </div>
                </div>

                <div
                  onClick={() => setShippingMethod("cod")}
                  className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    shippingMethod === "cod" ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      shippingMethod === "cod" ? "border-blue-600" : "border-slate-300"
                    }`}
                  >
                    {shippingMethod === "cod" && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">COD / Ambil Sendiri</h4>
                    <p className="text-xs text-slate-500">Guwigo HQ (Sardonoharjo)</p>
                  </div>
                </div>
              </div>

              {shippingMethod === "shipping" ? (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Alamat Lengkap Pengiriman
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                </div>
              ) : (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 animate-fade-in">
                  <h4 className="text-sm font-bold text-orange-800 mb-1 flex items-center gap-2">
                    <MapPin size={16} /> Lokasi COD
                  </h4>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Guwigo HQ (Sardonoharjo, Sleman, Yogyakarta). Admin akan mengirimkan Share Location resmi via WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Pilihan Metode Pembayaran */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-blue-600" /> Metode Pembayaran
              </h3>

              {/* Pilihan 1: Midtrans Gateway */}
              <div
                onClick={() => setPaymentType("midtrans")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  paymentType === "midtrans" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentType === "midtrans" ? "border-blue-600" : "border-slate-300"
                    }`}
                  >
                    {paymentType === "midtrans" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Midtrans Payment Gateway (Otomatis & Real-time)
                    </h4>
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Instan
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mendukung QRIS (GoPay, OVO, ShopeePay, DANA), Virtual Account BCA/Mandiri/BNI/BRI, dan Kartu Kredit.
                  </p>
                </div>
              </div>

              {/* Pilihan 2: Transfer Manual */}
              <div
                onClick={() => setPaymentType("manual")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  paymentType === "manual" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentType === "manual" ? "border-blue-600" : "border-slate-300"
                    }`}
                  >
                    {paymentType === "manual" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Transfer Bank Manual ({bankInfo.name})
                    </h4>
                    <span className="bg-emerald-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Direct Rekening
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Transfer langsung ke rekening Bank Mandiri resmi Guwigo lalu konfirmasi via WhatsApp.
                  </p>

                  {paymentType === "manual" && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Bank {bankInfo.name}
                          </p>
                          <p className="text-lg font-black text-slate-900 tracking-wider">
                            {bankInfo.number}
                          </p>
                          <p className="text-xs font-bold text-slate-700">
                            a.n. {bankInfo.holder}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyRekening();
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          {copiedBank ? "Tersalin!" : "Salin No. Rek"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pilihan 3: Konfirmasi Chat WA */}
              <div
                onClick={() => setPaymentType("whatsapp")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  paymentType === "whatsapp" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentType === "whatsapp" ? "border-blue-600" : "border-slate-300"
                    }`}
                  >
                    {paymentType === "whatsapp" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Diskusi & Bayar via WhatsApp
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Hubungi Admin langsung untuk negosiasi atau konsultasi sebelum membayar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 sticky top-32 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Rincian Pembayaran
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>Total Harga ({items.length} item)</span>
                  <span className="font-medium text-slate-900">
                    {toRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>PPN (11%)</span>
                  <span className="font-medium text-slate-900">
                    {toRupiah(tax)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>Ongkos Kirim</span>
                  <span className="font-bold text-green-600">
                    {shippingMethod === "cod" ? "Gratis (COD)" : "Info via WA"}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">
                    Total Bayar
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600 block">
                      {toRupiah(total)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessingMidtrans}
                className={`w-full font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg ${
                  paymentType === "midtrans"
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                }`}
              >
                {isProcessingMidtrans ? (
                  "Memproses Pembayaran..."
                ) : paymentType === "midtrans" ? (
                  <>
                    Bayar via Midtrans <CreditCard size={18} />
                  </>
                ) : (
                  <>
                    Konfirmasi via WhatsApp <MessageSquare size={18} />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <ShieldCheck
                  size={20}
                  className="text-slate-400 shrink-0 mt-0.5"
                />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Transaksi Anda terenkripsi aman. Guwigo menjamin keamanan data dan transaksi perbankan Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
