"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  CreditCard,
  CheckCircle,
  Download,
  FileText,
  Image as ImageIcon,
  LogOut,
  Upload,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function UndanganAIPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // ALUR APLIKASI
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">(
    "landing",
  );

  // State Form Registrasi
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regWA, setRegWA] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // State Editor Undangan
  const [tuanRumah, setTuanRumah] = useState("Keluarga Bapak Fulan");
  const [jenisAcara, setJenisAcara] = useState("Pernikahan");
  const [namaUtama, setNamaUtama] = useState("Romeo & Juliet");
  const [tanggal, setTanggal] = useState("Minggu, 24 Desember 2026");
  const [waktu, setWaktu] = useState("09.00 WIB - Selesai");
  const [lokasi, setLokasi] = useState("Gedung Serbaguna Guwigo, Yogyakarta");
  const [bingkai, setBingkai] = useState("klasik-hitam");
  const [fotoUpload, setFotoUpload] = useState<string | null>(null);
  const [teksPembuka, setTeksPembuka] = useState(
    "Dengan memohon Rahmat dan Ridho Allah SWT, kami mengharap kehadiran Bapak/Ibu/saudara/i dalam acara pernikahan putra-putri kami.",
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Cek sesi login global dari web utama Guwigo
    const session = localStorage.getItem("guwigo_user_session");
    if (session) {
      setCurrentView("dashboard");
    }
  }, []);

  if (!isMounted) return null;

  // ==========================================
  // FUNGSI CHECKOUT OTOMATIS TRIPAY
  // ==========================================
  const handleCheckoutTripay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tripay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regWA,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        localStorage.setItem("guwigo_temp_pass", "guwigo2026");
        window.location.href = data.checkoutUrl;
      } else {
        alert("Gagal memproses pembayaran: " + (data.detail || data.error));
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan saat menghubungi server pembayaran.");
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("guwigo_user_session");
    router.push("/login");
  };

  // Fungsi Editor
  const handleUploadFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFotoUpload(URL.createObjectURL(file));
  };
  const handleUpdateAI = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 800);
  };
  const handleDownloadPDF = () => window.print();

  // ==========================================
  // VIEW 1: LANDING PAGE & FORM CHECKOUT TRIPAY
  // ==========================================
  if (currentView === "landing") {
    return (
      <div className="bg-[#F8FAFC] min-h-screen pt-36 pb-24 font-sans">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Kiri: Copywriting */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-100">
                <Mail size={16} /> Premium Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Buat Undangan Digital <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Siap Cetak Sekejap.
                </span>
              </h1>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                Akses editor undangan canggih kami. Ubah teks, sesuaikan desain,
                dan langsung download file PDF resolusi tinggi. Sekali bayar,
                akses seumur hidup!
              </p>
              <ul className="space-y-3 text-slate-600 font-medium mb-8 max-w-sm mx-auto md:mx-0 text-left">
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} /> Output
                  PDF Kualitas Cetak (A4)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} /> Bisa
                  Custom Foto & Bingkai
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} /> Tanpa
                  Biaya Bulanan (Lifetime)
                </li>
              </ul>
            </div>

            {/* Kanan: Form Pembayaran Otomatis */}
            <div className="w-full md:w-[400px] bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Beli Akses Premium
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Hanya Rp 49.000 (Sekali Bayar)
              </p>

              <form onSubmit={handleCheckoutTripay} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-blue-500 outline-none"
                    placeholder="Masukkan nama..."
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Email Aktif
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-blue-500 outline-none"
                    placeholder="email@anda.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-blue-500 outline-none"
                    placeholder="0812..."
                    value={regWA}
                    onChange={(e) => setRegWA(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 mt-2">
                  <button
                    disabled={isProcessing}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <CreditCard size={18} />
                    )}
                    {isProcessing
                      ? "Menyiapkan Tagihan..."
                      : "Bayar Otomatis (QRIS / E-Wallet)"}
                  </button>

                  <Link
                    href="/login"
                    className="w-full block text-center text-sm font-bold text-blue-600 mt-4 hover:underline"
                  >
                    Sudah punya akun? Login di sini
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: DASHBOARD EDITOR (GUWIGO THEME)
  // ==========================================
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pt-32 pb-12">
      {/* AKSI DASHBOARD (Diletakkan di bawah Navbar Global agar tidak tertutup) */}
      <div className="container mx-auto px-4 max-w-[1400px] mb-8 print:hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Mail className="text-blue-600" size={24} /> Undangan Studio
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Akses Member Premium Aktif
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Download size={18} /> Cetak PDF (A4)
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-red-600 hover:text-white bg-red-50 hover:bg-red-500 px-6 py-3 rounded-xl border border-red-200 hover:border-red-500 transition-all shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* AREA KERJA (WORKSPACE) */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 max-w-[1400px] print:m-0 print:p-0">
        {/* Panel Kiri: Kontrol Form */}
        <div className="w-full lg:w-[400px] shrink-0 print:hidden space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText size={18} className="text-blue-600" /> Data Undangan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">
                  Tuan Rumah
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={tuanRumah}
                  onChange={(e) => setTuanRumah(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">
                  Jenis Acara
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={jenisAcara}
                  onChange={(e) => setJenisAcara(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">
                  Nama Subjek Acara
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={namaUtama}
                  onChange={(e) => setNamaUtama(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">
                    Tanggal
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">
                    Waktu
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">
                  Lokasi
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ImageIcon size={18} className="text-blue-600" /> Desain & Bingkai
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">
                  Pilih Bingkai
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  value={bingkai}
                  onChange={(e) => setBingkai(e.target.value)}
                >
                  <option value="klasik-hitam">Klasik Hitam Putih</option>
                  <option value="sulur-emas">Sulur Emas Premium</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">
                  Upload Foto (Opsional)
                </label>
                <label className="border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload size={24} className="text-blue-500 mb-2" />
                  <span className="text-xs font-bold text-slate-600">
                    Klik untuk Pilih Foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadFoto}
                  />
                </label>
                {fotoUpload && (
                  <button
                    onClick={() => setFotoUpload(null)}
                    className="text-xs text-red-500 font-bold mt-3 hover:underline w-full text-center"
                  >
                    Hapus Foto Terpilih
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleUpdateAI}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <RefreshCw size={18} />
            )}
            {isGenerating ? "Merapikan Layout..." : "PERBARUI TAMPILAN"}
          </button>
        </div>

        {/* Panel Kanan: Kertas Preview A4 */}
        <div className="flex-1 flex justify-center overflow-x-auto pb-8 print:block print:w-full print:overflow-visible print:pb-0">
          <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl print:shadow-none shrink-0 relative overflow-hidden">
            {/* Dekorasi Bingkai CSS */}
            {bingkai === "klasik-hitam" && (
              <div className="absolute inset-4 border-[6px] border-double border-slate-800 p-1.5 pointer-events-none">
                <div className="w-full h-full border border-slate-800"></div>
              </div>
            )}
            {bingkai === "sulur-emas" && (
              <div className="absolute inset-5 border-4 border-yellow-600 rounded-2xl p-1 pointer-events-none">
                <div className="w-full h-full border-2 border-yellow-500 rounded-xl"></div>
              </div>
            )}

            {/* Isi Kertas Undangan */}
            <div
              className={`relative z-10 px-12 py-20 flex flex-col items-center text-center ${isGenerating ? "opacity-50 blur-[1px]" : "opacity-100 blur-0"} transition-all duration-300`}
            >
              <p className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest border-b border-slate-800 pb-2">
                {tuanRumah}
              </p>
              <h1 className="text-4xl font-serif font-black text-slate-900 mb-2 uppercase tracking-wide">
                Undangan
              </h1>
              <h2 className="text-xl font-serif text-slate-700 mb-10 uppercase tracking-widest">
                {jenisAcara}
              </h2>
              <p className="text-sm text-slate-800 max-w-sm italic mb-8 leading-relaxed font-medium">
                "{teksPembuka}"
              </p>

              <div className="my-2">
                {fotoUpload && (
                  <img
                    src={fotoUpload}
                    alt="Foto"
                    className="w-32 h-32 object-cover rounded-full border-[6px] border-slate-100 mx-auto shadow-lg mb-6"
                  />
                )}
                <h2 className="text-3xl font-black text-slate-900 font-serif mb-2">
                  ~ {namaUtama} ~
                </h2>
              </div>

              <div className="mt-10 mb-12 w-full max-w-sm text-left text-sm text-slate-800 space-y-4 mx-auto bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-start">
                  <span className="w-28 font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Tanggal
                  </span>
                  <span className="w-4 font-bold text-slate-900">:</span>
                  <span className="flex-1 font-bold text-slate-700">
                    {tanggal}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-28 font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Waktu
                  </span>
                  <span className="w-4 font-bold text-slate-900">:</span>
                  <span className="flex-1 font-bold text-slate-700">
                    {waktu}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-28 font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Tempat
                  </span>
                  <span className="w-4 font-bold text-slate-900">:</span>
                  <span className="flex-1 font-bold text-slate-700 leading-snug">
                    {lokasi}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-800 max-w-sm mb-16 leading-relaxed italic font-medium">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila
                Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
              </p>
              <div>
                <p className="text-sm text-slate-600 mb-2 font-medium">
                  Hormat Kami,
                </p>
                <p className="text-base font-black text-slate-900 uppercase tracking-widest">
                  {tuanRumah}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS untuk mengatur hasil cetak PDF agar rapi tanpa elemen UI */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { background: white; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:w-full { width: 100% !important; max-width: none !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:overflow-visible { overflow: visible !important; }
          .print\\:pb-0 { padding-bottom: 0 !important; }
        }
      `,
        }}
      />
    </div>
  );
}
