"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MessageCircle,
  Copy,
  CheckCircle,
  ExternalLink,
  Phone,
  Type,
  Smartphone,
  Wand2,
  Info,
} from "lucide-react";

export default function WALinkGeneratorPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const formatPhoneNumber = (num: string) => {
    let cleaned = num.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return cleaned;
  };

  useEffect(() => {
    const cleanPhone = formatPhoneNumber(phone);
    if (!cleanPhone) {
      setGeneratedLink("");
      return;
    }

    const baseUrl = `https://wa.me/${cleanPhone}`;
    if (message.trim() === "") {
      setGeneratedLink(baseUrl);
    } else {
      setGeneratedLink(`${baseUrl}?text=${encodeURIComponent(message)}`);
    }
  }, [phone, message]);

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestLink = () => {
    if (!generatedLink) return;
    window.open(generatedLink, "_blank");
  };

  const renderWAPreview = (text: string) => {
    if (!text)
      return (
        <span className="text-white/40 italic text-xs">
          Ketik pesan Anda di panel kiri, simulasi balon obrolan akan muncul di sini...
        </span>
      );

    let safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    safeText = safeText.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    safeText = safeText.replace(/_(.*?)_/g, "<em>$1</em>");
    safeText = safeText.replace(/~(.*?)~/g, "<del>$1</del>");
    safeText = safeText.replace(/\n/g, "<br />");

    return <div dangerouslySetInnerHTML={{ __html: safeText }} />;
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
            <MessageCircle size={13} className="text-[#2563EB]" /> Free Conversion Utility
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0F172A] mb-5 tracking-tight leading-[1.1] font-normal">
            WhatsApp Direct Link <br />
            <span className="italic text-[#2563EB]">Builder.</span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Rakit tautan WhatsApp dinamis dengan pesan pembuka otomatis. Optimalkan tingkat konversi kampanye digital, layanan customer service, dan katalog produk Anda.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. THE TOOL (SPLIT SCREEN LAYOUT)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 py-14 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* PANEL KIRI: INPUT FORM (LIGHT CARD) */}
          <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-5">
              <div className="w-9 h-9 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Wand2 size={18} />
              </div>
              <div>
                <h2 className="text-base font-serif font-normal text-[#0F172A] tracking-tight">
                  Parameter Tautan
                </h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Masukkan nomor WhatsApp dan susun teks pembuka otomatis
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Input Nomor WA */}
              <div>
                <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Phone size={13} className="text-[#2563EB]" /> Nomor WhatsApp Tujuan
                </label>
                <div className="relative flex">
                  <div className="bg-[#FAF9F6] border border-[#E2E8F0] border-r-0 rounded-l-lg px-3.5 flex items-center justify-center font-mono font-bold text-[#64748B] text-xs">
                    +62
                  </div>
                  <input
                    type="tel"
                    className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-r-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                    placeholder="81234567890"
                    value={
                      phone.startsWith("62")
                        ? phone.substring(2)
                        : phone.startsWith("0")
                          ? phone.substring(1)
                          : phone
                    }
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-[#64748B] mt-1.5 flex items-start gap-1">
                  <Info size={12} className="shrink-0 mt-0.5 text-[#2563EB]" /> Awalan angka 0 otomatis dikonversi ke format internasional (+62).
                </p>
              </div>

              {/* Input Pesan WA */}
              <div>
                <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Type size={13} className="text-[#2563EB]" /> Teks Pesan Otomatis
                </label>
                <textarea
                  rows={6}
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all resize-none leading-relaxed"
                  placeholder="Halo Admin Guwigo, saya ingin konsultasi mengenai pembuatan sistem Enterprise..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* Format Bantuan */}
                <div className="mt-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3.5 text-xs text-[#64748B]">
                  <p className="font-semibold text-[#0F172A] text-[11px] uppercase tracking-wider mb-1.5">
                    Tips Pemformatan Teks:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div>*Tebal* ➔ <strong className="text-[#0F172A]">Tebal</strong></div>
                    <div>_Miring_ ➔ <em className="text-[#0F172A]">Miring</em></div>
                    <div>~Coret~ ➔ <del className="text-[#0F172A]">Coret</del></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL KANAN: PREVIEW & OUTPUT (DARK CARD) */}
          <div className="w-full lg:w-1/2 bg-[#0A0F1D] rounded-xl shadow-sm border border-[#1E293B] flex flex-col p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 text-white">
            <div className="flex items-center gap-3 mb-6 border-b border-[#1E293B] pb-5">
              <div className="w-9 h-9 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Smartphone size={18} />
              </div>
              <div>
                <h2 className="text-base font-serif font-normal text-white tracking-tight">
                  Live Chat Preview
                </h2>
                <p className="text-[11px] text-[#38BDF8] mt-0.5">
                  Simulasi tampilan antarmuka WhatsApp
                </p>
              </div>
            </div>

            {/* Mockup Layar WA */}
            <div className="relative w-full max-w-sm mx-auto bg-[#0b141a] rounded-xl border border-[#1E293B] shadow-lg h-[310px] flex flex-col overflow-hidden mb-6">
              {/* Header WA Bar */}
              <div className="bg-[#202c33] px-3.5 py-2.5 flex items-center gap-2.5 z-10 shrink-0 border-b border-[#1E293B]">
                <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/images/branding/loader.png"
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="opacity-70 object-contain"
                  />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">
                    Admin Guwigo
                  </p>
                  <p className="text-emerald-400 text-[10px]">online</p>
                </div>
              </div>

              {/* Chat Bubble Area */}
              <div className="flex-1 p-3.5 overflow-y-auto flex flex-col justify-end z-10">
                <div className="self-end bg-[#005c4b] text-[#e9edef] p-3 rounded-lg rounded-tr-none max-w-[88%] shadow-sm text-xs leading-relaxed break-words whitespace-pre-wrap">
                  {renderWAPreview(message)}
                  <div className="flex justify-end items-center gap-1 mt-1 text-white/50 text-[9px]">
                    <span>14:00</span>
                    <CheckCircle size={10} className="text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Output URL & Buttons */}
            <div className="mt-auto bg-black/40 border border-[#1E293B] rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  Tautan WhatsApp yang Dihasilkan
                </span>
                {generatedLink && (
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-medium">
                    Siap Pakai
                  </span>
                )}
              </div>

              <div className="w-full bg-black/60 text-[#38BDF8] text-xs font-mono p-3 rounded-md border border-white/5 overflow-x-auto whitespace-nowrap mb-3.5">
                {generatedLink || "Masukkan nomor tujuan di panel kiri..."}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleCopy}
                  disabled={!generatedLink}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle size={15} /> Tautan Tersalin
                    </>
                  ) : (
                    <>
                      <Copy size={15} /> Salin Tautan
                    </>
                  )}
                </button>
                <button
                  onClick={handleTestLink}
                  disabled={!generatedLink}
                  className="flex-1 py-2.5 rounded-lg font-medium text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all bg-white/10 hover:bg-white/15 text-white border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Uji Tautan Langsung <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
