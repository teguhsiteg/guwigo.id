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

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value);
    setIsGenerated(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setInputValue("");
    setIsGenerated(false);
  };

  const handleGenerate = () => {
    if (!inputValue.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 600);
  };

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
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION (EDITORIAL BRAND THEME)
      ========================================== */}
      <section className="pt-36 md:pt-44 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center border-b border-[#E2E8F0] text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#2563EB]/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-medium text-[#1D4ED8] mb-6 shadow-sm">
            <QrCode size={13} className="text-[#2563EB]" /> Free Utility Tool
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0F172A] mb-5 tracking-tight leading-[1.1] font-normal">
            High-Resolution QR Code <br />
            <span className="italic text-[#2563EB]">Generator.</span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            Hasilkan QR Code berkualitas tinggi untuk tautan web, nomor WhatsApp, atau teks informasi dalam format PNG siap cetak tanpa masa kedaluwarsa.
          </p>

          {/* 3 Keunggulan */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-sm">
              <Infinity size={14} className="text-[#2563EB]" /> Tanpa Kedaluwarsa
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-sm">
              <Zap size={14} className="text-amber-500" /> Generate Instan
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-sm">
              <ShieldCheck size={14} className="text-emerald-500" /> 100% Aman & Lokal
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. THE TOOL (GENERATOR SECTION)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 py-14 relative z-20">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-[#E2E8F0] flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* BAGIAN KIRI: INPUT FORM */}
          <div className="flex-1 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Wand2 size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] tracking-tight">
                  Parameter QR Code
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Pilih tipe konten dan masukkan data tujuan
                </p>
              </div>
            </div>

            {/* TABS KATEGORI */}
            <div className="flex gap-2 mb-8 bg-[#FAF9F6] p-1.5 rounded-lg border border-[#E2E8F0]">
              <button
                onClick={() => handleTabChange("link")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "link"
                    ? "bg-white text-[#2563EB] shadow-sm border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Link2 size={14} /> URL / Tautan
              </button>
              <button
                onClick={() => handleTabChange("wa")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "wa"
                    ? "bg-white text-emerald-600 shadow-sm border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Smartphone size={14} /> WhatsApp
              </button>
              <button
                onClick={() => handleTabChange("text")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "text"
                    ? "bg-white text-purple-600 shadow-sm border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Type size={14} /> Teks Bebas
              </button>
            </div>

            {/* AREA INPUT */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block mb-2">
                  {activeTab === "link"
                    ? "Tautan Web (URL)"
                    : activeTab === "wa"
                      ? "Nomor WhatsApp Tujuan"
                      : "Teks Pesan / Informasi"}
                </label>

                {activeTab === "text" ? (
                  <textarea
                    rows={4}
                    className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-4 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all resize-none"
                    placeholder="Contoh: Kode Wi-Fi kantor: GUWIGO-GUEST-2026..."
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="relative">
                    {activeTab === "wa" && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] font-mono text-xs">
                        wa.me/
                      </div>
                    )}
                    <input
                      type="text"
                      className={`w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg py-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all ${
                        activeTab === "wa" ? "pl-20 pr-4" : "px-4"
                      }`}
                      placeholder={
                        activeTab === "link"
                          ? "https://guwigo.com/..."
                          : "6285179594146"
                      }
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              {/* TOMBOL GENERATE */}
              <button
                onClick={handleGenerate}
                disabled={!inputValue.trim() || isGenerating}
                className={`w-full py-3.5 rounded-lg text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  isGenerated
                    ? "bg-emerald-600 text-white"
                    : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25"
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />{" "}
                    <span>Memproses Matriks QR...</span>
                  </>
                ) : isGenerated ? (
                  <>
                    <ShieldCheck size={16} className="text-white" />{" "}
                    <span>QR Code Siap Digunakan</span>
                  </>
                ) : (
                  <>
                    <QrCode size={16} /> Buat QR Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* BAGIAN KANAN: PREVIEW QR CODE */}
          <div className="w-full md:w-[420px] bg-[#FAF9F6] p-6 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div
              className={`w-full max-w-[260px] aspect-square rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center p-5 mb-6 relative transition-all duration-300 z-10 ${
                isGenerated ? "border-[#2563EB]/40 ring-2 ring-[#2563EB]/10" : ""
              }`}
            >
              {/* STATE 1: KOSONG */}
              {!isGenerated && !isGenerating && (
                <div className="text-[#94A3B8] flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-[#FAF9F6] flex items-center justify-center border-2 border-dashed border-[#CBD5E1]">
                    <QrCode size={32} strokeWidth={1.5} className="text-[#94A3B8]" />
                  </div>
                  <p className="text-xs text-[#64748B] font-medium">
                    Masukkan data di panel kiri
                  </p>
                </div>
              )}

              {/* STATE 2: LOADING */}
              {isGenerating && (
                <div className="absolute inset-0 bg-white/90 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center text-[#2563EB] z-10">
                  <Loader2 size={36} className="animate-spin mb-3 text-[#2563EB]" />
                  <p className="text-xs font-medium text-[#0F172A]">
                    Menyusun Matriks...
                  </p>
                </div>
              )}

              {/* STATE 3: QR CODE MUNCUL */}
              <div
                className={`transition-all duration-300 ${
                  isGenerated ? "opacity-100 scale-100" : "opacity-0 scale-90 absolute"
                }`}
                ref={qrRef}
              >
                {(isGenerated || isGenerating) && (
                  <QRCodeCanvas
                    value={
                      activeTab === "wa"
                        ? `https://wa.me/${inputValue.replace(/\D/g, "")}`
                        : inputValue
                    }
                    size={200}
                    bgColor={"#FFFFFF"}
                    fgColor={"#0A0F1D"}
                    level={"H"}
                    includeMargin={true}
                    style={{ borderRadius: "8px" }}
                  />
                )}
              </div>
            </div>

            <div className="w-full space-y-3 relative z-10 max-w-[260px]">
              <button
                onClick={downloadQRCode}
                disabled={!isGenerated}
                className="w-full bg-[#0A0F1D] hover:bg-[#131C31] text-white py-3 rounded-lg font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed border border-[#1E293B]"
              >
                <Download size={15} /> Unduh Format PNG
              </button>

              {isGenerated && (
                <p className="text-[11px] text-[#64748B] flex justify-center gap-1.5 items-center">
                  <ShieldCheck size={13} className="text-emerald-500" /> Siap untuk kebutuhan cetak & digital
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
