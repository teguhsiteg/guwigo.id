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
  Calendar,
  DollarSign,
  User,
  FileText,
  ChevronDown,
  Loader2,
  Filter,
  CreditCard,
  Hash,
  AlertCircle,
  CheckCircle, // <--- Tambahkan ini di sini
} from "lucide-react";

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  method: "tripay" | "wa";
  description: string;
  createdAt: Timestamp;
}

export default function TransactionsAdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "transactions"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (t) => statusFilter === "all" || t.status === statusFilter,
  );

  const stats = {
    total: transactions.reduce(
      (sum, t) => (t.status === "completed" ? sum + t.amount : sum),
      0,
    ),
    pending: transactions.filter((t) => t.status === "pending").length,
    completed: transactions.filter((t) => t.status === "completed").length,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Data Transaksi...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-sans max-w-6xl mx-auto pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <CreditCard className="text-blue-600" size={32} /> Transactions
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Pantau arus kas, status pembayaran Tripay, dan riwayat pesanan
            klien.
          </p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
          <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 transition-colors">
            <DollarSign size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
              Total Revenue
            </p>
            <p className="text-3xl font-black text-slate-900">
              Rp {stats.total.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-green-600 font-bold mt-2">
              Uang Masuk Terverifikasi
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-yellow-200 transition-colors">
          <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-yellow-50 transition-colors">
            <FileText size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
              Pending Payment
            </p>
            <p className="text-3xl font-black text-slate-900">
              {stats.pending}{" "}
              <span className="text-lg text-slate-400 font-bold">
                transaksi
              </span>
            </p>
            <p className="text-xs text-yellow-600 font-bold mt-2">
              Menunggu Pembayaran
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
          <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 transition-colors">
            <CheckCircle size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
              Completed
            </p>
            <p className="text-3xl font-black text-slate-900">
              {stats.completed}{" "}
              <span className="text-lg text-slate-400 font-bold">
                transaksi
              </span>
            </p>
            <p className="text-xs text-emerald-600 font-bold mt-2">
              Transaksi Sukses
            </p>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-3 px-2">
          <Filter size={18} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">
            Filter by Status:
          </span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="flex-1 sm:max-w-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="all">Semua Transaksi</option>
          <option value="completed">✅ Completed (Sukses)</option>
          <option value="pending">⏳ Pending (Menunggu)</option>
          <option value="failed">❌ Failed (Gagal/Batal)</option>
        </select>
      </div>

      {/* TRANSACTIONS LIST */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-900 text-lg mb-1">
              Tidak Ada Transaksi
            </p>
            <p className="text-slate-500 text-sm">
              Belum ada transaksi dengan status tersebut.
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                expandedId === transaction.id
                  ? "border-blue-300 shadow-lg ring-4 ring-blue-50"
                  : "border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === transaction.id ? null : transaction.id,
                  )
                }
                className="w-full p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors text-left"
              >
                {/* User Info & Main Data */}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      transaction.status === "completed"
                        ? "bg-emerald-50 text-emerald-600"
                        : transaction.status === "pending"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-red-50 text-red-600"
                    }`}
                  >
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg">
                      {transaction.userName}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">
                      {transaction.description}
                    </p>
                  </div>
                </div>

                {/* Amount & Status */}
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-slate-900 font-black text-xl">
                      Rp {transaction.amount.toLocaleString("id-ID")}
                    </p>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                          transaction.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-full text-slate-400">
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${expandedId === transaction.id ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              <div
                className={`transition-all duration-300 ease-in-out ${expandedId === transaction.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
              >
                <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Hash size={12} /> Trans. ID
                    </p>
                    <p className="text-slate-900 font-mono text-sm font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                      {transaction.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Calendar size={12} /> Tanggal
                    </p>
                    <p className="text-slate-900 text-sm font-bold">
                      {transaction.createdAt
                        ?.toDate?.()
                        .toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }) || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <User size={12} /> Email Klien
                    </p>
                    <p className="text-slate-900 text-sm font-bold">
                      {transaction.userEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <CreditCard size={12} /> Payment Method
                    </p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-widest bg-slate-900 text-white">
                      {transaction.method === "tripay"
                        ? "TriPay Gateway"
                        : "WhatsApp Manual"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
