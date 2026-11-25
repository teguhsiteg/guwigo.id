"use client";

import { useState, useEffect } from "react";
import {
  Type,
  Settings2,
  Copy,
  CheckCircle,
  Radio,
  Palette,
  Zap,
  ImageIcon,
  Share2,
  Loader2,
} from "lucide-react";

export default function MarqueePage() {
  const [text, setText] = useState(
    "SELAMAT DATANG DI LIVE STREAMING • JANGAN LUPA FOLLOW & SUBSCRIBE",
  );
  const [color, setColor] = useState("#FFFFFF");
  const [bg, setBg] = useState("rgba(10, 15, 29, 0.95)");
  const [speed, setSpeed] = useState(15);
  const [obsUrl, setObsUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    const origin = window.location.origin;
    setObsUrl(
      `${origin}/obs/running-text.html?text=${encodeURIComponent(text)}&color=${encodeURIComponent(color)}&bg=${encodeURIComponent(bg)}&speed=${speed}`,
    );
  }, [text, color, bg, speed]);

  const handleCopy = () => {
    if (!obsUrl) return;
    navigator.clipboard.writeText(obsUrl);
    setCopiedLink(obsUrl);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-36 md:pt-44 pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="text-center max-w-2xl mx-auto mb-14 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-medium mb-6 shadow-sm">
            <Radio size={13} className="text-[#2563EB]" /> Free Broadcast Overlay
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#0F172A] mb-4 tracking-tight leading-[1.1] font-normal">
            OBS Running Text <br />
            <span className="italic text-[#2563EB]">Studio Generator.</span>
          </h1>
          <p className="text-base text-[#64748B] font-normal leading-relaxed">
            Rakit widget teks berjalan (Marquee) profesional untuk penyiaran Live Streaming Anda di OBS Studio. Sesuaikan konfigurasi visual dan dapatkan tautan Browser Source secara instan.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ==========================================
              PANEL KIRI: PENGATURAN
          ========================================== */}
          <div className="w-full lg:w-[380px] bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm shrink-0 h-fit animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="flex justify-between items-center mb-6 border-b border-[#E2E8F0] pb-4">
              <h3 className="font-serif font-normal text-[#0F172A] text-base flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                  <Settings2 size={16} />
                </div>
                Studio Settings
              </h3>
              <span className="text-[10px] font-mono font-medium bg-[#FAF9F6] text-[#64748B] border border-[#E2E8F0] px-2 py-0.5 rounded">
                Live Sync
              </span>
            </div>

            <div className="space-y-6">
              {/* Input Teks */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                  <Type size={13} className="text-[#2563EB]" /> Teks Widget
                </label>
                <textarea
                  rows={4}
                  spellCheck={false}
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3.5 text-xs sm:text-sm text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none resize-none transition-all"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              {/* Input Warna & Speed */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                    <Palette size={13} className="text-[#2563EB]" /> Warna Teks
                  </label>
                  <div className="relative w-full h-11 rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm hover:border-[#2563EB] transition-colors cursor-pointer group">
                    <input
                      type="color"
                      className="absolute -top-4 -left-4 w-[200%] h-[200%] cursor-pointer"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                    <Zap size={13} className="text-[#2563EB]" /> Kecepatan ({speed}s)
                  </label>
                  <div className="h-11 flex items-center bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg px-3">
                    <input
                      type="range"
                      min="5"
                      max="40"
                      className="w-full accent-[#2563EB] cursor-pointer"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Select Background */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                  <ImageIcon size={13} className="text-[#2563EB]" /> Latar Belakang Overlay
                </label>
                <select
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all cursor-pointer"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                >
                  <option value="rgba(10, 15, 29, 0.95)">
                    Guwigo Navy (Deep Contrast)
                  </option>
                  <option value="rgba(0, 0, 0, 0.92)">Hitam Pekat (Studio)</option>
                  <option value="rgba(220, 38, 38, 0.92)">
                    Merah Solid (Breaking News)
                  </option>
                  <option value="rgba(37, 99, 235, 0.92)">
                    Biru Royal (Sport / Tech)
                  </option>
                  <option value="rgba(0, 0, 0, 0)">
                    Transparan Penuh (Clean Mode)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ==========================================
              PANEL KANAN: PREVIEW & HASIL
          ========================================== */}
          <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-right-6 duration-700 delay-150 min-w-0">
            <div className="bg-[#0A0F1D] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-sm flex-1 flex flex-col text-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-normal text-white flex items-center gap-2 text-sm tracking-tight">
                  <Radio size={16} className="text-red-500 animate-pulse" />{" "}
                  Output Simulator
                </h3>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
              </div>

              {/* Jendela Preview */}
              <div className="w-full h-[220px] md:h-[280px] bg-slate-900 rounded-lg border border-[#1E293B] relative mb-6 overflow-hidden flex items-end shadow-inner">
                {obsUrl !== null ? (
                  <iframe
                    src={obsUrl}
                    className="w-full h-[60px] relative z-10 border-0 mb-4"
                    title="Preview Marquee"
                  />
                ) : (
                  <div className="w-full h-[60px] relative z-10 flex items-center justify-center mb-4">
                    <Loader2 className="animate-spin text-white/50" size={20} />
                  </div>
                )}
              </div>

              {/* Output URL & Copy Action */}
              <div className="bg-black/40 p-5 rounded-lg border border-[#1E293B] mt-auto relative z-10 w-full">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                    <Share2 size={13} className="text-[#60A5FA]" /> Browser Source URL
                  </p>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded text-[10px] font-medium">
                    Siap Digunakan
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex-1 min-w-0 bg-black/60 text-[#38BDF8] text-xs font-mono px-4 py-3 rounded-lg border border-white/5 overflow-x-auto whitespace-nowrap flex items-center">
                    {obsUrl || "Membangun tautan OBS..."}
                  </div>
                  <button
                    onClick={handleCopy}
                    disabled={!obsUrl}
                    className={`px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shrink-0 text-xs font-medium tracking-wide shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                      copiedLink
                        ? "bg-emerald-600 text-white"
                        : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle size={15} /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy size={15} /> Salin URL
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-[#64748B] mt-3 leading-relaxed">
                  *Salin URL di atas, buka OBS Studio, tambahkan Source baru berupa <strong className="text-white">Browser</strong>, lalu tempel URL tersebut.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
