"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  FileDown,
  Loader2,
  Clock,
  Award,
  Activity,
  CreditCard,
  FileText,
  AlertCircle, // <--- Tambahkan ini di baris terakhir
} from "lucide-react";

interface ReportData {
  totalUsers: number;
  totalRevenue: number;
  totalTransactions: number;
  activeTransactions: number;
  monthlyGrowth: number;
  topService: string;
}

// Helper untuk format uang cerdas (Juta/Milyar)
const formatCurrencyShort = (amount: number) => {
  if (amount >= 1000000000)
    return `Rp ${(amount / 1000000000).toFixed(2)} Milyar`;
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Juta`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

export default function ReportsAdminPage() {
  const [reportData, setReportData] = useState<ReportData>({
    totalUsers: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    activeTransactions: 0,
    monthlyGrowth: 0,
    topService: "-",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d",
  );

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);

      // Fetch users count
      const usersSnapshot = await getDocs(collection(db, "users"));
      const totalUsers = usersSnapshot.size;

      // Fetch transactions
      const transactionsSnapshot = await getDocs(
        collection(db, "transactions"),
      );
      const transactions = transactionsSnapshot.docs.map((d) => d.data());

      const totalRevenue = transactions.reduce(
        (sum: number, t: any) =>
          t.status === "completed" ? sum + t.amount : sum,
        0,
      );
      const totalTransactions = transactions.length;
      const activeTransactions = transactions.filter(
        (t: any) => t.status === "pending",
      ).length;

      setReportData({
        totalUsers,
        totalRevenue,
        totalTransactions,
        activeTransactions,
        monthlyGrowth: 12.5, // Placeholder (Bisa dikalkulasi dari data tgl nanti)
        topService: "Web Development", // Placeholder
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Menganalisis Data...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-sans max-w-6xl mx-auto pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <BarChart3 className="text-blue-600" /> Reports & Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Ringkasan performa bisnis, pendapatan, dan aktivitas klien Guwigo.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="90d">3 Bulan Terakhir</option>
            <option value="all">Sepanjang Waktu</option>
          </select>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-900/20 active:scale-95">
            <FileDown size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI CARDS (BENTO GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-emerald-300 hover:shadow-emerald-100 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-slate-50 group-hover:text-emerald-50 group-hover:scale-110 transition-all duration-500">
            <DollarSign size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <DollarSign size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Total Revenue
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              {formatCurrencyShort(reportData.totalRevenue)}
            </p>
            <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> Laba Bersih
            </p>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-300 hover:shadow-blue-100 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-slate-50 group-hover:text-blue-50 group-hover:scale-110 transition-all duration-500">
            <Users size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Users size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Registered Users
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              {reportData.totalUsers}{" "}
              <span className="text-lg text-slate-400 font-bold">Klien</span>
            </p>
            <p className="text-xs font-bold text-blue-600 mt-2">
              Terdaftar di Ekosistem
            </p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-purple-300 hover:shadow-purple-100 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-slate-50 group-hover:text-purple-50 group-hover:scale-110 transition-all duration-500">
            <CreditCard size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <CreditCard size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Transactions
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              {reportData.totalTransactions}{" "}
              <span className="text-lg text-slate-400 font-bold">Invoices</span>
            </p>
            <p className="text-xs font-bold text-purple-600 mt-2">
              Dibuat oleh sistem
            </p>
          </div>
        </div>

        {/* Pending Transactions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-yellow-400 hover:shadow-yellow-100 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-slate-50 group-hover:text-yellow-50 group-hover:scale-110 transition-all duration-500">
            <Clock size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Clock size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Pending Action
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              {reportData.activeTransactions}{" "}
              <span className="text-lg text-slate-400 font-bold">Waiting</span>
            </p>
            <p className="text-xs font-bold text-yellow-600 mt-2 flex items-center gap-1">
              <AlertCircle size={12} /> Butuh konfirmasi
            </p>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-teal-300 hover:shadow-teal-100 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-slate-50 group-hover:text-teal-50 group-hover:scale-110 transition-all duration-500">
            <Activity size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                <Activity size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Monthly Growth
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-3">
              +{reportData.monthlyGrowth}%
            </p>
            <p className="text-xs font-bold text-teal-600 mt-2">
              Bulan ke Bulan (MoM)
            </p>
          </div>
        </div>

        {/* Top Service */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-indigo-300 hover:shadow-indigo-100 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-slate-50 group-hover:text-indigo-50 group-hover:scale-110 transition-all duration-500">
            <Award size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Award size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Top Service
              </p>
            </div>
            <p className="text-xl font-black text-slate-900 mt-4 leading-tight line-clamp-2">
              {reportData.topService}
            </p>
            <p className="text-xs font-bold text-indigo-600 mt-2">
              Paling banyak diminati
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DETAILED CHARTS */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} /> Revenue Overview
          </h2>
          <div className="h-72 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group hover:bg-slate-100 transition-colors cursor-pointer">
            <BarChart3
              size={40}
              className="text-slate-300 mb-3 group-hover:scale-110 transition-transform"
            />
            <p className="text-slate-500 font-bold text-sm">
              Visualisasi Grafik Segera Hadir
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Integrasi Chart.js dalam tahap pengembangan.
            </p>
          </div>
        </div>

        {/* SUMMARY (DARK MODE CARD) */}
        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-blue-400">
              <FileText size={20} /> Executive Summary
            </h2>

            <div className="space-y-6">
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Total Kinerja
                </p>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  Guwigo telah memproses{" "}
                  <span className="text-white font-bold">
                    {reportData.totalTransactions} transaksi
                  </span>{" "}
                  dengan total pendapatan bersih mencapai{" "}
                  <span className="text-blue-400 font-bold">
                    Rp {reportData.totalRevenue.toLocaleString("id-ID")}
                  </span>
                  .
                </p>
              </div>

              <div className="border-l-2 border-yellow-500 pl-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Status Antrean
                </p>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  Terdapat{" "}
                  <span className="text-yellow-400 font-bold">
                    {reportData.activeTransactions} transaksi pending
                  </span>{" "}
                  yang sedang menunggu konfirmasi pembayaran atau tindakan dari
                  admin.
                </p>
              </div>

              <div className="border-l-2 border-emerald-500 pl-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Pertumbuhan
                </p>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  Bisnis mengalami pertumbuhan sebesar{" "}
                  <span className="text-emerald-400 font-bold">
                    +{reportData.monthlyGrowth}%
                  </span>{" "}
                  dibandingkan periode sebelumnya.
                </p>
              </div>
            </div>
          </div>

          <button className="relative z-10 mt-8 w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-colors">
            Generate Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
