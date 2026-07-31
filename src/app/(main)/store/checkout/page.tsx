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

  // LOGIC CHECKOUT KE WHATSAPP
  const handleCheckout = () => {
    // 1. Validasi Form
    if (!formData.name || !formData.phone) {
      toast.error("Mohon lengkapi Nama dan Nomor WhatsApp.");
      return;
    }
    if (shippingMethod === "shipping" && !formData.address) {
      toast.error("Mohon lengkapi Alamat Pengiriman.");
      return;
    }

    // 2. Susun Pesan WhatsApp
    let message = `*Halo Admin Guwigo Store!* 👋%0A`;
    message += `Saya ingin checkout pesanan:%0A%0A`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.quantity}x) - ${toRupiah(item.price * item.quantity)}%0A`;
    });

    message += `%0A--------------------------------%0A`;
    message += `*Subtotal:* ${toRupiah(subtotal)}%0A`;
    message += `*PPN (11%):* ${toRupiah(tax)}%0A`;
    message += `*Total Sementara:* ${toRupiah(total)}%0A`;
    message += `%0A--------------------------------%0A`;
    message += `*Data Pembeli:*%0A`;
    message += `Nama: ${formData.name}%0A`;
    message += `No. WA: ${formData.phone}%0A`;
    message += `Metode: *${shippingMethod === "cod" ? "COD (Ambil di Toko)" : "Kirim Ekspedisi (JNE/J&T)"}*%0A`;

    if (shippingMethod === "shipping") {
      message += `Alamat: ${formData.address}%0A`;
      message += `*(Mohon info ongkir ke alamat tersebut)*%0A`;
    } else {
      message += `Lokasi COD: *Guwigo HQ (Sardonoharjo)*%0A`;
      message += `Catatan: ${formData.notes || "-"}`;
    }

    // 3. Redirect ke WhatsApp
    // Ganti nomor ini dengan nomor WhatsApp Bisnis Anda (format 628...)
    const adminPhone = "6285179594146";
    window.open(`https://wa.me/${adminPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/store/cart"
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">
            Checkout Securely
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: FORM DATA */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Informasi Kontak */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" /> Informasi
                Kontak
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

            {/* 2. Metode Pengiriman (COD Logic) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Truck size={18} className="text-blue-600" /> Metode Pengiriman
              </h3>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Option: Shipping */}
                <div
                  onClick={() => setShippingMethod("shipping")}
                  className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                                ${shippingMethod === "shipping" ? "border-blue-600 bg-blue-50" : "border-slate-100 hover:border-slate-300"}
                            `}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${shippingMethod === "shipping" ? "border-blue-600" : "border-slate-300"}
                            `}
                  >
                    {shippingMethod === "shipping" && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Kirim Ekspedisi
                    </h4>
                    <p className="text-xs text-slate-500">
                      JNE / J&T / SiCepat
                    </p>
                  </div>
                </div>

                {/* Option: COD */}
                <div
                  onClick={() => setShippingMethod("cod")}
                  className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                                ${shippingMethod === "cod" ? "border-blue-600 bg-blue-50" : "border-slate-100 hover:border-slate-300"}
                            `}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${shippingMethod === "cod" ? "border-blue-600" : "border-slate-300"}
                            `}
                  >
                    {shippingMethod === "cod" && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      COD / Ambil Sendiri
                    </h4>
                    <p className="text-xs text-slate-500">Bayar saat bertemu</p>
                  </div>
                </div>
              </div>

              {/* Conditional Input based on Method */}
              {shippingMethod === "shipping" ? (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-2">
                    <AlertCircle size={12} /> Ongkos kirim akan dihitung admin
                    via WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 animate-fade-in">
                  <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                    <MapPin size={16} /> Lokasi Aman COD
                  </h4>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Demi keamanan bersama, COD hanya dilayani di: <br />
                    <strong>Guwigo HQ (Sardonoharjo)</strong> atau{" "}
                    <strong>Indomaret Point terdekat</strong>.
                    <br />
                    Admin akan mengirimkan Share Location via WhatsApp.
                  </p>
                  <input
                    type="text"
                    placeholder="Catatan tambahan (misal: jam berapa mau datang)"
                    className="w-full mt-3 bg-white border border-orange-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              )}
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
                  <span>Total Harga Barang</span>
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
                    {shippingMethod === "cod" ? "Gratis" : "Cek via WA"}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">
                    Total Tagihan
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-black text-blue-600 block">
                      {toRupiah(total)}
                    </span>
                    {shippingMethod === "shipping" && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        + Ongkir
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-600/20"
              >
                Konfirmasi via WhatsApp <MessageSquare size={18} />
              </button>

              <div className="mt-6 flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <ShieldCheck
                  size={20}
                  className="text-slate-400 shrink-0 mt-0.5"
                />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Transaksi Anda aman. Pembayaran dilakukan setelah konfirmasi
                  ketersediaan stok & ongkir dengan Admin resmi Guwigo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
