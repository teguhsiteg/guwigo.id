"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, Receipt, Save } from "lucide-react";
import { Button } from "@/components/ui";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Card, { CardHeader } from "@/components/ui/Card";
import {
  generateReceiptNumber,
  formatCurrency,
  amountToWords,
} from "@/types/invoice";
import { toast } from "sonner";

function CreateReceiptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramReceiptNumber = searchParams.get("receiptNumber") || "";
  const paramReceivedFrom = searchParams.get("receivedFrom") || "";
  const paramPurpose = searchParams.get("title") || searchParams.get("purpose") || "";

  const [receiptNumber, setReceiptNumber] = useState(paramReceiptNumber);
  const [isSaving, setIsSaving] = useState(false);

  // Form states (prefillable from searchParams)
  const [receivedFrom, setReceivedFrom] = useState(paramReceivedFrom);
  const [amount, setAmount] = useState<number>(
    Number(searchParams.get("amount")) || 0
  );
  const [purpose, setPurpose] = useState(
    paramPurpose ||
      (searchParams.get("invoiceNumber")
        ? `Pembayaran Invoice #${searchParams.get("invoiceNumber")}`
        : "")
  );
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [notes, setNotes] = useState("");
  const invoiceId = searchParams.get("invoiceId") || "";
  const invoiceNumber = searchParams.get("invoiceNumber") || "";
  const [useEmeterai, setUseEmeterai] = useState<boolean>(
    (Number(searchParams.get("amount")) || 0) > 5000000
  );
  const [emeteraiUrl, setEmeteraiUrl] = useState("");

  useEffect(() => {
    if (paramReceiptNumber) {
      setReceiptNumber(paramReceiptNumber);
      return;
    }
    const fetchNextNumber = async () => {
      try {
        const snap = await getDocs(collection(db, "receipts"));
        setReceiptNumber(generateReceiptNumber(snap.size));
      } catch {
        setReceiptNumber(generateReceiptNumber(0));
      }
    };
    fetchNextNumber();
  }, [paramReceiptNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receivedFrom.trim()) {
      toast.error("Nama pembayar (Diterima Dari) wajib diisi");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Jumlah pembayaran harus lebih dari 0");
      return;
    }
    if (!purpose.trim()) {
      toast.error("Keperluan pembayaran wajib diisi");
      return;
    }

    try {
      setIsSaving(true);
      const now = Timestamp.now();
      const payload = {
        receiptNumber,
        invoiceId: invoiceId || null,
        invoiceNumber: invoiceNumber || null,
        receivedFrom: receivedFrom.trim(),
        amount: Number(amount),
        amountInWords: amountToWords(Number(amount)),
        purpose: purpose.trim(),
        paymentMethod,
        status: "issued",
        notes: notes.trim(),
        useEmeterai,
        emeteraiUrl,
        issuedDate: now,
        createdAt: now,
      };

      const docRef = await addDoc(collection(db, "receipts"), payload);
      toast.success("Kuitansi berhasil diterbitkan!");
      router.push(`/admin/receipts/${docRef.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menerbitkan kuitansi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-20 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/receipts">
          <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Buat Kuitansi Baru</h1>
          <p className="text-sm text-slate-500 font-mono">{receiptNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6 space-y-4">
          <CardHeader
            title="Formulir Kuitansi Resmi"
            subtitle="Isi data pembayaran yang diterima"
            icon={<Receipt size={20} />}
          />

          <Input
            label="Telah Diterima Dari *"
            placeholder="Nama perorangan atau institusi / perusahaan"
            value={receivedFrom}
            onChange={(e) => setReceivedFrom(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <Input
              label="Uang Sejumlah (Rp) *"
              type="number"
              min={1}
              placeholder="Contoh: 1500000"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
            {amount > 0 && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                <span className="font-bold">Terbilang: </span>
                <span className="italic">{amountToWords(amount)}</span>
              </div>
            )}
          </div>

          <Textarea
            label="Untuk Pembayaran *"
            placeholder="Jelaskan peruntukan pembayaran, misal: Pelunasan Pembuatan Website Company Profile"
            rows={3}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />

          <Select
            label="Metode Pembayaran"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: "Transfer Bank", label: "Transfer Bank" },
              { value: "Tunai / Cash", label: "Tunai / Cash" },
              { value: "QRIS", label: "QRIS" },
              { value: "Midtrans / Payment Gateway", label: "Midtrans / Payment Gateway" },
              { value: "Lainnya", label: "Lainnya" },
            ]}
          />

          <Textarea
            label="Catatan Tambahan (Opsional)"
            placeholder="Catatan tambahan di lembar kuitansi..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* OPSI E-METERAI */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={useEmeterai}
                onChange={(e) => setUseEmeterai(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              Bubuhkan E-Meterai Rp 10.000 (PERURI)
              {amount > 5000000 && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  Dianjurkan (UU Bea Meterai &gt; Rp 5 Juta)
                </span>
              )}
            </label>
            {useEmeterai && (
              <div className="pl-6 space-y-1">
                <p className="text-[11px] text-slate-500">
                  Slot resmi meterai elektronik akan dicetak di samping tanda tangan Finance. Anda dapat memasukkan URL gambar QR e-meterai jika sudah memilikinya:
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
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/receipts">
            <Button variant="outline">Batal</Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={isSaving} icon={<Save size={16} />}>
            Terbitkan Kuitansi
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateReceiptPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Memuat formulir kuitansi...</div>}>
      <CreateReceiptForm />
    </Suspense>
  );
}
