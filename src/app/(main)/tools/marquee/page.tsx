"use client";

import { useState, useEffect } from "react";
import {
  Settings2,
  Copy,
  CheckCircle,
  MonitorPlay,
  Loader2,
  Type,
  Palette,
  Zap,
  Image as ImageIcon,
  Radio,
  Share2,
} from "lucide-react";

export default function MarqueeGeneratorPage() {
  const [text, setText] = useState(
    "🔥 Selamat Datang di Live Streaming! Jangan lupa Follow & Share! 🔥",
  );
  const [color, setColor] = useState("#FFFFFF");
  const [bg, setBg] = useState("rgba(11, 19, 36, 0.9)"); // Default ke Midnight Navy dengan Opacity
  const [speed, setSpeed] = useState("15");

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [obsUrl, setObsUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      text: encodeURIComponent(text),
      color: encodeURIComponent(color),
      bg: encodeURIComponent(bg),
      speed: speed,
      size: "28",
    });

    setObsUrl(
      `${window.location.origin}/obs/marquee.html?${params.toString()}`,
    );
  }, [text, color, bg, speed]);

  const handleCopy = () => {
    if (!obsUrl) return;
    navigator.clipboard.writeText(obsUrl);
    setCopiedLink(obsUrl);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324] overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Free Broadcast Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            OBS Running Text <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-[#00D4FF]">
              Generator.
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">
            Rakit widget teks berjalan (Marquee) profesional untuk Live
            Streaming Anda. Sesuaikan konfigurasi visual dan salin Browser
            Source URL secara instan.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* ==========================================
              PANEL KIRI: PENGATURAN
          ========================================== */}
          <div className="w-full lg:w-[400px] bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 shrink-0 h-fit animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF]">
                  <Settings2 size={16} />
                </div>
                Studio Settings
              </h3>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md uppercase tracking-widest">
                Live Sync
              </span>
            </div>

            <div className="space-y-8">
              {/* Input Teks */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  <Type size={14} className="text-[#00D4FF]" /> Teks Widget
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    spellCheck={false}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] outline-none resize-none transition-all"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>

              {/* Input Warna & Speed */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                    <Palette size={14} className="text-[#00D4FF]" /> Warna Teks
                  </label>
                  <div className="relative w-full h-12 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-[#00D4FF] transition-colors cursor-pointer group">
                    <input
                      type="color"
                      className="absolute -top-4 -left-4 w-[200%] h-[200%] cursor-pointer"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                    <Zap size={14} className="text-[#00D4FF]" /> Speed ({speed}
                    s)
                  </label>
                  <div className="h-12 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 shadow-sm hover:border-[#00D4FF] transition-colors">
                    <input
                      type="range"
                      min="5"
                      max="40"
                      className="w-full accent-[#00D4FF]"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Select Background */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  <ImageIcon size={14} className="text-[#00D4FF]" /> Background
                  Overlay
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00D4FF]/20 focus:border-[#00D4FF] shadow-sm transition-all appearance-none cursor-pointer"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="rgba(11, 19, 36, 0.9)">
                    Midnight Navy (Guwigo Theme)
                  </option>
                  <option value="rgba(0, 0, 0, 0.9)">Jet Black (Studio)</option>
                  <option value="rgba(220, 38, 38, 0.9)">
                    Solid Red (Breaking News)
                  </option>
                  <option value="rgba(37, 99, 235, 0.9)">
                    Solid Blue (Sport/Tech)
                  </option>
                  <option value="rgba(0, 0, 0, 0)">
                    100% Transparent (Clean)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ==========================================
              PANEL KANAN: PREVIEW & HASIL
          ========================================== */}
          <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 min-w-0">
            <div className="bg-[#0B1324] p-6 md:p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl flex-1 flex flex-col relative overflow-hidden group">
              {/* Abstract Glowing Horizon Background */}
              <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#00D4FF]/10 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Radio size={18} className="text-red-500 animate-pulse" />{" "}
                  Output Preview
                </h3>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
              </div>

              {/* Jendela Preview */}
              <div className="w-full h-[250px] md:h-[350px] bg-[url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-2xl border border-slate-700 relative mb-8 overflow-hidden flex items-end shadow-[inset_0_-50px_50px_rgba(0,0,0,0.5)]">
                {/* Fallback & Render Iframe */}
                {obsUrl !== null ? (
                  <iframe
                    src={obsUrl}
                    className="w-full h-[70px] relative z-10 border-0 mb-6"
                    title="Preview Marquee"
                  />
                ) : (
                  <div className="w-full h-[70px] relative z-10 flex items-center justify-center mb-6">
                    <Loader2 className="animate-spin text-white/50" size={24} />
                  </div>
                )}
              </div>

              {/* Output URL & Copy Action */}
              <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-white/10 mt-auto relative z-10 shadow-xl w-full">
                <div className="flex justify-between items-end mb-4">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Share2 size={14} className="text-[#00D4FF]" /> Browser
                    Source URL
                  </p>
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    Ready to Use
                  </span>
                </div>

                {/* KOTAK URL YANG SUDAH DILENGKAPI min-w-0 AGAR TIDAK MELEBAR */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="flex-1 min-w-0 bg-black/50 text-slate-300 text-xs font-mono px-5 py-4 rounded-xl border border-white/10 overflow-x-auto whitespace-nowrap custom-scrollbar flex items-center shadow-inner">
                    {obsUrl || "Membangun arsitektur tautan..."}
                  </div>
                  <button
                    onClick={handleCopy}
                    disabled={!obsUrl}
                    className={`font-black px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                      copiedLink
                        ? "bg-emerald-500 text-white shadow-emerald-500/30 border border-emerald-400"
                        : "bg-[#00D4FF] text-[#0B1324] hover:bg-white shadow-[#00D4FF]/30 border border-[#00D4FF]/50"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle size={16} /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Salin URL
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] font-medium text-slate-500 mt-5 leading-relaxed">
                  *Salin URL di atas, buka OBS Studio, tambahkan Source baru
                  berupa <strong className="text-slate-300">"Browser"</strong>,
                  lalu paste URL tersebut ke kolom yang tersedia. Sesuaikan
                  resolusi layar pada pengaturan OBS Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 8px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `,
        }}
      />
    </div>
  );
}
