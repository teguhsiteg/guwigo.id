"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import {
  FileSpreadsheet,
  Plus,
  Search,
  Trash2,
  Eye,
  Pencil,
  Loader2,
  Filter,
} from "lucide-react";
import { Button, Badge, StatCard } from "@/components/ui";
import Card, { CardHeader } from "@/components/ui/Card";
import {
  Invoice,
  InvoiceStatus,
  INVOICE_STATUS_MAP,
  formatCurrency,
} from "@/types/invoice";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>("all");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invoice));
      setInvoices(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat daftar invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, number: string) => {
    if (!confirm(`Hapus invoice "${number}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deleteDoc(doc(db, "invoices", id));
      toast.success("Invoice berhasil dihapus");
      fetchInvoices();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus invoice");
    }
  };

  const filtered = invoices.filter((inv) => {
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === "draft").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    totalRevenue: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.total, 0),
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileSpreadsheet size={22} />
            </div>
            Manajemen Invoice
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Buat, kelola, dan cetak invoice untuk klien Anda
          </p>
        </div>
        <Link href="/admin/invoices/create">
          <Button icon={<Plus size={16} />}>Buat Invoice Baru</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Invoice" value={stats.total} iconBg="bg-blue-50 text-blue-600" icon={<FileSpreadsheet size={18} />} />
        <StatCard title="Draft" value={stats.draft} iconBg="bg-slate-100 text-slate-600" icon={<FileSpreadsheet size={18} />} />
        <StatCard title="Terkirim" value={stats.sent} iconBg="bg-cyan-50 text-cyan-600" icon={<FileSpreadsheet size={18} />} />
        <StatCard title="Lunas" value={formatCurrency(stats.totalRevenue)} iconBg="bg-emerald-50 text-emerald-600" icon={<FileSpreadsheet size={18} />} />
      </div>

      {/* Filter & Search */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col sm:flex-row gap-3 p-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor invoice atau nama klien..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Terkirim</option>
              <option value="paid">Lunas</option>
              <option value="overdue">Jatuh Tempo</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoice List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Invoice...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <FileSpreadsheet size={40} className="text-slate-200 mx-auto mb-4" />
          <p className="font-bold text-slate-900 text-lg mb-1">Belum Ada Invoice</p>
          <p className="text-slate-500 text-sm mb-6">Buat invoice pertama Anda untuk mulai mengelola tagihan</p>
          <Link href="/admin/invoices/create">
            <Button icon={<Plus size={16} />}>Buat Invoice Pertama</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => {
            const statusInfo = INVOICE_STATUS_MAP[inv.status];
            return (
              <Card key={inv.id} hover padding="none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {inv.invoiceNumber}
                        </span>
                        <Badge variant={statusInfo.variant} dot>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 truncate mt-0.5">
                        {inv.client.name}
                        {inv.client.company && ` — ${inv.client.company}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">
                        {formatCurrency(inv.total)}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {inv.issuedDate?.toDate?.().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }) || "-"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/invoices/${inv.id}`}>
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Lihat Detail & Cetak">
                          <Eye size={16} />
                        </button>
                      </Link>
                      <Link href={`/admin/invoices/${inv.id}/edit`}>
                        <button className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors" title="Edit Invoice">
                          <Pencil size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
