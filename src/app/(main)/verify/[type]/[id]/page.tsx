"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  Loader2,
  Lock,
} from "lucide-react";
import { formatCurrency } from "@/types/invoice";

export default function DocumentVerificationPage() {
  const params = useParams();
  const type = (params?.type as string)?.toLowerCase();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);
  const [settings, setSettings] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || !type) return;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        const collectionName = type === "receipt" ? "receipts" : "invoices";
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setNotFound(true);
        }

        const settingsSnap = await getDoc(doc(db, "admin", "invoice-settings"));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data());
        }
      } catch (err) {
        console.error("Verification error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, type]);

  const isInvoice = type === "invoice";
  const docTitle = isInvoice ? "INVOICE RESMI" : "KUITANSI PEMBAYARAN";
  const docNumber = isInvoice ? data?.invoiceNumber : data?.receiptNumber;
  const clientName = isInvoice ? data?.client?.name : data?.receivedFrom;
  const amount = data?.total ?? data?.amount ?? 0;
  const isPaid = isInvoice ? data?.status === "paid" : true;

  const dateStr =
    data?.issuedDate?.toDate?.()?.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }) || "-";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="relative w-36 h-10 transition-transform group-hover:scale-105">
              <Image
                src="/images/branding/logo-guwigo-new.png"
                alt="PT Guwigo Teknologi Indonesia"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
            Sistem Verifikasi Integritas Dokumen Digital
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xl text-center space-y-4">
            <Loader2 size={40} className="animate-spin text-blue-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              Menghubungkan ke basis data Guwigo & memvalidasi keaslian dokumen...
            </p>
          </div>
        )}

        {!loading && notFound && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Dokumen Tidak Valid atau Tidak Ditemukan
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              ID dokumen <span className="font-mono font-semibold text-slate-700">{id}</span> tidak terdaftar dalam catatan resmi PT Guwigo Teknologi Indonesia. Harap pastikan dokumen atau QR Code yang Anda pindai asli.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}

        {!loading && !notFound && data && (
          <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-wide uppercase">
                    Dokumen Sah & Terverifikasi
                  </h2>
                  <p className="text-xs text-emerald-100 font-medium">
                    Tervalidasi langsung oleh sistem Guwigo
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                <Lock size={12} /> Terenkripsi
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {isInvoice ? (
                    <FileSpreadsheet className="text-blue-600" size={20} />
                  ) : (
                    <Receipt className="text-emerald-600" size={20} />
                  )}
                  <span className="font-black text-slate-800 tracking-tight text-sm">
                    {docTitle}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${
                    isPaid
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {isPaid ? "LUNAS / SELESAI" : "MENUNGGU PEMBAYARAN"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nomor Dokumen
                  </p>
                  <p className="font-mono text-base font-black text-slate-900">
                    {docNumber}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nilai Dokumen
                  </p>
                  <p className="font-mono text-xl font-black text-blue-600">
                    {formatCurrency(amount)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between py-2 border-b border-slate-100 gap-4">
                  <span className="text-slate-500 font-medium">Pihak Klien / Ditujukan:</span>
                  <span className="font-bold text-slate-900 text-right">
                    {clientName || "-"}
                  </span>
                </div>

                <div className="flex items-start justify-between py-2 border-b border-slate-100 gap-4">
                  <span className="text-slate-500 font-medium">Tanggal Terbit:</span>
                  <span className="font-semibold text-slate-700 text-right">
                    {dateStr}
                  </span>
                </div>

                {data?.purpose && (
                  <div className="flex items-start justify-between py-2 border-b border-slate-100 gap-4">
                    <span className="text-slate-500 font-medium">Perihal:</span>
                    <span className="font-medium text-slate-800 text-right max-w-xs">
                      {data.purpose}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between py-2 border-b border-slate-100 gap-4">
                  <span className="text-slate-500 font-medium">Bea Meterai (UU No.10/2020):</span>
                  <span className="font-bold text-slate-800 text-right flex items-center gap-1.5">
                    {data?.useEmeterai ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 text-xs">
                        ✓ Terbubuhi E-Meterai Rp 10.000 (Sah)
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">
                        Bebas Bea Meterai
                      </span>
                    )}
                  </span>
                </div>

                {isInvoice && data?.items && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Rincian Pekerjaan ({data.items.length} Item):
                    </p>
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {data.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-slate-700 font-medium">
                            • {item.description} ({item.quantity} {item.unit || "pcs"})
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Diterbitkan Secara Resmi Oleh:
                  </p>
                  <p className="font-bold text-slate-800 text-sm">
                    {settings?.companyName || "PT GUWIGO TEKNOLOGI INDONESIA"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {settings?.companyAddress || "Yogyakarta, Indonesia"}
                  </p>
                </div>
                {settings?.stampUrl && (
                  <div className="w-16 h-16 relative shrink-0 opacity-90 rotate-[-6deg]">
                    <Image
                      src={settings.stampUrl}
                      alt="Stempel Resmi Guwigo"
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed text-center">
                Dokumen ini merupakan salinan data otentik yang tersimpan pada basis data resmi <strong>PT GUWIGO TEKNOLOGI INDONESIA</strong>. Segala bentuk pemalsuan dokumen fisik tanpa rekonsiliasi sistem ini tidak memiliki kekuatan hukum.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
