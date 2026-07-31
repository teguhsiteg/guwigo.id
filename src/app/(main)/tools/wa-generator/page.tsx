"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // INI BARIS IMPORT YANG TERTINGGAL SEBELUMNYA
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

  // Fungsi untuk memformat nomor HP (Otomatis ubah 0 awalan jadi 62)
  const formatPhoneNumber = (num: string) => {
    let cleaned = num.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return cleaned;
  };

  // Generate Link secara real-time
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

  // Parser sederhana untuk menampilkan preview WhatsApp (Bold, Italic, Strikethrough, Newline)
  const renderWAPreview = (text: string) => {
    if (!text)
      return (
        <span className="text-white/40 italic text-[13px]">
          Ketik pesan Anda di sebelah kiri, preview obrolan akan muncul di
          sini...
        </span>
      );

    // Escape HTML bawaan untuk keamanan
    let safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Terapkan formatting WA
    safeText = safeText.replace(/\*(.*?)\*/g, "<strong>$1</strong>"); // Bold
    safeText = safeText.replace(/_(.*?)_/g, "<em>$1</em>"); // Italic
    safeText = safeText.replace(/~(.*?)~/g, "<del>$1</del>"); // Strikethrough
    safeText = safeText.replace(/\n/g, "<br />"); // Enter

    return <div dangerouslySetInnerHTML={{ __html: safeText }} />;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION EKSKLUSIF (DARK PREMIUM THEME)
      ========================================== */}
      <section className="bg-[#0B1324] pt-40 pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[45vh]">
        {/* Background Visual Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00D4FF]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black text-[#00D4FF] uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <MessageCircle size={12} /> Guwigo Free Tools
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            WhatsApp Link <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-emerald-400">
              Generator.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Rakit tautan WhatsApp dinamis dengan pesan otomatis. Sangat cocok
            untuk optimasi konversi kampanye digital, Customer Service, dan
            katalog produk Anda.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. THE TOOL (SPLIT SCREEN LAYOUT)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* PANEL KIRI: INPUT FORM (LIGHT MODE) */}
          <div className="w-full lg:w-1/2 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-900/5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <Wand2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Parameter Tautan
                </h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                  Atur Nomor & Pesan Otomatis
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Input Nomor WA */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1 flex items-center gap-2">
                  <Phone size={14} className="text-[#00D4FF]" /> Nomor WhatsApp
                  Tujuan
                </label>
                <div className="relative flex">
                  <div className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-2xl px-4 flex items-center justify-center font-black text-slate-500 text-sm">
                    +62
                  </div>
                  <input
                    type="tel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-r-2xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none transition-all shadow-sm"
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
                <p className="text-[10px] font-medium text-slate-400 mt-2 ml-1 flex items-start gap-1">
                  <Info size={12} className="shrink-0 mt-0.5" /> Awalan angka 0
                  akan otomatis dikonversi menjadi format internasional (62).
                </p>
              </div>

              {/* Input Pesan WA */}
              <div>
                <div className="flex justify-between items-end mb-3 ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} className="text-[#00D4FF]" /> Teks Pesan
                    Otomatis
                  </label>
                </div>
                <textarea
                  rows={7}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none transition-all resize-none shadow-sm"
                  placeholder="Halo Admin Guwigo, saya ingin konsultasi mengenai pembuatan sistem Enterprise..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* Format Bantuan */}
                <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2">
                    Tips Format Teks WhatsApp:
                  </p>
                  <ul className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                    <li>
                      *Tebal* ➔ <strong>Tebal</strong>
                    </li>
                    <li>
                      _Miring_ ➔ <em>Miring</em>
                    </li>
                    <li className="col-span-2">
                      ~Coret~ ➔ <del>Coret</del>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL KANAN: PREVIEW & OUTPUT (DARK MODE WA THEME) */}
          <div className="w-full lg:w-1/2 bg-[#0B1324] rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-800 flex flex-col p-8 md:p-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Smartphone size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Live Chat Preview
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                  Simulasi Tampilan WhatsApp
                </p>
              </div>
            </div>

            {/* Mockup Layar WA */}
            <div className="relative w-full max-w-sm mx-auto bg-[#0b141a] rounded-[2rem] border-8 border-slate-800 shadow-2xl h-[350px] flex flex-col overflow-hidden mb-10">
              {/* Status Bar Fake */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 z-10 shrink-0 shadow-md">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/images/branding/loader.png"
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="opacity-50 object-contain"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">
                    Admin Guwigo
                  </p>
                  <p className="text-slate-400 text-[10px]">online</p>
                </div>
              </div>

              {/* Chat Background Pattern (Simulasi) */}
              <div className="absolute inset-0 bg-[#0b141a] opacity-50 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

              {/* Chat Bubble Area */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end z-10 custom-scrollbar">
                <div className="self-end bg-[#005c4b] text-[#e9edef] p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm relative">
                  <div className="text-[13px] leading-relaxed break-words whitespace-pre-wrap font-sans">
                    {renderWAPreview(message)}
                  </div>
                  <div className="flex justify-end items-center gap-1 mt-1 text-white/50">
                    <span className="text-[9px]">10:44</span>
                    <CheckCircle size={10} className="text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Output Kriptografi & Action Buttons */}
            <div className="mt-auto bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                Generated URL{" "}
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px]">
                  Ready
                </span>
              </p>

              <div className="w-full bg-black/50 text-slate-300 text-xs font-mono p-4 rounded-xl border border-white/5 overflow-x-auto whitespace-nowrap custom-scrollbar mb-4 min-w-0">
                {generatedLink ||
                  "Masukkan nomor tujuan untuk generate link..."}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopy}
                  disabled={!generatedLink}
                  className={`flex-1 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    copied
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "bg-[#00D4FF] hover:bg-white text-[#0B1324] shadow-[#00D4FF]/20"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle size={16} /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Salin Link
                    </>
                  )}
                </button>
                <button
                  onClick={handleTestLink}
                  disabled={!generatedLink}
                  className="flex-1 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-white/10 hover:bg-white/20 text-white border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Coba Link <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `,
        }}
      />
    </div>
  );
}
