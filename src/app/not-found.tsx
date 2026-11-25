import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0F172A] flex flex-col items-center justify-center p-6 selection:bg-[#2563EB]/15 selection:text-[#0F172A]">
      <div className="text-center max-w-lg mx-auto">
        <div className="w-14 h-14 mx-auto mb-8 rounded-lg bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#2563EB]">
          <Compass size={28} strokeWidth={1.5} />
        </div>

        <p className="text-[12px] uppercase font-mono tracking-[0.2em] text-[#64748B] mb-3">
          Error 404 · Halaman Tidak Ditemukan
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#0F172A] tracking-tight mb-4">
          Halaman yang Anda tuju tidak tersedia.
        </h1>

        <p className="text-[#64748B] text-[15px] leading-relaxed mb-8 font-sans">
          Tautan mungkin telah diperbarui, dipindahkan, atau halaman tersebut sudah tidak aktif lagi. Silakan kembali ke beranda ekosistem Guwigo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center font-sans">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] px-6 py-3 rounded-md text-sm font-medium transition-all"
          >
            Jelajahi Solusi
          </Link>
        </div>
      </div>
    </div>
  );
}
