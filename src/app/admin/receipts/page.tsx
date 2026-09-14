"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import {
  Receipt,
  Plus,
  Search,
  Trash2,
  Eye,
  Loader2,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import { Button, Badge, StatCard } from "@/components/ui";
import Card from "@/components/ui/Card";
import {
  Receipt as ReceiptType,
  formatCurrency,
} from "@/types/invoice";
import { toast } from "sonner";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, "receipts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ReceiptType));
      setReceipts(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat daftar kuitansi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, number: string) => {
    if (!confirm(`Hapus kuitansi "${number}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deleteDoc(doc(db, "receipts", id));
      toast.success("Kuitansi berhasil dihapus");
      fetchReceipts();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus kuitansi");
    }
  };

  const filtered = receipts.filter((rc) => {
    const matchSearch =
      !searchQuery ||
      rc.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rc.receivedFrom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rc.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rc.invoiceNumber && rc.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Receipt size={22} />
            </div>
            Manajemen Kuitansi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Buat tanda terima pembayaran resmi dan cetak bukti kas masuk
          </p>
        </div>
        <Link href="/admin/receipts/create">
          <Button icon={<Plus size={16} />}>Buat Kuitansi Baru</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Kuitansi"
          value={receipts.length}
          iconBg="bg-blue-50 text-blue-600"
          icon={<Receipt size={18} />}
        />
        <StatCard
          title="Total Dana Diterima"
          value={formatCurrency(totalAmount)}
          iconBg="bg-emerald-50 text-emerald-600"
          icon={<Receipt size={18} />}
        />
        <StatCard
          title="Bulan Ini"
          value={receipts.filter(r => {
            const date = r.issuedDate?.toDate?.();
            if (!date) return false;
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }).length + " Dokumen"}
          iconBg="bg-cyan-50 text-cyan-600"
          icon={<Receipt size={18} />}
        />
      </div>

      {/* Filter & Search */}
      <Card className="mb-6" padding="sm">
        <div className="flex gap-3 p-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor kuitansi, nama pembayar, atau keperluan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Receipts List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Kuitansi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <Receipt size={40} className="text-slate-200 mx-auto mb-4" />
          <p className="font-bold text-slate-900 text-lg mb-1">Belum Ada Kuitansi</p>
          <p className="text-slate-500 text-sm mb-6">Buat kuitansi baru sebagai bukti penerimaan pembayaran</p>
          <Link href="/admin/receipts/create">
            <Button icon={<Plus size={16} />}>Buat Kuitansi Pertama</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((rc) => (
            <Card key={rc.id} hover padding="none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Receipt size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {rc.receiptNumber}
                      </span>
                      {rc.invoiceNumber && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                          Inv: {rc.invoiceNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      {rc.receivedFrom}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-md">
                      {rc.purpose}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 font-mono">
                      {formatCurrency(rc.amount)}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {rc.issuedDate?.toDate?.().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/receipts/${rc.id}`}>
                      <button
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Lihat & Cetak"
                      >
                        <Eye size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(rc.id, rc.receiptNumber)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
