"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Layers,
  LayoutGrid,
} from "lucide-react";

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
        className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-right-8 duration-300 ${
          toast.type === "success"
            ? "bg-green-50 border border-green-200"
            : toast.type === "error"
              ? "bg-red-50 border border-red-200"
              : "bg-blue-50 border border-blue-200"
        }`}
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
            <p className="font-bold text-sm text-slate-900">{toast.title}</p>
          )}
          <p className="text-sm mt-0.5 font-medium text-slate-700">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-slate-400 hover:text-slate-900 bg-white/50 hover:bg-white p-1 rounded-full shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  category: "utility" | "obs" | "saas";
  link: string;
  badge?: string;
  actionText?: string;
  isExternal?: boolean;
  order?: number;
}

const defaultToolsList: Omit<ToolItem, "id">[] = [
  {
    title: "QR Code Generator",
    description: "Ubah Teks, URL, atau Nomor WhatsApp menjadi QR Code resolusi tinggi secara real-time. Bebas masa kedaluwarsa.",
    category: "utility",
    link: "/tools/qrcode",
    actionText: "Buka Console",
    order: 1,
  },
  {
    title: "Password Generator",
    description: "Rakit kata sandi & token acak tingkat militer yang sangat kuat. Kriptografi aman offline di browser.",
    category: "utility",
    link: "/tools/password",
    actionText: "Buka Console",
    order: 2,
  },
  {
    title: "WA Link Builder",
    description: "Rakit tautan WhatsApp dinamis dengan pesan otomatis & live chat preview memanjakan mata.",
    category: "utility",
    link: "/tools/wa-generator",
    actionText: "Buka Console",
    order: 3,
  },
  {
    title: "SEO & Social Preview",
    description: "Simulasikan metadata website Anda di Google, FB, Twitter, dan WA secara real-time.",
    category: "utility",
    link: "/tools/seo-preview",
    actionText: "Buka Console",
    order: 4,
  },
  {
    title: "EduPrompt AI Generator",
    description: "Hasilkan instruksi desain (prompt) pendidikan super spesifik untuk ChatGPT & Midjourney.",
    category: "utility",
    link: "/tools/eduprompt",
    badge: "Most Popular",
    actionText: "Gunakan Tools",
    order: 5,
  },
  {
    title: "AI Proposal Architect",
    description: "Sistem cerdas merumuskan draf proposal arsitektur IT level Enterprise dalam hitungan detik. Export PDF/DOCX.",
    category: "saas",
    link: "/tools/ai-proposal",
    badge: "Pro SaaS",
    actionText: "Mulai Trial",
    order: 6,
  },
  {
    title: "Running Text Marquee",
    description: "Buat teks berjalan kustom untuk OBS Studio. Atur teks, warna, dan kecepatan lari.",
    category: "obs",
    link: "/tools/marquee",
    actionText: "Rakit Widget",
    order: 7,
  },
  {
    title: "Countdown Buka Puasa",
    description: "Overlay transparan penunjuk waktu maghrib otomatis untuk area Yogyakarta.",
    category: "obs",
    link: "/obs/buka.html",
    actionText: "Copy Source URL",
    order: 8,
  },
  {
    title: "Countdown Imsak",
    description: "Sangat cocok untuk live stream sahur. Hitung mundur imsak berjalan otomatis.",
    category: "obs",
    link: "/obs/imsak.html",
    actionText: "Copy Source URL",
    order: 9,
  },
  {
    title: "Schedule 5 Waktu Sholat",
    description: "Tampilkan tabel jadwal sholat hari ini sinkron otomatis via API Aladhan.",
    category: "obs",
    link: "/obs/jadwal-sholat.html",
    actionText: "Copy Source URL",
    order: 10,
  },
];

export default function AdminToolsPage() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<ToolItem, "id">>({
    title: "",
    description: "",
    category: "utility",
    link: "",
    badge: "",
    actionText: "Buka Console",
    isExternal: false,
    order: 1,
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType = "info", title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      const snap = await getDocs(collection(db, "tools_items"));
      let data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ToolItem));

      // Jika database tools masih kosong, seed dengan tool default yang sudah ada
      if (data.length === 0) {
        for (const item of defaultToolsList) {
          const docRef = await addDoc(collection(db, "tools_items"), item);
          data.push({ id: docRef.id, ...item });
        }
      }

      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setTools(data);
    } catch (err) {
      console.error(err);
      showToast("Gagal memuat tools", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleOpenModal = (item: ToolItem | null = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category,
        link: item.link,
        badge: item.badge || "",
        actionText: item.actionText || "Buka Console",
        isExternal: !!item.isExternal,
        order: item.order || 1,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        category: "utility",
        link: "/tools/",
        badge: "",
        actionText: "Buka Console",
        isExternal: false,
        order: tools.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.link) {
      showToast("Nama tool dan Link URL wajib diisi", "error");
      return;
    }

    try {
      setIsSaving(true);
      if (editingId) {
        await updateDoc(doc(db, "tools_items", editingId), formData);
        showToast("Tool berhasil diperbarui!", "success");
      } else {
        await addDoc(collection(db, "tools_items"), formData);
        showToast("Tool baru berhasil ditambahkan!", "success");
      }
      setIsModalOpen(false);
      fetchTools();
    } catch (err) {
      console.error(err);
      showToast("Gagal menyimpan data tool", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus tool "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, "tools_items", id));
      showToast("Tool dihapus", "success");
      fetchTools();
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus", "error");
    }
  };

  return (
    <div className="font-sans max-w-7xl mx-auto pb-20">
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Wrench size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Manajemen Tools & Utilities</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Kelola kartu tools yang tampil di halaman publik <strong className="text-slate-700">/tools</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/tools"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            Preview Halaman <ExternalLink size={14} />
          </a>
          <button
            onClick={() => handleOpenModal(null)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus size={16} /> Tambah Tool
          </button>
        </div>
      </div>

      {/* TOOLS GRID */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Daftar Tools...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.category === "obs"
                        ? "bg-purple-100 text-purple-700"
                        : item.category === "saas"
                          ? "bg-cyan-100 text-cyan-800"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.category.toUpperCase()}
                  </span>
                  {item.badge && (
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {item.description}
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2 rounded-lg truncate mb-4">
                  {item.link}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400">Urutan: #{item.order || 0}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    title="Edit Tool"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    title="Hapus Tool"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL EDIT / TAMBAH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingId ? "Edit Tool" : "Tambah Tool Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Nama Tool / Utility
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: QR Code Generator"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="utility">Web & Marketing Utilities</option>
                  <option value="obs">OBS Stream Asset / Widget</option>
                  <option value="saas">Enterprise SaaS Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Link / Rute Console
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: /tools/qrcode atau /obs/buka.html"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan fungsi tool ini secara memikat..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Badge Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Popular / New"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Simpan Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
