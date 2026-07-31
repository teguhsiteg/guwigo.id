"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Download,
  Link2,
  Type,
  Smartphone,
  Zap,
  ShieldCheck,
  Infinity,
  Loader2,
  Wand2,
} from "lucide-react";

export default function QRCodeGeneratorPage() {
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("link");

  // State untuk efek Profesional
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  // Fungsi saat user mengetik (Reset QR Code)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value);
    setIsGenerated(false); // Sembunyikan QR jika data diubah
  };

  // Fungsi ganti tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setInputValue("");
    setIsGenerated(false);
  };

  // Fungsi Simulasi Loading Generate
  const handleGenerate = () => {
    if (!inputValue.trim()) return;

    setIsGenerating(true);
    // Simulasi proses pembuatan (1.5 detik) agar terasa canggih
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 1500);
  };

  // Fungsi Download
  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `Guwigo_QR_${activeTab}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION EKSKLUSIF (DARK PREMIUM THEME)
      ========================================== */}
      <section className="bg-[#0B1324] pt-40 pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        {/* Background Visual Effects (Glowing Horizon) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
          {/* Center Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00D4FF]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black text-[#00D4FF] uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            Guwigo Free Tools
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Premium QR Code <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-blue-500">
              Generator.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Buat arsitektur kode QR berkualitas tinggi untuk tautan, teks, atau
            kontak WhatsApp secara instan. Sistem kami memproses tanpa masa
            kedaluwarsa.
          </p>

          {/* 3 Keunggulan */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-8 mt-8 border-t border-white/10 pt-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
              <Infinity size={16} className="text-[#00D4FF]" /> Tanpa Kadaluarsa
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
              <Zap size={16} className="text-yellow-400" /> Generate Instan
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={16} className="text-emerald-400" /> 100%
              Offline & Aman
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. THE TOOL (GENERATOR SECTION)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/5 overflow-hidden border border-slate-200 flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
          {/* BAGIAN KIRI: INPUT FORM */}
          <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 bg-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF]">
                <Wand2 size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Mulai Buat QR Code
              </h2>
            </div>

            {/* TABS KATEGORI */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-10 bg-slate-50 p-2 rounded-2xl border border-slate-200/60 shadow-inner">
              <button
                onClick={() => handleTabChange("link")}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${activeTab === "link" ? "bg-white text-[#0B1324] shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"}`}
              >
                <Link2
                  size={16}
                  className={activeTab === "link" ? "text-[#00D4FF]" : ""}
                />{" "}
                URL
              </button>
              <button
                onClick={() => handleTabChange("wa")}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${activeTab === "wa" ? "bg-white text-[#0B1324] shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"}`}
              >
                <Smartphone
                  size={16}
                  className={activeTab === "wa" ? "text-emerald-500" : ""}
                />{" "}
                WhatsApp
              </button>
              <button
                onClick={() => handleTabChange("text")}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${activeTab === "text" ? "bg-white text-[#0B1324] shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"}`}
              >
                <Type
                  size={16}
                  className={activeTab === "text" ? "text-purple-500" : ""}
                />{" "}
                Teks
              </button>
            </div>

            {/* AREA INPUT */}
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">
                  {activeTab === "link"
                    ? "Masukkan Tautan Web Anda"
                    : activeTab === "wa"
                      ? "Nomor WhatsApp Tujuan"
                      : "Ketik Teks Pesan Anda"}
                </label>

                {activeTab === "text" ? (
                  <textarea
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none transition-all resize-none shadow-sm"
                    placeholder="Contoh: Kode Wi-Fi rumah saya adalah..."
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="relative">
                    {activeTab === "wa" && (
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        wa.me/
                      </div>
                    )}
                    <input
                      type="text"
                      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none transition-all shadow-sm ${activeTab === "wa" ? "pl-20 pr-5" : "px-5"}`}
                      placeholder={
                        activeTab === "link"
                          ? "https://youtube.com/..."
                          : "6281234567890"
                      }
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              {/* TOMBOL GENERATE (AKSI UTAMA) */}
              <button
                onClick={handleGenerate}
                disabled={!inputValue.trim() || isGenerating || isGenerated}
                className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  isGenerated
                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                    : "bg-[#0B1324] hover:bg-slate-800 text-[#00D4FF] shadow-slate-900/20"
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-white" />{" "}
                    <span className="text-white">Meracik QR Code...</span>
                  </>
                ) : isGenerated ? (
                  <>
                    <ShieldCheck size={18} className="text-white" />{" "}
                    <span className="text-white">QR Code Berhasil Dibuat</span>
                  </>
                ) : (
                  <>
                    <QrCode size={18} /> Generate QR Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* BAGIAN KANAN: PREVIEW QR CODE */}
          <div className="w-full md:w-[450px] bg-slate-50 p-8 md:p-12 flex flex-col items-center justify-center text-center border-l border-slate-100 relative overflow-hidden">
            {/* Dekorasi Latar Belakang Area QR */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div
              className={`w-full max-w-[280px] aspect-square rounded-[2rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center p-6 mb-8 relative transition-all duration-500 z-10 ${isGenerated ? "shadow-[0_0_40px_rgba(0,212,255,0.2)] border-[#00D4FF]/30" : ""}`}
            >
              {/* STATE 1: KOSONG / BELUM GENERATE */}
              {!isGenerated && !isGenerating && (
                <div className="text-slate-400 flex flex-col items-center gap-4 opacity-60">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
                    <QrCode
                      size={40}
                      strokeWidth={1.5}
                      className="text-slate-400"
                    />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest px-4 text-slate-500 text-balance">
                    Menunggu Input Data
                  </p>
                </div>
              )}

              {/* STATE 2: LOADING EFFECT */}
              {isGenerating && (
                <div className="absolute inset-0 bg-white/90 rounded-[2rem] backdrop-blur-md flex flex-col items-center justify-center text-[#00D4FF] z-10 border border-[#00D4FF]/20">
                  <Loader2 size={40} className="animate-spin mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse text-[#0B1324]">
                    Memproses Matrix...
                  </p>
                </div>
              )}

              {/* STATE 3: QR CODE MUNCUL */}
              <div
                className={`transition-all duration-700 ease-out ${isGenerated ? "opacity-100 scale-100" : "opacity-0 scale-90 absolute"}`}
                ref={qrRef}
              >
                {/* Pastikan input tidak kosong sebelum render Canvas untuk menghindari error qrcode.react */}
                {(isGenerated || isGenerating) && (
                  <QRCodeCanvas
                    value={
                      activeTab === "wa"
                        ? `https://wa.me/${inputValue.replace(/\D/g, "")}`
                        : inputValue
                    }
                    size={220}
                    bgColor={"#FFFFFF"}
                    fgColor={"#0B1324"} // Menggunakan Midnight Navy untuk kode
                    level={"H"}
                    includeMargin={true}
                    style={{ borderRadius: "16px" }}
                  />
                )}
              </div>
            </div>

            <div className="w-full space-y-4 relative z-10">
              <button
                onClick={downloadQRCode}
                disabled={!isGenerated}
                className="w-full bg-[#00D4FF] hover:bg-[#00c2ea] text-[#0B1324] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00D4FF]/20 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <Download size={16} /> Download Resolusi Tinggi
              </button>

              {isGenerated && (
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-center gap-1.5 items-center mt-4">
                  <ShieldCheck size={14} className="text-emerald-500" /> Siap
                  digunakan untuk print & digital
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
