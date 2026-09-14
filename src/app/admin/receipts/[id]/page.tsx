"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Printer,
  Receipt,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  CreditCard,
  Loader2,
  ShieldCheck,
  Download,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { Receipt as ReceiptType, formatCurrency } from "@/types/invoice";
import { toast } from "sonner";
import { InvoiceSettings, defaultInvoiceSettings } from "../../invoices/settings/page";

export default function ReceiptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const [settings, setSettings] = useState<InvoiceSettings>(defaultInvoiceSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isPrintingPdf, setIsPrintingPdf] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchReceipt = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "receipts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReceipt({ id: docSnap.id, ...docSnap.data() } as ReceiptType);
        } else {
          toast.error("Kuitansi tidak ditemukan");
          router.push("/admin/receipts");
        }

        // Fetch custom invoice settings
        const settingsSnap = await getDoc(doc(db, "admin", "invoice-settings"));
        if (settingsSnap.exists()) {
          setSettings({ ...defaultInvoiceSettings, ...settingsSnap.data() });
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data kuitansi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipt();
  }, [id, router]);

  const handlePrint = async () => {
    const element = document.getElementById("receipt-printable-doc");
    if (!element || !receipt) return;
    try {
      setIsPrintingPdf(true);
      toast.info("Menyiapkan dokumen cetak PDF (A4)...");

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Memuat Dokumen Cetak - ${receipt.receiptNumber}</title>
              <style>
                body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #334155; }
                .spinner { width: 44px; height: 44px; border: 4px solid #cbd5e1; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
                @keyframes spin { to { transform: rotate(360deg); } }
              </style>
            </head>
            <body>
              <div style="text-align: center;">
                <div class="spinner"></div>
                <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 700;">Menyiapkan Dokumen Kuitansi A4...</h3>
                <p style="margin: 0; font-size: 13px; color: #64748b;">Membuka format cetak PDF blob...</p>
              </div>
            </body>
          </html>
        `);
      }

      const html2pdf = (await import("html2pdf.js")).default;
      const cleanNumber = receipt.receiptNumber.replace(/[\/\\]/g, "_");
      const clientClean = (receipt.receivedFrom || "Receipt").replace(/[^a-zA-Z0-9_-]/g, "_");
      const opt: any = {
        margin: [12, 12, 12, 12],
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
    const element = document.getElementById("receipt-printable-doc");
    if (!element || !receipt) return;
    try {
      setIsExportingPdf(true);
      const html2pdf = (await import("html2pdf.js")).default;
      const cleanNumber = receipt.receiptNumber.replace(/[\/\\]/g, "_");
      const clientClean = (receipt.receivedFrom || "Receipt").replace(/[^a-zA-Z0-9_-]/g, "_");
      const opt: any = {
        margin: [12, 12, 12, 12],
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
      toast.success("PDF Kuitansi berhasil diunduh");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Gagal membuat file PDF");
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Memuat Kuitansi...
        </p>
      </div>
    );
  }

  if (!receipt) return null;

  return (
    <div className="pb-20 max-w-3xl mx-auto">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/receipts">
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 font-mono">
                {receipt.receiptNumber}
              </h1>
              <Badge variant="success" dot>
                Resmi Diterbitkan
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Diterbitkan pada{" "}
              {receipt.issuedDate?.toDate?.().toLocaleDateString("id-ID", {
                dateStyle: "medium",
              }) || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Screen Preview Container */}
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 shadow-sm border border-slate-200 rounded-xl print:border-none print:shadow-none print:p-0">
        {/* Formal Indonesian Kuitansi Sheet (PDF Capture Target) - Murni kertas A4 tanpa bingkai card */}
        <div
          id="receipt-printable-doc"
          className="print-a4-sheet bg-white text-slate-900 w-full relative overflow-hidden"
          style={{ boxSizing: "border-box", border: "none", borderRadius: 0, boxShadow: "none" }}
        >
        {/* Subtle Watermark Stamp */}
        <div className="absolute right-12 bottom-24 opacity-[0.03] select-none pointer-events-none">
          <div className="text-9xl font-black border-8 border-slate-900 rounded-3xl p-6 rotate-[-15deg]">
            LUNAS
          </div>
        </div>

        {/* Kuitansi Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-slate-900 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {settings.logoUrl ? (
                <div className="relative w-32 h-8">
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
            <p className="text-xs text-slate-500">
              {settings.address} | {settings.email}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <h2 className="text-2xl font-black text-slate-900 tracking-widest uppercase">
              KUITANSI
            </h2>
            <p className="text-xs font-mono font-bold text-slate-600">
              No: {receipt.receiptNumber}
            </p>
          </div>
        </div>

        {/* Content Rows */}
        <div className="py-8 space-y-6 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
            <span className="sm:col-span-3 text-slate-500 font-medium">
              Telah Diterima Dari
            </span>
            <span className="sm:col-span-1 hidden sm:inline text-center">:</span>
            <span className="sm:col-span-8 font-bold text-slate-900 text-base border-b border-dotted border-slate-300 pb-1">
              {receipt.receivedFrom}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
            <span className="sm:col-span-3 text-slate-500 font-medium">
              Uang Sejumlah
            </span>
            <span className="sm:col-span-1 hidden sm:inline text-center">:</span>
            <span className="sm:col-span-8 font-bold text-emerald-800 bg-emerald-50/70 px-3 py-2 rounded-xl italic border border-emerald-100">
              &ldquo;{receipt.amountInWords}&rdquo;
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
            <span className="sm:col-span-3 text-slate-500 font-medium">
              Untuk Pembayaran
            </span>
            <span className="sm:col-span-1 hidden sm:inline text-center">:</span>
            <span className="sm:col-span-8 font-medium text-slate-800 leading-relaxed border-b border-dotted border-slate-300 pb-1">
              {receipt.purpose}
              {receipt.invoiceNumber && (
                <span className="ml-2 text-xs font-bold text-blue-600">
                  (Ref: {receipt.invoiceNumber})
                </span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
            <span className="sm:col-span-3 text-slate-500 font-medium">
              Metode Bayar
            </span>
            <span className="sm:col-span-1 hidden sm:inline text-center">:</span>
            <span className="sm:col-span-8 font-semibold text-slate-700">
              {receipt.paymentMethod}
            </span>
          </div>

          {receipt.notes && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
              <span className="sm:col-span-3 text-slate-500 font-medium">
                Catatan
              </span>
              <span className="sm:col-span-1 hidden sm:inline text-center">:</span>
              <span className="sm:col-span-8 text-xs text-slate-500 italic">
                {receipt.notes}
              </span>
            </div>
          )}
        </div>

        {/* Amount Box, Verification QR Code, and Signature */}
        <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-100 rounded-2xl border-2 border-slate-300 inline-block min-w-[220px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Jumlah Terbayar
              </p>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {formatCurrency(receipt.amount)}
              </p>
            </div>

            {/* DYNAMIC QR CODE FOR AUTHENTICITY VALIDATION */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm">
              <div className="p-1 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
                <QRCodeSVG
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/verify/receipt/${receipt.id}`
                      : `https://guwigo.com/verify/receipt/${receipt.id}`
                  }
                  size={58}
                  level="M"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] uppercase tracking-wide">
                  <ShieldCheck size={14} />
                  Kuitansi Sah & Terverifikasi
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Pindai QR Code untuk memeriksa validasi tanda terima sah pada server Guwigo.
                </p>
                <Link
                  href={`/verify/receipt/${receipt.id}`}
                  target="_blank"
                  className="text-[10px] text-emerald-700 font-semibold underline hover:text-emerald-800 inline-block pt-0.5"
                >
                  Buka Halaman Validasi &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-6">
            {/* E-METERAI SLOT (Jika Diaktifkan) */}
            {receipt.useEmeterai && (
              <div className="w-28 h-28 border-2 border-dashed border-red-300 rounded-xl flex flex-col items-center justify-center p-2 text-center bg-red-50/40 relative overflow-hidden shrink-0">
                {receipt.emeteraiUrl ? (
                  <Image
                    src={receipt.emeteraiUrl}
                    alt="E-Meterai Resmi"
                    fill
                    className="object-contain p-1"
                  />
                ) : (
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
                )}
              </div>
            )}

            <div className="text-center w-52 relative">
              <p className="text-xs text-slate-500 mb-1">
                Yogyakarta,{" "}
                {receipt.issuedDate?.toDate?.().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) || "-"}
              </p>
              <p className="text-xs font-medium text-slate-700 mb-16">
                {settings.signerTitle}
              </p>
              
              {/* Tanda Tangan (Jika ada) */}
              {settings.signatureUrl && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-5 w-28 h-16 pointer-events-none select-none z-10">
                  <Image
                    src={settings.signatureUrl}
                    alt="Tanda Tangan"
                    width={112}
                    height={64}
                    className="object-contain"
                  />
                </div>
              )}

              {/* Stempel Resmi */}
              {settings.stampUrl && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-28 h-28 pointer-events-none select-none opacity-90 rotate-[-8deg] z-15">
                  <Image
                    src={settings.stampUrl}
                    alt="Stempel Resmi"
                    width={112}
                    height={112}
                    className="object-contain"
                  />
                </div>
              )}

              <p className="text-xs font-bold text-slate-900 border-t border-slate-900 pt-1 uppercase relative z-20">
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
