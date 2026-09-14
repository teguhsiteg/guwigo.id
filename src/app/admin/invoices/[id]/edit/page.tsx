"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Calculator,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Card, { CardHeader } from "@/components/ui/Card";
import {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  formatCurrency,
} from "@/types/invoice";
import { toast } from "sonner";
import Link from "next/link";

const emptyItem: InvoiceItem = {
  description: "",
  quantity: 1,
  unit: "pcs",
  unitPrice: 0,
  amount: 0,
};

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Terkirim" },
  { value: "paid", label: "Lunas" },
  { value: "overdue", label: "Jatuh Tempo" },
  { value: "cancelled", label: "Dibatalkan" },
];

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("draft");
  const [issuedDate, setIssuedDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Client info
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // Items & Calculations
  const [items, setItems] = useState<InvoiceItem[]>([{ ...emptyItem }]);
  const [taxRate, setTaxRate] = useState(0);
  const [pphRate, setPphRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [useEmeterai, setUseEmeterai] = useState(false);
  const [emeteraiUrl, setEmeteraiUrl] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "invoices", id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          toast.error("Invoice tidak ditemukan");
          router.push("/admin/invoices");
          return;
        }

        const data = snap.data() as Invoice;
        setInvoiceNumber(data.invoiceNumber || "");
        setStatus(data.status || "draft");
        setClientName(data.client?.name || "");
        setClientCompany(data.client?.company || "");
        setClientEmail(data.client?.email || "");
        setClientPhone(data.client?.phone || "");
        setClientAddress(data.client?.address || "");
        setItems(data.items && data.items.length > 0 ? data.items : [{ ...emptyItem }]);
        setTaxRate(data.taxRate || 0);
        setPphRate(data.pphRate || 0);
        setDiscount(data.discount || 0);
        setNotes(data.notes || "");
        setUseEmeterai(!!data.useEmeterai);
        setEmeteraiUrl(data.emeteraiUrl || "");

        if (data.issuedDate?.toDate) {
          setIssuedDate(data.issuedDate.toDate().toISOString().split("T")[0]);
        }
        if (data.dueDate?.toDate) {
          setDueDate(data.dueDate.toDate().toISOString().split("T")[0]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data invoice");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id, router]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const pphAmount = Math.round(subtotal * (pphRate / 100));
  const total = Math.max(0, subtotal + taxAmount - pphAmount - discount);

  const updateItem = useCallback(
    (index: number, field: keyof InvoiceItem, value: string | number) => {
      setItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        updated[index].amount =
          (updated[index].quantity || 0) * (updated[index].unitPrice || 0);
        return updated;
      });
    },
    []
  );

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!clientName.trim()) {
      toast.error("Nama klien wajib diisi");
      return;
    }
    if (items.some((item) => !item.description.trim())) {
      toast.error("Semua item harus memiliki deskripsi");
      return;
    }
    if (total <= 0) {
      toast.error("Total invoice harus lebih dari 0");
      return;
    }

    try {
      setIsSaving(true);
      const docRef = doc(db, "invoices", id);
      const now = Timestamp.now();

      const updatePayload: Record<string, any> = {
        invoiceNumber,
        status,
        client: {
          name: clientName,
          company: clientCompany,
          email: clientEmail,
          phone: clientPhone,
          address: clientAddress,
        },
        items,
        subtotal,
        taxRate,
        taxAmount,
        pphRate,
        pphAmount,
        discount,
        total,
        notes,
        useEmeterai,
        emeteraiUrl,
        updatedAt: now,
      };

      if (issuedDate) {
        updatePayload.issuedDate = Timestamp.fromDate(new Date(issuedDate));
      }
      if (dueDate) {
        updatePayload.dueDate = Timestamp.fromDate(new Date(dueDate));
      }
      if (status === "paid") {
        updatePayload.paidDate = now;
      }

      await updateDoc(docRef, updatePayload);
      toast.success("Invoice berhasil diperbarui");
      router.push(`/admin/invoices/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan perubahan invoice");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus invoice "${invoiceNumber}"? Tindakan ini permanen dan tidak bisa dibatalkan.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "invoices", id));
      toast.success("Invoice berhasil dihapus");
      router.push("/admin/invoices");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus invoice");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Memuat Data Invoice...
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/admin/invoices/${id}`}>
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Edit Invoice</h1>
            <p className="text-sm text-slate-500 font-mono">{invoiceNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:border-red-200"
            isLoading={isDeleting}
            onClick={handleDelete}
            icon={<Trash2 size={16} />}
          >
            Hapus
          </Button>
          <Button
            size="sm"
            isLoading={isSaving}
            onClick={handleSave}
            icon={<Save size={16} />}
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>

      {/* Basic Settings */}
      <Card className="mb-6">
        <CardHeader
          title="Pengaturan Dokumen"
          subtitle="Nomor, status, dan tanggal invoice"
          icon={<FileSpreadsheet size={20} />}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nomor Invoice"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
              options={statusOptions}
            />
          </div>
          <div>
            <Input
              label="Tanggal Terbit"
              type="date"
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Client Info */}
      <Card className="mb-6">
        <CardHeader
          title="Informasi Klien"
          subtitle="Data penerima invoice"
          icon={<FileSpreadsheet size={20} />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama Klien *"
            placeholder="Nama lengkap atau perusahaan"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <Input
            label="Perusahaan / Instansi"
            placeholder="Nama instansi (opsional)"
            value={clientCompany}
            onChange={(e) => setClientCompany(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@klien.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <Input
            label="No. Telepon"
            placeholder="08xxxxxxxxxx"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
          <div className="md:col-span-2">
            <Textarea
              label="Alamat"
              placeholder="Alamat lengkap klien"
              rows={2}
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card className="mb-6">
        <CardHeader
          title="Item Invoice"
          subtitle="Daftar produk/jasa yang ditagihkan"
          icon={<Calculator size={20} />}
          action={
            <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={addItem}>
              Tambah Item
            </Button>
          }
        />

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl p-4 border border-slate-100"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Item #{idx + 1}
                </span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(idx)}
                    className="p-1 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5">
                  <Input
                    placeholder="Deskripsi item"
                    value={item.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateItem(idx, "quantity", parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    placeholder="Satuan (pcs/jam)"
                    value={item.unit}
                    onChange={(e) => updateItem(idx, "unit", e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Harga Satuan"
                    value={item.unitPrice || ""}
                    onChange={(e) =>
                      updateItem(idx, "unitPrice", parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="text-right mt-2 text-xs font-bold text-slate-600">
                Subtotal: {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Invoice Settings & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader title="Pengaturan & Catatan" />
          <div className="space-y-4">
            <Input
              label="Jatuh Tempo"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Textarea
              label="Catatan Invoice"
              placeholder="Instruksi pembayaran, rekening bank, atau catatan lainnya..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Ringkasan Biaya" />
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold text-slate-900 font-mono">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-slate-500">Pajak (PPN)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                  className="w-16 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                />
                <span className="text-xs text-slate-400">%</span>
                <span className="font-bold text-slate-900">{formatCurrency(taxAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-slate-500">Potongan PPh 21/23</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={pphRate}
                  onChange={(e) => setPphRate(parseInt(e.target.value) || 0)}
                  className="w-16 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-red-600"
                />
                <span className="text-xs text-slate-400">%</span>
                <span className="font-bold text-red-600">-{formatCurrency(pphAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-slate-500">Diskon</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  className="w-24 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-base">TOTAL</span>
              <span className="text-2xl font-black text-blue-600 font-mono">
                {formatCurrency(total)}
              </span>
            </div>

            {/* OPSI E-METERAI */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={useEmeterai}
                  onChange={(e) => setUseEmeterai(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                Bubuhkan E-Meterai Rp 10.000 (PERURI)
              </label>
              {useEmeterai && (
                <div className="pl-6 space-y-1">
                  <p className="text-[11px] text-slate-500">
                    Slot resmi e-meterai akan ditampilkan di samping tanda tangan Finance. Jika memiliki gambar/QR e-meterai, masukkan URL di bawah:
                  </p>
                  <input
                    type="text"
                    placeholder="URL gambar QR e-meterai (Opsional)"
                    value={emeteraiUrl}
                    onChange={(e) => setEmeteraiUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Link href={`/admin/invoices/${id}`}>
          <Button variant="outline" fullWidth className="sm:w-auto">
            Batal
          </Button>
        </Link>
        <Button
          icon={<Save size={16} />}
          isLoading={isSaving}
          onClick={handleSave}
        >
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
