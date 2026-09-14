"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Printer,
  FileSpreadsheet,
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Loader2,
  QrCode,
  ShieldCheck,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import {
  Invoice,
  InvoiceStatus,
  INVOICE_STATUS_MAP,
  formatCurrency,
  amountToWords,
} from "@/types/invoice";
import { toast } from "sonner";
import { InvoiceSettings, defaultInvoiceSettings } from "../settings/page";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<InvoiceSettings>(defaultInvoiceSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isPrintingPdf, setIsPrintingPdf] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "invoices", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInvoice({ id: docSnap.id, ...docSnap.data() } as Invoice);
        } else {
          toast.error("Invoice tidak ditemukan");
          router.push("/admin/invoices");
        }

        // Fetch custom invoice settings
        const settingsSnap = await getDoc(doc(db, "admin", "invoice-settings"));
        if (settingsSnap.exists()) {
          setSettings({ ...defaultInvoiceSettings, ...settingsSnap.data() });
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

  const handleUpdateStatus = async (newStatus: InvoiceStatus) => {
    if (!invoice) return;
    try {
      setIsUpdating(true);
      const docRef = doc(db, "invoices", invoice.id);
      const updatePayload: Partial<Invoice> = {
        status: newStatus,
        updatedAt: Timestamp.now(),
      };
      if (newStatus === "paid") {
        updatePayload.paidDate = Timestamp.now();
      }

      await updateDoc(docRef, updatePayload);
      setInvoice((prev) => (prev ? { ...prev, ...updatePayload } : null));
      toast.success(`Status invoice diubah menjadi ${INVOICE_STATUS_MAP[newStatus].label}`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui status invoice");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = async () => {
    const element = document.getElementById("invoice-printable-doc");
    if (!element || !invoice) return;
    try {
      setIsPrintingPdf(true);
      toast.info("Menyiapkan dokumen cetak PDF (A4)...");

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Memuat Dokumen Cetak - ${invoice.invoiceNumber}</title>
              <style>
                body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #334155; }
                .spinner { width: 44px; height: 44px; border: 4px solid #cbd5e1; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
                @keyframes spin { to { transform: rotate(360deg); } }
              </style>
            </head>
            <body>
              <div style="text-align: center;">
                <div class="spinner"></div>
                <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 700;">Menyiapkan Dokumen PDF A4...</h3>
                <p style="margin: 0; font-size: 13px; color: #64748b;">Membuka format cetak PDF blob...</p>
              </div>
            </body>
          </html>
        `);
      }

      const html2pdf = (await import("html2pdf.js")).default;
      const cleanNumber = invoice.invoiceNumber.replace(/[\/\\]/g, "_");
      const clientClean = (invoice.client?.name || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
      const opt: any = {
        margin: [8, 10, 8, 10],
        filename: `${cleanNumber}_${clientClean}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      const worker = html2pdf().set(opt).from(element);
      const pdfBlob: Blob = await worker.outputPdf("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);

      if (printWindow) {
        printWindow.location.href = blobUrl;
      } else {
        window.open(blobUrl, "_blank");
      }
      toast.success("Dokumen PDF (blob) berhasil dibuka");
    } catch (err) {
      console.error("Gagal membuka dokumen PDF:", err);
      toast.error("Gagal membuka dokumen cetak PDF");
    } finally {
      setIsPrintingPdf(false);
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById("invoice-printable-doc");
    if (!element || !invoice) return;
    try {
      setIsExportingPdf(true);
      const html2pdf = (await import("html2pdf.js")).default;
      const cleanNumber = invoice.invoiceNumber.replace(/[\/\\]/g, "_");
      const clientClean = (invoice.client?.name || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
      const opt: any = {
        margin: [8, 10, 8, 10],
        filename: `${cleanNumber}_${clientClean}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF A4 berhasil diunduh");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Gagal membuat file PDF");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoice) return;
    if (!confirm(`Hapus invoice "${invoice.invoiceNumber}"? Tindakan ini permanen dan tidak bisa dibatalkan.`)) {
      return;
    }
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "invoices", invoice.id));
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
          Memuat Detail Invoice...
        </p>
      </div>
    );
  }

  if (!invoice) return null;

  const statusBadge = INVOICE_STATUS_MAP[invoice.status];

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/invoices">
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 font-mono">
                {invoice.invoiceNumber}
              </h1>
              <Badge variant={statusBadge.variant} dot>
                {statusBadge.label}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dibuat pada{" "}
              {invoice.issuedDate?.toDate?.().toLocaleDateString("id-ID", {
                dateStyle: "medium",
              }) || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status !== "paid" && (
            <Button
              variant="success"
              size="sm"
              isLoading={isUpdating}
              onClick={() => handleUpdateStatus("paid")}
              icon={<CheckCircle2 size={16} />}
            >
              Tandai Lunas
            </Button>
          )}

          <Link href={`/admin/invoices/${invoice.id}/edit`}>
            <Button variant="outline" size="sm" icon={<Pencil size={16} />}>
              Edit
            </Button>
          </Link>

          <Link
            href={`/admin/receipts/create?invoiceId=${invoice.id}&invoiceNumber=${encodeURIComponent(
              invoice.invoiceNumber
            )}&receivedFrom=${encodeURIComponent(
              invoice.client.name
            )}&amount=${invoice.total}`}
          >
            <Button variant="outline" size="sm" icon={<Receipt size={16} />}>
              Buat Kuitansi
            </Button>
          </Link>

          <Button
            size="sm"
            isLoading={isExportingPdf}
            onClick={handleDownloadPdf}
            icon={<Download size={16} />}
          >
            Unduh PDF (A4)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            isLoading={isPrintingPdf}
            onClick={handlePrint}
            icon={<Printer size={16} />}
          >
            Cetak (PDF)
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:border-red-200"
            isLoading={isDeleting}
            onClick={handleDeleteInvoice}
            icon={<Trash2 size={16} />}
          >
            Hapus
          </Button>
        </div>
      </div>

      {/* Screen Preview Container */}
      <div className="w-full max-w-[210mm] mx-auto bg-white p-6 sm:p-10 shadow-sm border border-slate-200 rounded-xl print:border-none print:shadow-none print:p-0">
        {/* Invoice Printable Document (Captured for PDF) - Murni kertas A4 tanpa bingkai card */}
        <div
          id="invoice-printable-doc"
          className="print-a4-sheet w-full bg-white text-slate-800"
          style={{ boxSizing: "border-box", border: "none", borderRadius: 0, boxShadow: "none" }}
        >
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              {settings.logoUrl ? (
                <div className="relative w-36 h-9">
                  <Image
                    src={settings.logoUrl}
                    alt={settings.companyName}
                    fill
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                  G
                </div>
              )}
              {!settings.logoUrl && (
                <span className="font-black text-xl tracking-tight text-slate-900">
                  {settings.companyName}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
              {settings.tagline}
              <br />
              {settings.address}
              <br />
              Email: {settings.email} | Telp: {settings.phone}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-600 uppercase tracking-wider mb-1">
              INVOICE
            </h2>
            <p className="text-sm font-bold font-mono text-slate-800">
              No: {invoice.invoiceNumber}
            </p>
            <div className="text-xs text-slate-500 mt-1.5 space-y-0.5">
              <p>
                Tanggal Terbit:{" "}
                <span className="font-semibold text-slate-700">
                  {invoice.issuedDate?.toDate?.().toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  }) || "-"}
                </span>
              </p>
              <p>
                Jatuh Tempo:{" "}
                <span className="font-semibold text-slate-700">
                  {invoice.dueDate?.toDate?.().toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  }) || "-"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bill To Info */}
        <div className="py-5 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Ditagihkan Kepada:
            </p>
            <h3 className="text-base font-bold text-slate-900">
              {invoice.client.name}
            </h3>
            {invoice.client.company && (
              <p className="text-xs text-slate-600 font-medium">
                {invoice.client.company}
              </p>
            )}
            <div className="text-xs text-slate-500 mt-1.5 space-y-0.5">
              {invoice.client.email && (
                <p className="flex items-center gap-1.5">
                  <Mail size={12} /> {invoice.client.email}
                </p>
              )}
              {invoice.client.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone size={12} /> {invoice.client.phone}
                </p>
              )}
              {invoice.client.address && (
                <p className="flex items-start gap-1.5">
                  <MapPin size={12} className="shrink-0 mt-0.5" />{" "}
                  {invoice.client.address}
                </p>
              )}
            </div>
          </div>

          <div className="sm:text-right flex flex-col justify-end">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Total Tagihan
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatCurrency(invoice.total)}
            </p>
            <p className="text-[11px] text-slate-500 italic mt-0.5 max-w-sm ml-auto">
              Terbilang: {amountToWords(invoice.total)}
            </p>
          </div>
        </div>

        {/* Table of Items */}
        <div className="py-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-2">Deskripsi Layanan / Produk</th>
                <th className="py-2.5 px-2 text-center w-16">Qty</th>
                <th className="py-2.5 px-2 text-center w-20">Satuan</th>
                <th className="py-2.5 px-2 text-right w-32">Harga Satuan</th>
                <th className="py-2.5 px-2 text-right w-36">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {invoice.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-2 font-medium text-slate-800">
                    {item.description}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-500 uppercase text-[11px]">
                    {item.unit || "pcs"}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-600 font-mono">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="max-w-xs space-y-2">
            {invoice.notes && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Catatan / Keterangan:
                </p>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-800 mb-0.5">Rekening Pembayaran:</p>
              <div className="whitespace-pre-line font-medium text-slate-700">
                {settings.bankAccounts}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-68 space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>PPN ({invoice.taxRate}%):</span>
                <span className="font-mono font-medium">
                  {formatCurrency(invoice.taxAmount)}
                </span>
              </div>
            )}
            {invoice.pphAmount && invoice.pphAmount > 0 ? (
              <div className="flex justify-between text-red-600 font-medium">
                <span>PPh 21/23 ({invoice.pphRate || 2}%):</span>
                <span className="font-mono">
                  -{formatCurrency(invoice.pphAmount)}
                </span>
              </div>
            ) : null}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Diskon:</span>
                <span className="font-mono">
                  -{formatCurrency(invoice.discount)}
                </span>
              </div>
            )}
            <div className="border-t-2 border-slate-800 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">TOTAL:</span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 font-mono">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Signature & QR Code Verification */}
        <div className="print-avoid-break pt-6 mt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-4 text-xs text-slate-500">
          <div className="space-y-4 max-w-sm">
            {/* DYNAMIC QR CODE FOR AUTHENTICITY VALIDATION */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-1 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
                <QRCodeSVG
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/verify/invoice/${invoice.id}`
                      : `https://guwigo.com/verify/invoice/${invoice.id}`
                  }
                  size={64}
                  level="M"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px] uppercase tracking-wide">
                  <ShieldCheck size={14} />
                  Dokumen Sah & Terverifikasi
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Pindai QR Code untuk memeriksa validitas dan riwayat rekonsiliasi data pada server resmi Guwigo.
                </p>
                <Link
                  href={`/verify/invoice/${invoice.id}`}
                  target="_blank"
                  className="text-[10px] text-blue-600 font-semibold underline hover:text-blue-700 inline-block pt-0.5"
                >
                  Buka Halaman Validasi &rarr;
                </Link>
              </div>
            </div>

            <div>
              <p className="font-medium text-slate-600">Terima kasih atas kerjasama dan kepercayaan Anda.</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {settings.invoiceFooterNote}
              </p>
            </div>
          </div>
          <div className="flex items-end gap-6 sm:gap-8 justify-end">
            {/* E-METERAI SLOT / SPACE */}
            <div className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 text-center bg-slate-50/40 relative overflow-hidden shrink-0">
              {invoice.emeteraiUrl ? (
                <Image
                  src={invoice.emeteraiUrl}
                  alt="E-Meterai Resmi"
                  fill
                  className="object-contain p-1"
                />
              ) : invoice.useEmeterai ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] mb-1">
                    M
                  </div>
                  <span className="text-[10px] font-black text-red-700 tracking-wider uppercase">
                    E-METERAI
                  </span>
                  <span className="text-[9px] font-bold text-red-600 font-mono">
                    Rp 10.000
                  </span>
                  <span className="text-[8px] text-red-400 mt-1 uppercase font-semibold">
                    PERURI
                  </span>
                </>
              ) : (
                <div className="text-center opacity-60">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Ruang
                  </span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    E-Meterai
                  </span>
                  <span className="block text-[8px] text-slate-400 mt-1 font-mono">
                    Rp 10.000
                  </span>
                </div>
              )}
            </div>

            {/* TANDA TANGAN & STEMPEL */}
            <div className="text-center w-56 relative">
              <p className="mb-16 font-medium text-slate-700">{settings.signerTitle}</p>
              
              {/* Tanda Tangan (Jika diisi) */}
              {settings.signatureUrl && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-5 w-32 h-18 pointer-events-none select-none z-10">
                  <Image
                    src={settings.signatureUrl}
                    alt="Tanda Tangan"
                    width={128}
                    height={72}
                    className="object-contain"
                  />
                </div>
              )}

              {/* Stempel Perusahaan (Lebih besar, agak miring, di kiri tanda tangan & menyentuh ttd) */}
              {settings.stampUrl && (
                <div className="absolute -left-10 -bottom-2 w-36 h-36 pointer-events-none select-none opacity-90 rotate-[-14deg] z-15">
                  <Image
                    src={settings.stampUrl}
                    alt="Stempel Resmi"
                    width={144}
                    height={144}
                    className="object-contain"
                  />
                </div>
              )}

              <p className="font-bold text-slate-900 border-t border-slate-400 pt-1 relative z-20">
                {settings.signerName}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
