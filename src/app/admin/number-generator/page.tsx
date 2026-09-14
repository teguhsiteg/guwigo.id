"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import {
  Binary,
  Copy,
  Check,
  Plus,
  Trash2,
  FileText,
  Receipt,
  FileSpreadsheet,
  Building2,
  Calendar,
  Search,
  ExternalLink,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button, Badge, Modal } from "@/components/ui";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export type DocCategory =
  | "INV" // Invoice
  | "KWT" // Kuitansi
  | "SPK" // Surat Perintah Kerja / Kontrak
  | "SPH" // Surat Penawaran Harga / Proposal
  | "SK"  // Surat Keputusan
  | "BAST"// Berita Acara Serah Terima
  | "ND"  // Nota Dinas / Internal Memo
  | "UMUM";// Surat Keluar Umum

export interface DocumentRecord {
  id?: string;
  generatedNumber: string;
  category: DocCategory;
  title: string;
  recipient: string;
  notes?: string;
  year: number;
  monthRoman: string;
  sequenceNumber: number;
  createdAt: Timestamp;
}

const CATEGORY_MAP: Record<
  DocCategory,
  { label: string; code: string; color: string; prefix: string }
> = {
  INV: {
    label: "Invoice / Tagihan",
    code: "INV",
    color: "blue",
    prefix: "INV/GWG",
  },
  KWT: {
    label: "Kuitansi Pembayaran",
    code: "KWT",
    color: "emerald",
    prefix: "KWT/GWG",
  },
  SPK: {
    label: "Surat Kontrak / SPK",
    code: "SPK",
    color: "violet",
    prefix: "SPK/GWG",
  },
  SPH: {
    label: "Penawaran Harga (Proposal)",
    code: "SPH",
    color: "cyan",
    prefix: "SPH/GWG",
  },
  BAST: {
    label: "Berita Acara (BAST)",
    code: "BAST",
    color: "amber",
    prefix: "BAST/GWG",
  },
  SK: {
    label: "Surat Keputusan (SK)",
    code: "SK",
    color: "purple",
    prefix: "SK/GWG",
  },
  ND: {
    label: "Nota Dinas / Memo",
    code: "ND",
    color: "slate",
    prefix: "ND/GWG",
  },
  UMUM: {
    label: "Surat Keluar Resmi",
    code: "EXT",
    color: "indigo",
    prefix: "GWG/EXT",
  },
};

const ROMAN_MONTHS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export default function NumberGeneratorPage() {
  const [records, setRecords] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>("INV");

  // Form State
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [customSequence, setCustomSequence] = useState<number | "">("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Copied item ID
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "document_numbers"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const list: DocumentRecord[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as DocumentRecord);
      });
      setRecords(list);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil riwayat penomoran surat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthRoman = ROMAN_MONTHS[now.getMonth()];

  const router = useRouter();

  // Filter urutan per kategori di tahun berjalan
  const currentCategoryCount = records.filter(
    (r) => r.category === selectedCategory && r.year === currentYear
  ).length;

  const nextSeq =
    typeof customSequence === "number" && customSequence > 0
      ? customSequence
      : currentCategoryCount + 1;

  const paddedSeq = String(nextSeq).padStart(3, "0");
  const prefix = CATEGORY_MAP[selectedCategory].prefix;

  // Format: {PREFIX}/{SEQ}/{ROMAN_MONTH}/{YEAR}
  // Contoh: INV/GWG/001/IX/2026 atau SPK/GWG/001/IX/2026
  const previewNumber = `${prefix}/${paddedSeq}/${currentMonthRoman}/${currentYear}`;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Perihal / Nama dokumen wajib diisi");
      return;
    }

    try {
      setIsGenerating(true);
      const payload: Omit<DocumentRecord, "id"> = {
        generatedNumber: previewNumber,
        category: selectedCategory,
        title: title.trim(),
        recipient: recipient.trim() || "-",
        notes: customNotes.trim(),
        year: currentYear,
        monthRoman: currentMonthRoman,
        sequenceNumber: nextSeq,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "document_numbers"), payload);
      toast.success(`Nomor dokumen berhasil diterbitkan: ${previewNumber}`);

      // Copy automatically
      navigator.clipboard.writeText(previewNumber);

      const generatedNum = previewNumber;
      const recTitle = title.trim();
      const recRecipient = recipient.trim();

      // Reset form
      setTitle("");
      setRecipient("");
      setCustomNotes("");
      setCustomSequence("");

      fetchRecords();

      // Sinkronisasi otomatis: Jika Invoice atau Kuitansi, tawarkan atau langsung buka form pembuatan
      if (selectedCategory === "INV") {
        toast.info("Membuka formulir pembuatan Invoice dengan nomor tersinkron...", { duration: 3000 });
        router.push(
          `/admin/invoices/create?invoiceNumber=${encodeURIComponent(
            generatedNum
          )}&clientName=${encodeURIComponent(recRecipient)}&title=${encodeURIComponent(recTitle)}`
        );
      } else if (selectedCategory === "KWT") {
        toast.info("Membuka formulir pembuatan Kuitansi dengan nomor tersinkron...", { duration: 3000 });
        router.push(
          `/admin/receipts/create?receiptNumber=${encodeURIComponent(
            generatedNum
          )}&receivedFrom=${encodeURIComponent(recRecipient)}&title=${encodeURIComponent(recTitle)}`
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menerbitkan nomor dokumen");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Nomor surat disalin ke clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus catatan nomor dokumen ini dari buku register?")) return;
    try {
      await deleteDoc(doc(db, "document_numbers", id));
      toast.success("Catatan nomor berhasil dihapus");
      fetchRecords();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus catatan nomor");
    }
  };

  const filteredRecords = records.filter((r) => {
    const term = searchQuery.toLowerCase();
    return (
      r.generatedNumber.toLowerCase().includes(term) ||
      r.title.toLowerCase().includes(term) ||
      r.recipient.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Binary className="text-blue-600" />
            Generator Nomor Surat & Dokumen
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Buku register penomoran resmi PT Guwigo Teknologi Indonesia untuk Invoice, Kuitansi, SPK/Kontrak, SPH, dan Surat Keluar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/invoices">
            <Button variant="outline" size="sm" icon={<FileSpreadsheet size={16} />}>
              Invoice List
            </Button>
          </Link>
          <Link href="/admin/receipts">
            <Button variant="outline" size="sm" icon={<Receipt size={16} />}>
              Kuitansi List
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM GENERATOR (KIRI) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Pilih Jenis Dokumen
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(CATEGORY_MAP) as DocCategory[]).map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCustomSequence("");
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider ${
                            isSelected ? "text-blue-600" : "text-slate-400"
                          }`}
                        >
                          {cat}
                        </span>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                          {CATEGORY_MAP[cat].label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PREVIEW NOMOR DIHASILKAN */}
              <div className="p-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl shadow-md space-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                  <span>Hasil Format Nomor Terbit:</span>
                  <span className="bg-blue-600/50 px-2 py-0.5 rounded-md text-[10px] font-mono">
                    Urutan #{paddedSeq}
                  </span>
                </div>
                <div className="text-lg font-black font-mono tracking-tight text-white select-all">
                  {previewNumber}
                </div>
              </div>

              <Input
                label="2. Perihal / Judul Pekerjaan *"
                placeholder="Contoh: Pembuatan Aplikasi Mobile Sistem Informasi Kampus"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Input
                label="3. Ditujukan Kepada (Klien / Mitra)"
                placeholder="Contoh: PT Sumber Makmur Abadi / Bapak Hendra"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Urutan Manual (Opsional)"
                  type="number"
                  min={1}
                  placeholder={`Auto: ${currentCategoryCount + 1}`}
                  value={customSequence}
                  onChange={(e) =>
                    setCustomSequence(e.target.value ? Number(e.target.value) : "")
                  }
                  hint="Isi jika ingin custom nomor"
                />

                <Input
                  label="Catatan Singkat"
                  placeholder="Termin 1 / Proyek 2026"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isGenerating}
                icon={<CheckCircle2 size={16} />}
              >
                Terbitkan & Salin Nomor
              </Button>
            </form>
          </Card>
        </div>

        {/* BUKU REGISTER RIWAYAT NOMOR (KANAN) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Cari nomor terbit, judul, atau klien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Total: {records.length} Nomor Terbit
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <Loader2 size={32} className="animate-spin text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Membuka Buku Register Dokumen...
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Binary size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700">Belum ada nomor yang diterbitkan</p>
              <p className="text-xs text-slate-400">
                Gunakan form di sebelah kiri untuk menerbitkan nomor dokumen pertama Anda.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((rec) => {
                const catMeta = CATEGORY_MAP[rec.category] || CATEGORY_MAP.INV;
                return (
                  <div
                    key={rec.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black rounded-md uppercase">
                          {rec.category}
                        </span>
                        <span className="font-mono text-sm font-black text-slate-900 tracking-tight">
                          {rec.generatedNumber}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">
                        {rec.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Ditujukan: <strong className="text-slate-600">{rec.recipient}</strong></span>
                        <span>•</span>
                        <span>
                          {rec.createdAt?.toDate?.()?.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }) || "-"}
                        </span>
                        {rec.notes && (
                          <>
                            <span>•</span>
                            <span className="italic">{rec.notes}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {rec.category === "INV" && (
                        <Link
                          href={`/admin/invoices/create?invoiceNumber=${encodeURIComponent(
                            rec.generatedNumber
                          )}&clientName=${encodeURIComponent(
                            rec.recipient === "-" ? "" : rec.recipient
                          )}&title=${encodeURIComponent(rec.title)}`}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
                          title="Buka Form Invoice dengan nomor ini"
                        >
                          <FileSpreadsheet size={13} />
                          Buat Invoice
                        </Link>
                      )}

                      {rec.category === "KWT" && (
                        <Link
                          href={`/admin/receipts/create?receiptNumber=${encodeURIComponent(
                            rec.generatedNumber
                          )}&receivedFrom=${encodeURIComponent(
                            rec.recipient === "-" ? "" : rec.recipient
                          )}&title=${encodeURIComponent(rec.title)}`}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                          title="Buka Form Kuitansi dengan nomor ini"
                        >
                          <Receipt size={13} />
                          Buat Kuitansi
                        </Link>
                      )}

                      <button
                        onClick={() => handleCopy(rec.id as string, rec.generatedNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          copiedId === rec.id
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                        title="Salin Nomor"
                      >
                        {copiedId === rec.id ? <Check size={14} /> : <Copy size={14} />}
                        {copiedId === rec.id ? "Disalin" : "Salin"}
                      </button>

                      <button
                        onClick={() => handleDelete(rec.id as string)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Hapus Catatan"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
