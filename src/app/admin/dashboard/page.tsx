"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  DollarSign,
  Users,
  Activity,
  BarChart3,
  Loader2,
  Settings,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { Transaction } from "@/types/payment";
import TopLoadingBar from "../components/TopLoadingBar";

interface DashboardStats {
  totalRevenue: number;
  totalMembers: number;
  totalTransactions: number;
  recentTransactions: Transaction[];
  monthlyRevenue: number;
  activeSubscriptions: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalMembers: 0,
    totalTransactions: 0,
    recentTransactions: [],
    monthlyRevenue: 0,
    activeSubscriptions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Check admin access (Basic fast check before Layout handles it fully)
    const adminSession = localStorage.getItem("guwigo_admin_session");
    if (!adminSession) {
      router.push("/login");
      return;
    }

    // We don't need to manually kick the user out here because 
    // src/app/admin/layout.tsx and AuthContext.tsx already handle it correctly 
    // including the SuperAdmin email fallback. 
    // We just get the admin name for the UI.
    const getAdminDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setAdminName(user.displayName || "Admin");
        }
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error getting admin details:", error);
        setIsAuthorized(true);
      }
    };

    getAdminDetails();
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthorized) return;

      try {
        setIsLoading(true);

        // Fetch all paid transactions
        const transactionsRef = collection(db, "transactions");
        const paidQuery = query(transactionsRef, where("status", "==", "paid"));
        const transactionsSnapshot = await getDocs(paidQuery);

        let totalRevenue = 0;
        let monthlyRevenue = 0;
        const allTransactions: Transaction[] = [];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        transactionsSnapshot.forEach((doc) => {
          const transaction = doc.data() as Transaction;
          allTransactions.push(transaction);
          totalRevenue += transaction.amount;

          // Calculate monthly revenue
          const transDate = new Date(
            transaction.paidAt || transaction.createdAt,
          );
          if (
            transDate.getMonth() === currentMonth &&
            transDate.getFullYear() === currentYear
          ) {
            monthlyRevenue += transaction.amount;
          }
        });

        // Sort by date and get recent ones
        const recentTransactions = allTransactions
          .sort(
            (a, b) =>
              new Date(b.paidAt || b.createdAt).getTime() -
              new Date(a.paidAt || a.createdAt).getTime(),
          )
          .slice(0, 10);

        // Fetch total members (users with role: member)
        const usersRef = collection(db, "users");
        const membersQuery = query(usersRef, where("role", "==", "member"));
        const membersSnapshot = await getDocs(membersQuery);
        const totalMembers = membersSnapshot.size;

        // Fetch active subscriptions
        const subsRef = collection(db, "user_subscriptions");
        const subsSnapshot = await getDocs(subsRef);
        let activeSubscriptions = 0;

        subsSnapshot.forEach((doc) => {
          const sub = doc.data();
          if (!sub.expiresAt || new Date(sub.expiresAt) > new Date()) {
            activeSubscriptions++;
          }
        });

        setStats({
          totalRevenue,
          totalMembers,
          totalTransactions: transactionsSnapshot.size,
          recentTransactions,
          monthlyRevenue,
          activeSubscriptions,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted && isAuthorized) {
      fetchStats();
    }
  }, [isMounted, isAuthorized]);

  if (!isMounted || !isAuthorized) {
    return <TopLoadingBar />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hari ini, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Kemarin";
    }

    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Selamat datang kembali, <span className="font-bold text-slate-700">{adminName}</span>. Pantau performa bisnis Guwigo secara real-time.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-xs font-bold shadow-sm flex items-center gap-2 text-green-600 uppercase tracking-widest w-fit">
          <Activity size={14} /> System Online
        </div>
      </div>

        {/* STATS WIDGETS */}
        {isLoading ? (
          <div className="py-20">
            <TopLoadingBar />
          </div>
        ) : (
          <>
            {/* QUICK OPERATIONS / MANAGEMENT SHORTCUTS */}
            <div className="mb-10 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                <Settings size={18} className="text-blue-600" />
                Pusat Operasional Cepat
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link
                  href="/admin/hero"
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Activity size={20} />
                  </div>
                  <p className="font-bold text-sm text-slate-900">Landing Page</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hero & Branding Web</p>
                </Link>

                <Link
                  href="/admin/portfolio"
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BarChart3 size={20} />
                  </div>
                  <p className="font-bold text-sm text-slate-900">Portofolio</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tambah / Edit Karya</p>
                </Link>

                <Link
                  href="/admin/products"
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <DollarSign size={20} />
                  </div>
                  <p className="font-bold text-sm text-slate-900">Guwigo Store</p>
                  <p className="text-xs text-slate-500 mt-0.5">Kelola Produk & Jasa</p>
                </Link>

                <Link
                  href="/admin/services"
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                  <p className="font-bold text-sm text-slate-900">Layanan Platform</p>
                  <p className="text-xs text-slate-500 mt-0.5">Atur Ekosistem & Solusi</p>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Revenue Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-blue-200 transition-colors">
                <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 transition-colors">
                  <DollarSign size={100} />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                    Total Pendapatan
                  </p>
                  <h3 className="text-3xl font-black text-slate-900">
                    {formatCurrency(stats.totalRevenue)}
                  </h3>
                  <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp size={14} />+{stats.totalTransactions} transaksi
                  </p>
                </div>
              </div>

              {/* Total Members Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-blue-200 transition-colors">
                <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 transition-colors">
                  <Users size={100} />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                    Total Member
                  </p>
                  <h3 className="text-3xl font-black text-slate-900">
                    {stats.totalMembers}{" "}
                    <span className="text-lg text-slate-400 font-bold">
                      pengguna
                    </span>
                  </h3>
                  <p className="text-xs text-blue-500 font-bold mt-2 flex items-center gap-1">
                    <Users size={14} />
                    Registered
                  </p>
                </div>
              </div>

              {/* Active Subscriptions Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-blue-200 transition-colors">
                <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 transition-colors">
                  <BarChart3 size={100} />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                    Langganan Aktif
                  </p>
                  <h3 className="text-3xl font-black text-slate-900">
                    {stats.activeSubscriptions}
                  </h3>
                  <p className="text-xs text-orange-500 font-bold mt-2 flex items-center gap-1">
                    <Clock size={14} />
                    Status Aktif
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">
                  Pendapatan Bulan Ini
                </p>
                <h3 className="text-3xl font-black text-slate-900">
                  {formatCurrency(stats.monthlyRevenue)}
                </h3>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">
                  Total Transaksi (Lunas)
                </p>
                <h3 className="text-3xl font-black text-slate-900">
                  {stats.totalTransactions} transaksi
                </h3>
              </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-lg">
                  Pembelian Terbaru ({stats.recentTransactions.length})
                </h3>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Lihat Semua
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 pl-6">Customer / Email</th>
                      <th className="p-4">Layanan / Paket</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Nominal</th>
                      <th className="p-4 pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {stats.recentTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-slate-500"
                        >
                          Belum ada transaksi
                        </td>
                      </tr>
                    ) : (
                      stats.recentTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-4 pl-6">
                            <p className="font-bold text-slate-900">
                              {transaction.userName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {transaction.userEmail}
                            </p>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-slate-900">
                                {transaction.serviceName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {transaction.packageName}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {formatDate(
                              transaction.paidAt || transaction.createdAt,
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-900">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="p-4 pr-6">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                transaction.status === "paid"
                                  ? "bg-green-50 text-green-600 border-green-200"
                                  : transaction.status === "pending"
                                    ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                    : "bg-red-50 text-red-600 border-red-200"
                              }`}
                            >
                              {transaction.status === "paid"
                                ? "Lunas"
                                : transaction.status === "pending"
                                  ? "Menunggu"
                                  : "Gagal"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
    </div>
  );
}
