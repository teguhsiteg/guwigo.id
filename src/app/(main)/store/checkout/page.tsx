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
  QrCode,
  Building2,
  X,
  Copy,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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
  const [paymentType, setPaymentType] = useState<string>("xendit_qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Success Modal State
  const [paymentResult, setPaymentResult] = useState<any>(null);

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

  // LOGIC CHECKOUT KE XENDIT
  const handleXenditPayment = async (method: string) => {
    try {
      setIsProcessing(true);
      const res = await fetch("/api/xendit/payment_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: "customer@guwigo.com", // Opsional, bisa dari state kalau ada
          paymentMethod: method, // "qris", "BCA", "MANDIRI", "BNI", "BRI"
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pembayaran");
      }

      if (data.success && data.paymentAction) {
        setPaymentResult({
          orderId: data.orderId,
          ...data.paymentAction,
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Gagal memproses pembayaran. Coba metode lain.");
    } finally {
      setIsProcessing(false);
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

    if (paymentType.startsWith("xendit_")) {
      const method = paymentType.split("_")[1];
      handleXenditPayment(method === "qris" ? "qris" : method.toUpperCase());
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
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A]">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/store/cart"
            className="flex items-center justify-center w-10 h-10 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#0F172A] tracking-tight">
              Checkout
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: FORM DATA */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Informasi Kontak */}
            <div className="bg-white p-8 rounded-lg border border-[#E2E8F0] shadow-sm">
              <h3 className="font-serif text-xl font-normal text-[#0F172A] mb-6">
                Informasi Kontak
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#64748B]">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Teguh Prayogo"
                    className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3.5 text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#64748B]">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="0812xxxx"
                    className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3.5 text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* 2. Metode Pengiriman */}
            <div className="bg-white p-8 rounded-lg border border-[#E2E8F0] shadow-sm">
              <h3 className="font-serif text-xl font-normal text-[#0F172A] mb-6">
                Metode Pengiriman
              </h3>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div
                  onClick={() => setShippingMethod("shipping")}
                  className={`flex-1 p-4 rounded-md cursor-pointer transition-all flex items-center gap-3 ${
                    shippingMethod === "shipping" ? "bg-[#2563EB]/10 border border-[#2563EB]" : "bg-[#FAF9F6] border border-[#E2E8F0]"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${shippingMethod === "shipping" ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                    {shippingMethod === "shipping" && <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full"></div>}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0F172A] text-[15px]">Kirim Ekspedisi</h4>
                  </div>
                </div>

                <div
                  onClick={() => setShippingMethod("cod")}
                  className={`flex-1 p-4 rounded-md cursor-pointer transition-all flex items-center gap-3 ${
                    shippingMethod === "cod" ? "bg-[#2563EB]/10 border border-[#2563EB]" : "bg-[#FAF9F6] border border-[#E2E8F0]"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${shippingMethod === "cod" ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                    {shippingMethod === "cod" && <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full"></div>}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0F172A] text-[15px]">Ambil Sendiri</h4>
                  </div>
                </div>
              </div>

              {shippingMethod === "shipping" ? (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-[13px] font-medium text-[#64748B]">
                    Alamat Lengkap Pengiriman
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                    className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-md px-4 py-3.5 text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                </div>
              ) : (
                <div className="bg-[#FAF9F6] p-4 rounded-md border border-[#E2E8F0] animate-fade-in">
                  <h4 className="text-[15px] font-semibold text-[#0F172A] mb-1">
                    Lokasi Pengambilan
                  </h4>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">
                    Guwigo HQ (Sardonoharjo, Sleman, Yogyakarta). Admin akan mengirimkan Share Location resmi via WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Pilihan Metode Pembayaran */}
            <div className="bg-white p-8 rounded-lg border border-[#E2E8F0] shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-normal text-[#0F172A] mb-6">
                Metode Pembayaran
              </h3>

              {/* Pilihan: QRIS */}
              <div
                onClick={() => setPaymentType("xendit_qris")}
                className={`p-4 rounded-md cursor-pointer transition-all flex items-center gap-4 ${
                  paymentType === "xendit_qris" ? "bg-[#2563EB]/10 border border-[#2563EB]" : "bg-[#FAF9F6] border border-[#E2E8F0]"
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${paymentType === "xendit_qris" ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                  {paymentType === "xendit_qris" && <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0F172A] text-[15px] flex items-center gap-2">
                    QRIS (GoPay, OVO, DANA)
                  </h4>
                </div>
              </div>

              {/* Pilihan: Virtual Accounts */}
              {["BCA", "Mandiri", "BNI", "BRI"].map((bank) => {
                const key = `xendit_${bank.toLowerCase()}`;
                return (
                  <div
                    key={key}
                    onClick={() => setPaymentType(key)}
                    className={`p-4 rounded-md cursor-pointer transition-all flex items-center gap-4 ${
                      paymentType === key ? "bg-[#2563EB]/10 border border-[#2563EB]" : "bg-[#FAF9F6] border border-[#E2E8F0]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${paymentType === key ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                      {paymentType === key && <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#0F172A] text-[15px] flex items-center gap-2">
                        {bank} Virtual Account
                      </h4>
                    </div>
                  </div>
                );
              })}

              {/* Pilihan 2: Transfer Manual */}
              <div
                onClick={() => setPaymentType("manual")}
                className={`p-4 rounded-md cursor-pointer transition-all flex items-center gap-4 ${
                  paymentType === "manual" ? "bg-[#2563EB]/10 border border-[#2563EB]" : "bg-[#FAF9F6] border border-[#E2E8F0]"
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${paymentType === "manual" ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                  {paymentType === "manual" && <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0F172A] text-[15px]">
                    Transfer Bank Manual ({bankInfo.name})
                  </h4>

                  {paymentType === "manual" && (
                    <div className="mt-4 p-4 bg-white rounded-md border border-[#E2E8F0] animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-medium text-[#86868B]">
                            Bank {bankInfo.name}
                          </p>
                          <p className="text-lg font-semibold text-[#0F172A]">
                            {bankInfo.number}
                          </p>
                          <p className="text-[13px] text-[#64748B]">
                            a.n. {bankInfo.holder}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyRekening();
                          }}
                          className="px-4 py-2 bg-[#FAF9F6] hover:bg-[#F1F5F9] text-[#0F172A] text-[13px] font-medium rounded-md border border-[#E2E8F0] transition-colors"
                        >
                          {copiedBank ? "Tersalin" : "Salin"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pilihan 3: Konfirmasi Chat WA */}
              <div
                onClick={() => setPaymentType("whatsapp")}
                className={`p-4 rounded-md cursor-pointer transition-all flex items-center gap-4 ${
                  paymentType === "whatsapp" ? "bg-[#2563EB]/10 border border-[#2563EB]" : "bg-[#FAF9F6] border border-[#E2E8F0]"
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${paymentType === "whatsapp" ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                  {paymentType === "whatsapp" && <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0F172A] text-[15px]">
                    Diskusi & Bayar via WhatsApp
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg border border-[#E2E8F0] shadow-sm sticky top-32">
              <h3 className="font-serif text-xl font-normal text-[#0F172A] mb-6">
                Rincian Pembayaran
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#64748B] text-[15px]">
                  <span>Total Harga ({items.length} item)</span>
                  <span className="text-[#0F172A] font-medium">
                    {toRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B] text-[15px]">
                  <span>PPN (11%)</span>
                  <span className="text-[#0F172A] font-medium">
                    {toRupiah(tax)}
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B] text-[15px]">
                  <span>Ongkos Kirim</span>
                  <span className="text-[#0F172A] font-medium">
                    {shippingMethod === "cod" ? "Gratis" : "Info via WA"}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#0F172A]">
                    Total Bayar
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-serif text-[#0F172A] block">
                      {toRupiah(total)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3.5 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  "Memproses..."
                ) : paymentType.startsWith("xendit_") ? (
                  "Bayar Sekarang"
                ) : (
                  "Konfirmasi via WhatsApp"
                )}
              </button>

              <div className="mt-6 flex items-start gap-3 justify-center">
                <ShieldCheck
                  size={16}
                  className="text-[#64748B] shrink-0 mt-0.5"
                />
                <p className="text-[12px] text-[#64748B] leading-relaxed max-w-[200px] text-center">
                  Transaksi Anda terenkripsi aman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PEMBAYARAN SUKSES (QRIS / VA) */}
      {paymentResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0F1D]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#FAF9F6] border border-[#E2E8F0] w-full max-w-sm rounded-lg overflow-hidden shadow-2xl relative">
            <button
              onClick={() => {
                setPaymentResult(null);
                router.push("/store");
              }}
              className="absolute top-4 right-4 p-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center border-b border-[#E2E8F0]">
              <h2 className="font-serif text-2xl font-normal text-[#0F172A] mb-1">Menunggu Pembayaran</h2>
              <p className="text-[13px] text-[#64748B]">
                Order ID: {paymentResult.orderId}
              </p>
            </div>

            <div className="px-8 py-8 flex flex-col items-center">
              {paymentResult.type === "qris" && (
                <>
                  <p className="text-[13px] text-[#64748B] mb-4 text-center">Scan QRIS menggunakan aplikasi E-Wallet atau M-Banking Anda:</p>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E2E8F0]">
                    <QRCodeSVG value={paymentResult.qrString} size={200} />
                  </div>
                </>
              )}

              {paymentResult.type === "va" && (
                <>
                  <p className="text-[13px] text-[#64748B] mb-2">
                    Transfer ke {paymentResult.bank} Virtual Account:
                  </p>
                  <div className="w-full bg-white border border-[#E2E8F0] rounded-lg p-5 flex items-center justify-between mt-2 shadow-sm">
                    <span className="text-xl font-semibold text-[#0F172A] tracking-wide">
                      {paymentResult.vaNumber}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(paymentResult.vaNumber);
                        toast.success("Nomor VA berhasil disalin!");
                      }}
                      className="p-2 text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                      title="Salin Nomor VA"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 bg-white border-t border-[#E2E8F0]">
              <p className="text-[12px] text-center text-[#64748B]">
                Sistem kami akan mendeteksi pembayaran Anda secara otomatis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
