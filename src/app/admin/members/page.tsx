"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  Trash2,
  Mail,
  Calendar,
  Shield,
  Search,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  X,
  ShieldAlert,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
type ToastType = "success" | "error" | "info";
interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

const ToastContainer = ({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) => (
  <div className="fixed top-6 right-6 z-[100] space-y-3 max-w-sm w-full pointer-events-none">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-right-8 duration-300 ${toast.type === "success" ? "bg-green-50 border border-green-200" : toast.type === "error" ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"}`}
      >
        {toast.type === "success" && (
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        )}
        {toast.type === "error" && (
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        )}
        {toast.type === "info" && (
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          {toast.title && (
            <p
              className={`font-bold text-sm tracking-wide ${toast.type === "success" ? "text-green-900" : toast.type === "error" ? "text-red-900" : "text-blue-900"}`}
            >
              {toast.title}
            </p>
          )}
          <p
            className={`text-sm mt-0.5 font-medium leading-relaxed ${toast.type === "success" ? "text-green-700" : toast.type === "error" ? "text-red-700" : "text-blue-700"}`}
          >
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-slate-400 hover:text-slate-900 bg-white/50 hover:bg-white p-1 rounded-full shrink-0 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

// ==========================================
// INTERFACES
// ==========================================
interface Member {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "member";
  createdAt: Timestamp;
  lastLogin?: Timestamp;
}

export default function MembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "member">(
    "all",
  );

  // State Modal Konfirmasi
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "promote" | "demote";
    uid: string;
    name: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => removeToast(id), 5000);
    },
    [],
  );
  const removeToast = useCallback(
    (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchQuery, roleFilter]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          uid: doc.id,
          name: d.name || d.displayName || d.fullName || (d.email ? d.email.split("@")[0] : "Pengguna"),
          email: d.email || "-",
          role: d.role === "admin" ? "admin" : "member",
          createdAt: d.createdAt || null,
          lastLogin: d.lastLogin || null,
          ...d,
        } as Member;
      });
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      showToast("Gagal memuat data member.", "error", "Koneksi Error");
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q),
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((m) => m.role === roleFilter);
    }
    setFilteredMembers(filtered);
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);

    try {
      if (confirmAction.type === "delete") {
        await deleteDoc(doc(db, "users", confirmAction.uid));
        showToast(
          `Member "${confirmAction.name}" berhasil dihapus.`,
          "success",
          "Terhapus",
        );
      } else if (confirmAction.type === "promote") {
        await updateDoc(doc(db, "users", confirmAction.uid), { role: "admin" });
        showToast(
          `"${confirmAction.name}" sekarang adalah Admin.`,
          "success",
          "Promoted",
        );
      } else if (confirmAction.type === "demote") {
        await updateDoc(doc(db, "users", confirmAction.uid), {
          role: "member",
        });
        showToast(
          `Hak akses "${confirmAction.name}" dicabut.`,
          "success",
          "Demoted",
        );
      }

      setConfirmAction(null);
      fetchMembers();
    } catch (error) {
      console.error(`Error executing ${confirmAction.type}:`, error);
      showToast("Tindakan gagal dieksekusi. Coba lagi.", "error", "Error");
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ["Name", "Email", "Role", "Joined Date"],
      ...filteredMembers.map((m) => [
        `"${m.name}"`,
        `"${m.email}"`,
        m.role,
        m.createdAt?.toDate?.().toLocaleDateString?.("id-ID") || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Guwigo-Members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    showToast("Data member berhasil diekspor.", "success", "Export Berhasil");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Data Pengguna...
        </p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="p-6 md:p-10 font-sans max-w-6xl mx-auto pb-24">
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
              <Users className="text-blue-600" /> Member Management
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Kelola akses pengguna, pantau member, dan tetapkan hak Admin.
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Download size={18} /> Export Data (CSV)
          </button>
        </div>

        {/* STATS & FILTERS */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Users
              </p>
              <p className="text-2xl font-black text-slate-900">
                {members.length}
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Admins
              </p>
              <p className="text-2xl font-black text-blue-600">
                {members.filter((m) => m.role === "admin").length}
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-auto flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer outline-none"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Hanya Admin</option>
              <option value="member">Hanya Member</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-5 pl-8">Pengguna</th>
                  <th className="p-5">Hak Akses</th>
                  <th className="p-5">Tgl Bergabung</th>
                  <th className="p-5 pr-8 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-slate-300" />
                      </div>
                      <p className="font-bold text-slate-900 text-lg mb-1">
                        Pengguna Tidak Ditemukan
                      </p>
                      <p className="text-slate-500 text-sm">
                        Coba gunakan kata kunci pencarian yang lain.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr
                      key={member.uid}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0 ${
                              member.role === "admin"
                                ? "bg-red-500"
                                : "bg-blue-600"
                            }`}
                          >
                            {(member.name || member.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">
                              {member.name || member.email?.split("@")[0] || "Pengguna"}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                              <Mail size={12} /> {member.email || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                            member.role === "admin"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                          }`}
                        >
                          <Shield size={12} />
                          {member.role === "admin" ? "Admin" : "Member"}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <Calendar size={14} />
                          {member.createdAt
                            ?.toDate?.()
                            .toLocaleDateString?.("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) || "-"}
                        </div>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {member.role === "member" ? (
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  type: "promote",
                                  uid: member.uid,
                                  name: member.name || member.email || "Pengguna",
                                })
                              }
                              className="px-3 py-2 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                              title="Jadikan Admin"
                            >
                              <ArrowUpCircle size={14} /> Promote
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  type: "demote",
                                  uid: member.uid,
                                  name: member.name || member.email || "Pengguna",
                                })
                              }
                              className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-600 hover:text-orange-700 border border-slate-200 hover:border-orange-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                              title="Turunkan ke Member"
                            >
                              <ArrowDownCircle size={14} /> Demote
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: "delete",
                                uid: member.uid,
                                name: member.name || member.email || "Pengguna",
                              })
                            }
                            className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl transition-all shadow-sm"
                            title="Hapus Akun"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==========================================
          UNIVERSAL CONFIRMATION MODAL
      ========================================== */}
      {confirmAction && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  confirmAction.type === "delete"
                    ? "bg-red-100"
                    : confirmAction.type === "promote"
                      ? "bg-emerald-100"
                      : "bg-orange-100"
                }`}
              >
                {confirmAction.type === "delete" ? (
                  <ShieldAlert className="w-8 h-8 text-red-600" />
                ) : confirmAction.type === "promote" ? (
                  <ArrowUpCircle className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ArrowDownCircle className="w-8 h-8 text-orange-600" />
                )}
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900 mb-1">
                  {confirmAction.type === "delete"
                    ? "Hapus Akun?"
                    : confirmAction.type === "promote"
                      ? "Jadikan Admin?"
                      : "Cabut Akses Admin?"}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {confirmAction.type === "delete" && (
                    <>
                      Anda akan menghapus{" "}
                      <span className="font-bold text-slate-900">
                        "{confirmAction.name}"
                      </span>{" "}
                      permanen.
                    </>
                  )}
                  {confirmAction.type === "promote" && (
                    <>
                      <span className="font-bold text-slate-900">
                        "{confirmAction.name}"
                      </span>{" "}
                      akan memiliki akses penuh ke Dashboard Admin.
                    </>
                  )}
                  {confirmAction.type === "demote" && (
                    <>
                      <span className="font-bold text-slate-900">
                        "{confirmAction.name}"
                      </span>{" "}
                      hanya akan bisa mengakses halaman member biasa.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                disabled={isProcessing}
              >
                Batal
              </button>
              <button
                onClick={executeConfirmAction}
                disabled={isProcessing}
                className={`flex-1 px-4 py-3 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg ${
                  confirmAction.type === "delete"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                    : confirmAction.type === "promote"
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                      : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
                }`}
              >
                {isProcessing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Ya, Lanjutkan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
