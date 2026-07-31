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
  Timestamp,
} from "firebase/firestore";
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Star,
  Type,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
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
            <p
              className={`font-bold text-sm tracking-wide ${
                toast.type === "success"
                  ? "text-green-900"
                  : toast.type === "error"
                    ? "text-red-900"
                    : "text-blue-900"
              }`}
            >
              {toast.title}
            </p>
          )}
          <p
            className={`text-sm mt-0.5 font-medium leading-relaxed ${
              toast.type === "success"
                ? "text-green-700"
                : toast.type === "error"
                  ? "text-red-700"
                  : "text-blue-700"
            }`}
          >
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-slate-400 hover:text-slate-900 bg-white/50 hover:bg-white p-1 rounded-full shrink-0 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

// ==========================================
// INTERFACES
// ==========================================
interface Portfolio {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
  featured: boolean;
  createdAt: Timestamp;
}

const initialFormState = {
  title: "",
  description: "",
  image: "",
  category: "",
  link: "",
  featured: false,
};

export default function PortfolioAdminPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [isModal, setIsModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => removeToast(id), 5000);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "portfolio"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Portfolio[];

      // Sort berdasarkan yang terbaru (opsional, jika createdAt ada)
      data.sort((a, b) => {
        if (a.createdAt && b.createdAt)
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        return 0;
      });

      setPortfolios(data);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      showToast(
        "Gagal memuat data portfolio. Periksa koneksi Anda.",
        "error",
        "Gagal",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman

    // Validasi Sederhana
    if (!formData.title.trim() || !formData.category.trim()) {
      showToast("Judul dan Kategori wajib diisi!", "error", "Validasi Gagal");
      return;
    }

    try {
      setIsSaving(true);
      if (editingId) {
        await updateDoc(doc(db, "portfolio", editingId), formData);
        showToast("Portfolio berhasil diperbarui!", "success", "Berhasil");
      } else {
        await addDoc(collection(db, "portfolio"), {
          ...formData,
          createdAt: Timestamp.now(),
        });
        showToast("Proyek baru berhasil ditambahkan!", "success", "Berhasil");
      }
      fetchPortfolios();
      setIsModal(false);
      setFormData(initialFormState);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving:", error);
      showToast("Terjadi kesalahan saat menyimpan data.", "error", "Gagal");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(deleteConfirm.id);
    try {
      await deleteDoc(doc(db, "portfolio", deleteConfirm.id));
      showToast(
        `Proyek "${deleteConfirm.title}" berhasil dihapus.`,
        "success",
        "Terhapus",
      );
      setDeleteConfirm(null);
      fetchPortfolios();
    } catch (error) {
      console.error("Error deleting:", error);
      showToast("Gagal menghapus proyek.", "error", "Error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingId(portfolio.id);
    setFormData({
      title: portfolio.title || "",
      description: portfolio.description || "",
      image: portfolio.image || "",
      category: portfolio.category || "",
      link: portfolio.link || "",
      featured: portfolio.featured || false,
    });
    setIsModal(true);
  };

  const handleOpenNewModal = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Portfolio...
        </p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="p-6 md:p-10 font-sans max-w-6xl mx-auto pb-24">
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
              <FolderOpen className="text-blue-600" /> Portfolio Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Kelola proyek unggulan, kategori, dan tautan showcase Anda di
              sini. Total {portfolios.length} Proyek.
            </p>
          </div>
          <button
            onClick={handleOpenNewModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} /> Tambah Proyek
          </button>
        </div>

        {/* PORTFOLIO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen size={32} className="text-slate-300" />
              </div>
              <p className="font-bold text-slate-900 text-lg mb-1">
                Belum ada Proyek
              </p>
              <p className="text-slate-500 text-sm">
                Klik tombol "Tambah Proyek" untuk memamerkan karya Anda.
              </p>
            </div>
          ) : (
            portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group flex flex-col"
              >
                {/* Image Box */}
                <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
                  {portfolio.image ? (
                    <img
                      src={portfolio.image}
                      alt={portfolio.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <ImageIcon size={48} className="mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        No Image
                      </span>
                    </div>
                  )}
                  {portfolio.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <Star size={12} fill="currentColor" /> Featured
                    </div>
                  )}
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-3">
                      {portfolio.category || "Uncategorized"}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      {portfolio.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">
                      {portfolio.description || "Tidak ada deskripsi."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(portfolio)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl text-sm font-bold transition-colors"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          id: portfolio.id,
                          title: portfolio.title,
                        })
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl text-sm font-bold transition-colors"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900 mb-1">
                  Hapus Proyek?
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Portfolio{" "}
                  <span className="font-bold text-slate-900">
                    "{deleteConfirm.title}"
                  </span>{" "}
                  akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting !== null}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                {isDeleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL FORM CREATE / EDIT (FULL SCREEN)
      ========================================== */}
      {isModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
                </div>
                {editingId ? "Edit Portfolio" : "Tambah Portfolio Baru"}
              </h2>
              <button
                onClick={() => setIsModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable Form) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
              <form
                id="portfolioForm"
                onSubmit={handleSave}
                className="space-y-6"
              >
                {/* Judul & Kategori */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      Nama Proyek
                    </label>
                    <div className="relative group">
                      <Type
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={18}
                      />
                      <input
                        required
                        type="text"
                        placeholder="Contoh: Redesign Website Universitas"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      Kategori
                    </label>
                    <div className="relative group">
                      <Tag
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={18}
                      />
                      <input
                        required
                        type="text"
                        placeholder="Contoh: Web Development"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      URL Tautan Proyek (Opsional)
                    </label>
                    <div className="relative group">
                      <LinkIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="https://contoh.com"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    Deskripsi Singkat Proyek
                  </label>
                  <textarea
                    placeholder="Ceritakan sedikit tentang tantangan dan solusi dari proyek ini..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Media & Status */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      URL Gambar Banner
                    </label>
                    <div className="relative group">
                      <ImageIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="/images/portfolio/contoh.jpg"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-yellow-50/50 border border-yellow-200 p-4 rounded-xl">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                      <Star className="text-yellow-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-yellow-900">
                        Jadikan Featured
                      </h4>
                      <p className="text-[10px] text-yellow-700 uppercase tracking-widest font-bold">
                        Tampil di halaman depan
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-slate-100 p-5 px-8 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModal(false)}
                className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="portfolioForm"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Menyimpan..." : "Simpan Proyek"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
