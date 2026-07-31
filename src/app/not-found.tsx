import Link from "next/link";
import { ShieldAlert, Home, Lock } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Icon & Glitch Effect */}
        <div className="flex justify-center mb-8 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 blur-lg opacity-50 animate-ping"></div>
            <ShieldAlert size={80} className="text-red-500 relative z-10" />
          </div>
        </div>

        <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800 mb-4 select-none">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide uppercase">
          <span className="text-red-500">System Alert:</span> Path Not Found
        </h2>

        <p className="text-slate-400 mb-10 text-lg leading-relaxed">
          Halaman yang Anda tuju tidak terdaftar di dalam database kami, atau
          Anda mencoba mengakses area terlarang. IP Anda telah dicatat.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-all hover:scale-105"
          >
            <Home size={18} /> Kembali ke Markas
          </Link>

          <button className="flex items-center gap-2 px-8 py-3 rounded-full font-bold border border-slate-700 text-slate-400 hover:text-white hover:border-white transition-all cursor-not-allowed opacity-70">
            <Lock size={18} /> Access Restricted
          </button>
        </div>

        {/* Fake Terminal Code (Hiasan) */}
        <div className="mt-16 p-4 rounded-lg bg-black/50 border border-white/5 text-left font-mono text-xs text-green-500/50 max-w-md mx-auto select-none">
          <p>&gt; Initiating security protocol...</p>
          <p>&gt; Scanning user request...</p>
          <p>&gt; Error: Target directory undefined.</p>
          <p>&gt; Connection terminated.</p>
        </div>
      </div>
    </div>
  );
}
