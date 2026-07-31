"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Tag,
  Type,
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
        className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-right-8 duration-300 ${toast.type === "success" ? "bg-green-50 border border-green-200" : toast.type === "error" ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"}`}
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
              className={`font-bold text-sm tracking-wide ${toast.type === "success" ? "text-green-900" : toast.type === "error" ? "text-red-900" : "text-blue-900"}`}
            >
              {toast.title}
            </p>
          )}
          <p
            className={`text-sm mt-0.5 font-medium leading-relaxed ${toast.type === "success" ? "text-green-700" : toast.type === "error" ? "text-red-700" : "text-blue-700"}`}
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
interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: Timestamp;
}

const initialFormState = {
  title: "",
  imageUrl: "",
  category: "",
};

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const removeToast = useCallback(
    (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GalleryImage[];
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      showToast(
        "Gagal memuat galeri. Periksa koneksi internet Anda.",
        "error",
        "Koneksi Error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      showToast("Judul dan URL Gambar wajib diisi!", "error", "Validasi Gagal");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "gallery"), {
        ...formData,
        createdAt: Timestamp.now(),
      });
      showToast(
        "Gambar baru berhasil ditambahkan ke Galeri!",
        "success",
        "Berhasil",
      );
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchImages();
    } catch (error) {
      console.error("Error adding image:", error);
      showToast("Gagal menyimpan gambar.", "error", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(deleteConfirm.id);
    try {
      await deleteDoc(doc(db, "gallery", deleteConfirm.id));
      showToast(
        `Gambar "${deleteConfirm.title}" berhasil dihapus.`,
        "success",
        "Terhapus",
      );
      setDeleteConfirm(null);
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      showToast("Gagal menghapus gambar.", "error", "Error");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Galeri...
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
              <ImageIcon className="text-blue-600" /> Gallery Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Kelola aset visual, dokumentasi acara, dan foto kegiatan. Total{" "}
              {images.length} Gambar.
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} /> Tambah Gambar
          </button>
        </div>

        {/* IMAGE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={32} className="text-slate-300" />
              </div>
              <p className="font-bold text-slate-900 text-lg mb-1">
                Galeri Masih Kosong
              </p>
              <p className="text-slate-500 text-sm">
                Klik "Tambah Gambar" untuk mengunggah foto kegiatan.
              </p>
            </div>
          ) : (
            images.map((image) => (
              <div
                key={image.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col group relative"
              >
                {/* Image Box */}
                <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
                  {image.imageUrl ? (
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <ImageIcon size={40} className="text-slate-300" />
                  )}
                  {/* Delete Button Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() =>
                        setDeleteConfirm({ id: image.id, title: image.title })
                      }
                      className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all shadow-lg shadow-red-900/50"
                      title="Hapus Gambar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white z-10 relative">
                  <div>
                    <h3
                      className="font-bold text-sm text-slate-900 line-clamp-1 mb-1"
                      title={image.title}
                    >
                      {image.title}
                    </h3>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                      {image.category || "Uncategorized"}
                    </span>
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
                  Hapus Gambar?
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Gambar{" "}
                  <span className="font-bold text-slate-900">
                    "{deleteConfirm.title}"
                  </span>{" "}
                  akan dihapus dari galeri.
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
          MODAL FORM CREATE
      ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <ImageIcon size={16} />
                </div>
                Tambah Gambar
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 bg-slate-50">
              <form id="galleryForm" onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    Judul Gambar
                  </label>
                  <div className="relative group">
                    <Type
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={18}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Rapat Koordinasi"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    Kategori (Opsional)
                  </label>
                  <div className="relative group">
                    <Tag
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Event, Office, Acara"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    URL Gambar
                  </label>
                  <div className="relative group">
                    <ImageIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={18}
                    />
                    <input
                      required
                      type="text"
                      placeholder="https://contoh.com/gambar.jpg"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white border-t border-slate-100 p-5 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="galleryForm"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                {isSaving ? "Menyimpan..." : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
