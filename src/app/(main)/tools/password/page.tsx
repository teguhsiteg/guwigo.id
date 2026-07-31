"use client";

import { useState, useEffect } from "react";
import {
  KeyRound,
  Copy,
  CheckCircle,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Settings2,
  Lock,
  Binary,
  Hash,
  AtSign,
  Type,
} from "lucide-react";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let charSet = "";
    if (options.upper) charSet += chars.upper;
    if (options.lower) charSet += chars.lower;
    if (options.numbers) charSet += chars.numbers;
    if (options.symbols) charSet += chars.symbols;

    if (charSet === "") {
      setPassword("Pilih minimal 1 parameter");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    setPassword(result);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options]);

  const handleCopy = () => {
    if (password === "Pilih minimal 1 parameter") return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Kalkulasi Kekuatan Sandi (Maksimal 4)
  const getStrength = () => {
    let score = 0;
    if (length >= 12) score += 1;
    if (options.upper && options.lower) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 1;
    return score;
  };

  const strengthScore = getStrength();

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION EKSKLUSIF (DARK PREMIUM THEME)
      ========================================== */}
      <section className="bg-[#0B1324] pt-40 pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[45vh]">
        {/* Background Visual Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black text-[#00D4FF] uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Lock size={12} /> Enterprise Security
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Ultimate Password <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-blue-500">
              Generator.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Rakit kata sandi tingkat militer yang mustahil diretas. Seluruh
            proses enkripsi dilakukan secara lokal di perangkat Anda, menjamin
            100% kerahasiaan data.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. THE TOOL (SPLIT SCREEN LAYOUT)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* PANEL KIRI: OUTPUT & EKSEKUSI (DARK MODE) */}
          <div className="w-full lg:w-5/12 bg-[#0B1324] rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-800 flex flex-col p-8 md:p-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF]">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Output Kriptografi
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                  Secure Local Instance
                </p>
              </div>
            </div>

            {/* Display Password */}
            <div className="relative mb-8 group">
              <div className="w-full bg-black/50 border border-slate-700 rounded-2xl p-6 md:py-10 text-center break-all text-2xl md:text-3xl font-mono text-[#00D4FF] tracking-wider shadow-inner min-h-[120px] flex items-center justify-center transition-colors group-hover:border-[#00D4FF]/50">
                {password}
              </div>
            </div>

            {/* Indikator Kekuatan */}
            <div className="mb-auto">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Analisa Kekuatan
                </span>
                <span
                  className={`text-xs font-black uppercase tracking-widest flex items-center gap-1 ${
                    strengthScore >= 4
                      ? "text-emerald-400"
                      : strengthScore === 3
                        ? "text-blue-400"
                        : strengthScore === 2
                          ? "text-yellow-400"
                          : "text-red-400"
                  }`}
                >
                  {strengthScore >= 4 && <ShieldCheck size={14} />}
                  {strengthScore <= 2 && <ShieldAlert size={14} />}
                  {strengthScore >= 4
                    ? "Military Grade"
                    : strengthScore === 3
                      ? "Sangat Kuat"
                      : strengthScore === 2
                        ? "Cukup Kuat"
                        : "Sangat Lemah"}
                </span>
              </div>
              {/* Progress Bar 4 Segmen */}
              <div className="flex gap-2 h-2.5">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      strengthScore >= level
                        ? strengthScore >= 4
                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                          : strengthScore === 3
                            ? "bg-blue-500"
                            : strengthScore === 2
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        : "bg-slate-800"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Tombol Aksi Kiri */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 mt-12">
              <button
                onClick={handleCopy}
                className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
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
                    <Copy size={16} /> Salin Sandi
                  </>
                )}
              </button>
              <button
                onClick={generatePassword}
                className="flex-1 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-white/10 hover:bg-white/20 text-white border border-white/10"
              >
                <RefreshCw size={16} /> Regenerate
              </button>
            </div>
          </div>

          {/* PANEL KANAN: PENGATURAN (LIGHT MODE) */}
          <div className="w-full lg:w-7/12 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-900/5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <Settings2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Parameter Konfigurasi
                </h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                  Atur Kompleksitas Karakter
                </p>
              </div>
            </div>

            <div className="space-y-10">
              {/* Slider Panjang Karakter */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest block mb-1">
                      Panjang Karakter
                    </label>
                    <span className="text-[10px] font-medium text-slate-500">
                      Direkomendasikan: 16 - 32 Karakter
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-2xl font-black text-[#0B1324]">
                      {length}
                    </span>
                  </div>
                </div>
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#00D4FF] hover:accent-blue-500 transition-all focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #00D4FF 0%, #3b82f6 ${((length - 8) / (64 - 8)) * 100}%, #e2e8f0 ${((length - 8) / (64 - 8)) * 100}%, #e2e8f0 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-3 px-1">
                    <span>8</span>
                    <span>32</span>
                    <span>64</span>
                  </div>
                </div>
              </div>

              {/* Grid Checkbox Modern */}
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest block mb-4 ml-1">
                  Kombinasi Karakter
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Uppercase */}
                  <label className="relative cursor-pointer group">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={options.upper}
                      onChange={() =>
                        setOptions({ ...options, upper: !options.upper })
                      }
                    />
                    <div className="p-5 bg-white border-2 border-slate-200 rounded-2xl transition-all peer-checked:border-[#00D4FF] peer-checked:bg-[#00D4FF]/5 peer-hover:border-slate-300 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 peer-checked:bg-white flex items-center justify-center text-slate-600 peer-checked:text-[#00D4FF] transition-colors">
                          <Type size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            Huruf Besar
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            A - Z
                          </p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center peer-checked:bg-[#00D4FF] peer-checked:border-[#00D4FF] transition-colors">
                        <CheckCircle
                          size={12}
                          className="text-white opacity-0 peer-checked:opacity-100"
                        />
                      </div>
                    </div>
                  </label>

                  {/* Lowercase */}
                  <label className="relative cursor-pointer group">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={options.lower}
                      onChange={() =>
                        setOptions({ ...options, lower: !options.lower })
                      }
                    />
                    <div className="p-5 bg-white border-2 border-slate-200 rounded-2xl transition-all peer-checked:border-[#00D4FF] peer-checked:bg-[#00D4FF]/5 peer-hover:border-slate-300 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 peer-checked:bg-white flex items-center justify-center text-slate-600 peer-checked:text-[#00D4FF] transition-colors">
                          <Type size={18} className="scale-75" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            Huruf Kecil
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            a - z
                          </p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center peer-checked:bg-[#00D4FF] peer-checked:border-[#00D4FF] transition-colors">
                        <CheckCircle
                          size={12}
                          className="text-white opacity-0 peer-checked:opacity-100"
                        />
                      </div>
                    </div>
                  </label>

                  {/* Numbers */}
                  <label className="relative cursor-pointer group">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={options.numbers}
                      onChange={() =>
                        setOptions({ ...options, numbers: !options.numbers })
                      }
                    />
                    <div className="p-5 bg-white border-2 border-slate-200 rounded-2xl transition-all peer-checked:border-[#00D4FF] peer-checked:bg-[#00D4FF]/5 peer-hover:border-slate-300 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 peer-checked:bg-white flex items-center justify-center text-slate-600 peer-checked:text-[#00D4FF] transition-colors">
                          <Hash size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            Angka
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            0 - 9
                          </p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center peer-checked:bg-[#00D4FF] peer-checked:border-[#00D4FF] transition-colors">
                        <CheckCircle
                          size={12}
                          className="text-white opacity-0 peer-checked:opacity-100"
                        />
                      </div>
                    </div>
                  </label>

                  {/* Symbols */}
                  <label className="relative cursor-pointer group">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={options.symbols}
                      onChange={() =>
                        setOptions({ ...options, symbols: !options.symbols })
                      }
                    />
                    <div className="p-5 bg-white border-2 border-slate-200 rounded-2xl transition-all peer-checked:border-[#00D4FF] peer-checked:bg-[#00D4FF]/5 peer-hover:border-slate-300 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 peer-checked:bg-white flex items-center justify-center text-slate-600 peer-checked:text-[#00D4FF] transition-colors">
                          <AtSign size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            Karakter Simbol
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            ! @ # $ % &
                          </p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center peer-checked:bg-[#00D4FF] peer-checked:border-[#00D4FF] transition-colors">
                        <CheckCircle
                          size={12}
                          className="text-white opacity-0 peer-checked:opacity-100"
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
