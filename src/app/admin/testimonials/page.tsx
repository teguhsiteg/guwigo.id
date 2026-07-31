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
  MessageCircle,
  Plus,
  Trash2,
  Star,
  Loader2,
  Edit2,
  X,
  Save,
  User,
  Briefcase,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  XCircle,
  Quote,
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
interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientImage: string;
  message: string;
  rating: number;
  featured: boolean;
  createdAt?: Timestamp;
}

const initialFormState = {
  clientName: "",
  clientTitle: "",
  clientImage: "",
  message: "",
  rating: 5,
  featured: false,
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
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
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "testimonials"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Testimonial[];

      // Sort newest first
      data.sort((a, b) => {
        if (a.createdAt && b.createdAt)
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        return 0;
      });

      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      showToast("Gagal memuat data testimoni.", "error", "Koneksi Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (testimonial: Testimonial | null = null) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        clientName: testimonial.clientName,
        clientTitle: testimonial.clientTitle,
        clientImage: testimonial.clientImage || "",
        message: testimonial.message,
        rating: testimonial.rating,
        featured: testimonial.featured || false,
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.message.trim()) {
      showToast(
        "Nama Klien dan Pesan Testimoni wajib diisi!",
        "error",
        "Validasi Gagal",
      );
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "testimonials", editingId), { ...formData });
        showToast("Testimoni berhasil diperbarui!", "success", "Tersimpan");
      } else {
        await addDoc(collection(db, "testimonials"), {
          ...formData,
          createdAt: Timestamp.now(),
        });
        showToast(
          "Testimoni baru berhasil ditambahkan!",
          "success",
          "Tersimpan",
        );
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      showToast("Terjadi kesalahan saat menyimpan.", "error", "Gagal");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(deleteConfirm.id);
    try {
      await deleteDoc(doc(db, "testimonials", deleteConfirm.id));
      showToast(
        `Testimoni dari "${deleteConfirm.name}" berhasil dihapus.`,
        "success",
        "Terhapus",
      );
      setDeleteConfirm(null);
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting:", error);
      showToast("Gagal menghapus testimoni.", "error", "Error");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Testimoni...
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
              <MessageCircle className="text-blue-600" /> Testimonial Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Kelola ulasan, komentar, dan tingkat kepuasan dari klien Anda.
              Total {testimonials.length} Ulasan.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} /> Tambah Testimoni
          </button>
        </div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-slate-300" />
              </div>
              <p className="font-bold text-slate-900 text-lg mb-1">
                Belum ada Testimoni
              </p>
              <p className="text-slate-500 text-sm">
                Tambahkan ulasan klien untuk membangun kepercayaan.
              </p>
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col hover:shadow-xl hover:border-blue-200 transition-all duration-300 group relative"
              >
                {/* Badge Featured */}
                {testimonial.featured && (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-950 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg z-10">
                    <Star size={12} fill="currentColor" /> Featured
                  </div>
                )}

                {/* Header: User Info */}
                <div className="flex items-center gap-4 mb-4">
                  {testimonial.clientImage ? (
                    <img
                      src={testimonial.clientImage}
                      alt={testimonial.clientName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border-2 border-blue-100">
                      {testimonial.clientName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {testimonial.clientName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {testimonial.clientTitle}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>

                {/* Message */}
                <div className="relative flex-1 mb-6">
                  <Quote
                    className="absolute -top-1 -left-2 text-slate-100 rotate-180"
                    size={32}
                  />
                  <p className="text-sm text-slate-600 italic leading-relaxed relative z-10 font-medium">
                    "{testimonial.message}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => handleOpenModal(testimonial)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        id: testimonial.id,
                        name: testimonial.clientName,
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
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
                  Hapus Testimoni?
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Testimoni dari{" "}
                  <span className="font-bold text-slate-900">
                    "{deleteConfirm.name}"
                  </span>{" "}
                  akan dihapus permanen.
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
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
                </div>
                {editingId ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
              <form
                id="testimonialForm"
                onSubmit={handleSave}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      Nama Klien
                    </label>
                    <div className="relative group">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={18}
                      />
                      <input
                        required
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientName: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      Jabatan / Perusahaan
                    </label>
                    <div className="relative group">
                      <Briefcase
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={18}
                      />
                      <input
                        required
                        type="text"
                        placeholder="CEO at TechCorp"
                        value={formData.clientTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientTitle: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      URL Foto Klien (Opsional)
                    </label>
                    <div className="relative group">
                      <ImageIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="https://contoh.com/foto-budi.jpg"
                        value={formData.clientImage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientImage: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      Pesan Testimoni
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tuliskan ulasan memuaskan dari klien..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      Rating Kepuasan
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                      <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                      <option value={2}>⭐⭐ (2 Bintang)</option>
                      <option value={1}>⭐ (1 Bintang)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 bg-yellow-50/50 border border-yellow-200 p-4 rounded-xl mt-6">
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

            <div className="bg-white border-t border-slate-100 p-5 px-8 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="testimonialForm"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Menyimpan..." : "Simpan Testimoni"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
