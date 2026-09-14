"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Card, { CardHeader } from "@/components/ui/Card";
import {
  InvoiceItem,
  generateInvoiceNumber,
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

function CreateInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);

  // Prefill invoiceNumber from query param if generated from /admin/number-generator
  const paramInvoiceNumber = searchParams.get("invoiceNumber") || "";
  const paramClientName = searchParams.get("clientName") || "";
  const paramTitle = searchParams.get("title") || "";

  const [invoiceNumber, setInvoiceNumber] = useState(paramInvoiceNumber);

  // Client info
  const [clientName, setClientName] = useState(paramClientName);
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // Invoice details
  const [items, setItems] = useState<InvoiceItem[]>([
    paramTitle
      ? { description: paramTitle, quantity: 1, unit: "paket", unitPrice: 0, amount: 0 }
      : { ...emptyItem },
  ]);
  const [taxRate, setTaxRate] = useState(0); // PPN default 0 (opsional)
  const [pphRate, setPphRate] = useState(0); // Potongan PPh (misal 2%)
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [useEmeterai, setUseEmeterai] = useState(false);
  const [emeteraiUrl, setEmeteraiUrl] = useState("");

  // Generate invoice number on mount if not provided via searchParams
  useEffect(() => {
    if (paramInvoiceNumber) {
      setInvoiceNumber(paramInvoiceNumber);
      return;
    }
    const generate = async () => {
      try {
        const snap = await getDocs(collection(db, "invoices"));
        setInvoiceNumber(generateInvoiceNumber(snap.size));
      } catch {
        setInvoiceNumber(generateInvoiceNumber(0));
      }
    };
    generate();
  }, [paramInvoiceNumber]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const pphAmount = Math.round(subtotal * (pphRate / 100));
  const total = subtotal + taxAmount - pphAmount - discount;

  const updateItem = useCallback(
    (index: number, field: keyof InvoiceItem, value: string | number) => {
      setItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        updated[index].amount =
          updated[index].quantity * updated[index].unitPrice;
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

  const handleSubmit = async (status: "draft" | "sent") => {
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
      const now = Timestamp.now();
      const invoiceData = {
        invoiceNumber,
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
        status,
        notes,
        useEmeterai,
        emeteraiUrl,
        dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        issuedDate: now,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, "invoices"), invoiceData);
      toast.success(
        status === "draft"
          ? "Invoice disimpan sebagai draft"
          : "Invoice berhasil dibuat & terkirim"
      );
      router.push(`/admin/invoices/${docRef.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan invoice");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/invoices">
          <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Buat Invoice Baru</h1>
          <p className="text-sm text-slate-500 font-mono">{invoiceNumber}</p>
        </div>
      </div>

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
              rows={3}
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
              <span className="text-2xl font-black text-blue-600">
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
                    Slot resmi e-meterai akan ditampilkan di samping tanda tangan Finance. Jika memiliki file/gambar QR e-meterai, masukkan URL di bawah:
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Link href="/admin/invoices">
          <Button variant="outline" fullWidth className="sm:w-auto">
            Batal
          </Button>
        </Link>
        <Button
          variant="secondary"
          icon={<Save size={16} />}
          isLoading={isSaving}
          onClick={() => handleSubmit("draft")}
        >
          Simpan Draft
        </Button>
        <Button
          icon={<FileSpreadsheet size={16} />}
          isLoading={isSaving}
          onClick={() => handleSubmit("sent")}
        >
          Buat & Kirim Invoice
        </Button>
      </div>
    </div>
  );
}

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Memuat formulir invoice...</div>}>
      <CreateInvoiceForm />
    </Suspense>
  );
}
