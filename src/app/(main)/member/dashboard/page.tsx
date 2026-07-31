"use client";

import { useState } from "react";
import {
  PlayCircle,
  Lock,
  BookOpen,
  Crown,
  Download,
  AlertCircle,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function MemberDashboard() {
  // MOCK DATA: Simulasi data dari database
  const [user] = useState({
    name: "Member Baru",
    plan: "trial", // Bisa 'trial', 'pro', atau 'vip'
    daysLeft: 3,
    status: "active", // Bisa 'active' atau 'view-only'
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20 font-sans selection:bg-blue-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* HEADER DASHBOARD */}
        <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
          {/* Efek Cahaya Latar */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
              Selamat Datang, {user.name}! <span aria-hidden="true">🚀</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Mari lanjutkan perjalanan ngoding Anda hari ini.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 border border-white/10 p-5 rounded-2xl flex items-center gap-5 backdrop-blur-md">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-inner ${
                user.plan === "vip" || user.plan === "pro"
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                  : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              }`}
            >
              <Crown size={28} />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider mb-1">
                Paket Saat Ini
              </p>
              <p className="text-xl font-black uppercase tracking-wide text-white">
                {user.plan === "trial" ? "Free Trial" : user.plan}
              </p>
            </div>
          </div>
        </header>

        {/* ALERT STATUS TRIAL */}
        {user.plan === "trial" && (
          <section
            aria-label="Peringatan Status Trial"
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 md:p-8 rounded-2xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-center gap-5 text-blue-900">
              <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                <Clock size={28} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-xl mb-1">
                  Sisa Waktu Trial: {user.daysLeft} Hari
                </h2>
                <p className="text-sm text-blue-700/80 leading-relaxed max-w-2xl">
                  Setelah waktu habis, akses akan menjadi View-Only. Upgrade
                  sekarang untuk membuka kunci semua materi dan template premium
                  selamanya.
                </p>
              </div>
            </div>
            <button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-600/30 active:scale-95 flex items-center gap-2">
              Upgrade ke Pro <ChevronRight size={20} />
            </button>
          </section>
        )}

        {/* DAFTAR MODUL */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <BookOpen size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Modul Pembelajaran
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modul 1: Terbuka */}
          <button
            className="text-left bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-blue-100"
            aria-label="Mulai Modul 1: Database Design & ERD"
          >
            <div className="flex justify-between items-start mb-5">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                Modul 1
              </span>
              <PlayCircle
                size={28}
                className="text-slate-300 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300"
              />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              Database Design & ERD
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Video durasi 45 menit membahas relasi antar tabel untuk Sistem
              Informasi Inventori.
            </p>
          </button>

          {/* Modul 2: Terbuka */}
          <button
            className="text-left bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-blue-100"
            aria-label="Mulai Modul 2: CRUD & Logika Dasar"
          >
            <div className="flex justify-between items-start mb-5">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                Modul 2
              </span>
              <PlayCircle
                size={28}
                className="text-slate-300 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300"
              />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              CRUD & Logika Dasar
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Panduan praktis membuat fitur Tambah, Edit, Hapus, dan Tampil data
              dengan standar industri.
            </p>
          </button>

          {/* Modul 3: Terkunci */}
          <div
            className="bg-slate-50 p-7 rounded-2xl border border-slate-200 relative overflow-hidden group select-none"
            aria-disabled="true"
          >
            {/* Overlay Glassmorphism */}
            <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all duration-300 group-hover:bg-slate-50/90">
              <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                <Lock size={28} className="text-slate-400" />
              </div>
              <span className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Crown size={14} className="text-yellow-400" /> Khusus Pro / VIP
              </span>
            </div>

            {/* Konten Blur */}
            <div className="opacity-40" aria-hidden="true">
              <div className="flex justify-between items-start mb-5">
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  Modul 3
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Sistem Role & Security
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Membatasi akses antara halaman Admin dan Karyawan dengan
                Middleware keamanan tingkat lanjut.
              </p>
            </div>
          </div>

          {/* Boilerplate Download (Terkunci untuk Trial) */}
          <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200 relative overflow-hidden select-none">
            {user.plan === "trial" && (
              <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all duration-300 hover:bg-slate-50/90">
                <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                  <Lock size={28} className="text-slate-400" />
                </div>
                <span className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Crown size={14} className="text-yellow-400" /> Khusus Pro /
                  VIP
                </span>
              </div>
            )}

            <div
              className={`${user.plan === "trial" ? "opacity-40" : ""} transition-opacity`}
            >
              <div className="flex justify-between items-start mb-5">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full">
                  Bonus Resources
                </span>
                <Download size={28} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Premium Boilerplate SIM
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Source code lengkap siap pakai. Download, ekstrak, dan langsung
                kustomisasi di laptop Anda.
              </p>
            </div>

            {/* Tombol Download (Hanya muncul jika bukan trial) */}
            {user.plan !== "trial" && (
              <button className="mt-5 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 rounded-xl transition-colors focus:ring-4 focus:ring-emerald-100 focus:outline-none flex items-center justify-center gap-2">
                <Download size={18} /> Download ZIP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
