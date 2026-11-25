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
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION (EDITORIAL BRAND THEME)
      ========================================== */}
      <section className="pt-36 md:pt-44 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center border-b border-[#E2E8F0] text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#2563EB]/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-medium text-[#1D4ED8] mb-6 shadow-sm">
            <Lock size={13} className="text-[#2563EB]" /> Enterprise Security Tool
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0F172A] mb-5 tracking-tight leading-[1.1] font-normal">
            Password & Token <br />
            <span className="italic text-[#2563EB]">Generator.</span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Rakit kata sandi dan token kriptografi acak berstandar keamanan tinggi. Seluruh proses pembentukan dilakukan secara lokal di perangkat Anda tanpa pengiriman data ke server.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. THE TOOL (SPLIT SCREEN LAYOUT)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 py-14 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* PANEL KIRI: OUTPUT & EKSEKUSI (DARK CARD) */}
          <div className="w-full lg:w-5/12 bg-[#0A0F1D] rounded-xl shadow-sm border border-[#1E293B] flex flex-col p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3 mb-6 border-b border-[#1E293B] pb-5">
              <div className="w-9 h-9 rounded-md bg-[#2563EB]/20 text-[#60A5FA] flex items-center justify-center border border-[#2563EB]/40">
                <KeyRound size={18} />
              </div>
              <div>
                <h2 className="text-base font-serif font-normal text-white tracking-tight">
                  Output Kriptografi
                </h2>
                <p className="text-[11px] text-[#38BDF8] font-normal mt-0.5">
                  Secure Local Instance
                </p>
              </div>
            </div>

            {/* Display Password */}
            <div className="relative mb-6 group">
              <div className="w-full bg-black/40 border border-[#1E293B] rounded-lg p-5 sm:py-8 text-center break-all text-xl md:text-2xl font-mono text-[#38BDF8] tracking-wider shadow-inner min-h-[110px] flex items-center justify-center transition-colors group-hover:border-[#2563EB]/50">
                {password}
              </div>
            </div>

            {/* Indikator Kekuatan */}
            <div className="mb-auto">
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  Analisa Kekuatan
                </span>
                <span
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    strengthScore >= 4
                      ? "text-emerald-400"
                      : strengthScore === 3
                        ? "text-[#60A5FA]"
                        : strengthScore === 2
                          ? "text-amber-400"
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
              <div className="flex gap-1.5 h-2">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      strengthScore >= level
                        ? strengthScore >= 4
                          ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                          : strengthScore === 3
                            ? "bg-[#2563EB]"
                            : strengthScore === 2
                              ? "bg-amber-500"
                              : "bg-red-500"
                        : "bg-[#1E293B]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tombol Aksi Kiri */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 mt-8">
              <button
                onClick={handleCopy}
                className={`flex-1 py-3 rounded-lg font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle size={15} /> Tersalin ke Clipboard
                  </>
                ) : (
                  <>
                    <Copy size={15} /> Salin Sandi
                  </>
                )}
              </button>
              <button
                onClick={generatePassword}
                className="flex-1 py-3 rounded-lg font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all bg-white/10 hover:bg-white/15 text-white border border-white/10"
              >
                <RefreshCw size={15} /> Generate Ulang
              </button>
            </div>
          </div>

          {/* PANEL KANAN: PENGATURAN (LIGHT CARD) */}
          <div className="w-full lg:w-7/12 bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-5">
              <div className="w-9 h-9 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Settings2 size={18} />
              </div>
              <div>
                <h2 className="text-base font-serif font-normal text-[#0F172A] tracking-tight">
                  Parameter Konfigurasi
                </h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Sesuaikan panjang dan kombinasi karakter yang diinginkan
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Slider Panjang Karakter */}
              <div className="bg-[#FAF9F6] p-5 sm:p-6 rounded-lg border border-[#E2E8F0]">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block mb-1">
                      Panjang Karakter
                    </label>
                    <span className="text-[11px] text-[#64748B]">
                      Rekomendasi standar: 16 - 32 Karakter
                    </span>
                  </div>
                  <div className="bg-white border border-[#E2E8F0] px-3.5 py-1.5 rounded-md shadow-sm">
                    <span className="text-xl font-bold font-mono text-[#0F172A]">
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
                    className="w-full h-2.5 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#2563EB] focus:outline-none"
                  />
                  <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono mt-2 px-1">
                    <span>8</span>
                    <span>32</span>
                    <span>64</span>
                  </div>
                </div>
              </div>

              {/* Grid Checkbox Modern */}
              <div>
                <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block mb-3">
                  Kombinasi Karakter
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                    <div className="p-4 bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg transition-all peer-checked:border-[#2563EB] peer-checked:bg-[#EFF6FF] flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white border border-[#E2E8F0] peer-checked:bg-[#2563EB] flex items-center justify-center text-[#64748B] peer-checked:text-white transition-colors">
                          <Type size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A] text-xs">
                            Huruf Besar
                          </p>
                          <p className="text-[10px] text-[#64748B] font-mono mt-0.5">
                            A - Z
                          </p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-md border border-[#CBD5E1] flex items-center justify-center peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-colors">
                        <CheckCircle
                          size={11}
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
                    <div className="p-4 bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg transition-all peer-checked:border-[#2563EB] peer-checked:bg-[#EFF6FF] flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white border border-[#E2E8F0] peer-checked:bg-[#2563EB] flex items-center justify-center text-[#64748B] peer-checked:text-white transition-colors">
                          <Type size={16} className="scale-75" />
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A] text-xs">
                            Huruf Kecil
                          </p>
                          <p className="text-[10px] text-[#64748B] font-mono mt-0.5">
                            a - z
                          </p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-md border border-[#CBD5E1] flex items-center justify-center peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-colors">
                        <CheckCircle
                          size={11}
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
                    <div className="p-4 bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg transition-all peer-checked:border-[#2563EB] peer-checked:bg-[#EFF6FF] flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white border border-[#E2E8F0] peer-checked:bg-[#2563EB] flex items-center justify-center text-[#64748B] peer-checked:text-white transition-colors">
                          <Hash size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A] text-xs">
                            Angka
                          </p>
                          <p className="text-[10px] text-[#64748B] font-mono mt-0.5">
                            0 - 9
                          </p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-md border border-[#CBD5E1] flex items-center justify-center peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-colors">
                        <CheckCircle
                          size={11}
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
                    <div className="p-4 bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg transition-all peer-checked:border-[#2563EB] peer-checked:bg-[#EFF6FF] flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white border border-[#E2E8F0] peer-checked:bg-[#2563EB] flex items-center justify-center text-[#64748B] peer-checked:text-white transition-colors">
                          <AtSign size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A] text-xs">
                            Simbol Khusus
                          </p>
                          <p className="text-[10px] text-[#64748B] font-mono mt-0.5">
                            ! @ # $ % &
                          </p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-md border border-[#CBD5E1] flex items-center justify-center peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-colors">
                        <CheckCircle
                          size={11}
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
