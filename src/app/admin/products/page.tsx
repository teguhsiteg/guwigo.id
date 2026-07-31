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
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  Package,
  Edit2,
  Save,
  X,
  Plus,
  Loader2,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Layers, // <--- TAMBAHKAN INI DI SINI PAK
  CheckCircle,
  AlertCircle,
  XCircle,
  UploadCloud,
  Check,
  MessageCircle,
  ShoppingCart,
  Star,
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
// INTERFACES (SAAS PRICING MODEL)
// ==========================================
interface Feature {
  id: string;
  name: string;
  isIncluded: boolean;
}

interface ProductPackage {
  id: string;
  name: string;
  price: number;
  billingPeriod: string; // e.g., "Bulan", "Tahun", "Sekali Bayar"
  isPopular: boolean;
  actionType: "checkout" | "whatsapp";
  buttonText: string;
  waMessage: string;
  features: Feature[];
}

interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive";
  imageUrl: string;
  packages: ProductPackage[]; // Array of packages/tiers
}

const initialFormState: Product = {
  name: "",
  description: "",
  category: "",
  status: "active",
  imageUrl: "",
  packages: [],
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>(initialFormState);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, "products"), orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Gagal memuat produk. Periksa koneksi.", "error", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingId(product.id as string);
      setFormData(product);
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  // ==========================================
  // CLOUDINARY UPLOAD LOGIC
  // ==========================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("File harus berupa gambar (JPG, PNG, dll)", "error", "Invalid");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran gambar maksimal 5MB", "error", "Terlalu Besar");
      return;
    }

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "dmykuvc7g");

    try {
      showToast("Mengunggah gambar...", "info", "Uploading");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/guwigo/image/upload",
        {
          method: "POST",
          body: formDataUpload,
        },
      );
      const data = await response.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
        showToast("Gambar berhasil diunggah!", "success", "Sukses");
      } else {
        throw new Error("Gagal upload");
      }
    } catch (error) {
      showToast("Gagal mengunggah gambar.", "error", "Error");
    } finally {
      setIsUploading(false);
    }
  };

  // ==========================================
  // DYNAMIC PACKAGE BUILDER LOGIC
  // ==========================================
  const addPackage = () => {
    const newPackage: ProductPackage = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      price: 0,
      billingPeriod: "Sekali Bayar",
      isPopular: false,
      actionType: "checkout",
      buttonText: "Beli Sekarang",
      waMessage: "Halo Admin Guwigo, saya tertarik dengan paket ini.",
      features: [],
    };
    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, newPackage],
    }));
  };

  const updatePackage = (
    pkgId: string,
    field: keyof ProductPackage,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) =>
        pkg.id === pkgId ? { ...pkg, [field]: value } : pkg,
      ),
    }));
  };

  const removePackage = (pkgId: string) => {
    if (confirm("Yakin ingin menghapus paket ini?")) {
      setFormData((prev) => ({
        ...prev,
        packages: prev.packages.filter((pkg) => pkg.id !== pkgId),
      }));
    }
  };

  const addFeature = (pkgId: string) => {
    const newFeature: Feature = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      isIncluded: true,
    };
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) =>
        pkg.id === pkgId
          ? { ...pkg, features: [...pkg.features, newFeature] }
          : pkg,
      ),
    }));
  };

  const updateFeature = (
    pkgId: string,
    featId: string,
    field: keyof Feature,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) => {
        if (pkg.id !== pkgId) return pkg;
        return {
          ...pkg,
          features: pkg.features.map((feat) =>
            feat.id === featId ? { ...feat, [field]: value } : feat,
          ),
        };
      }),
    }));
  };

  const removeFeature = (pkgId: string, featId: string) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) => {
        if (pkg.id !== pkgId) return pkg;
        return {
          ...pkg,
          features: pkg.features.filter((feat) => feat.id !== featId),
        };
      }),
    }));
  };

  // ==========================================
  // SAVE & DELETE LOGIC
  // ==========================================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama produk wajib diisi!", "error", "Validasi Gagal");
      return;
    }
    if (isUploading) {
      showToast("Tunggu gambar selesai diunggah!", "error", "Proses Berjalan");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), { ...formData });
        showToast("Produk berhasil diperbarui!", "success", "Tersimpan");
      } else {
        await addDoc(collection(db, "products"), {
          ...formData,
          createdAt: Timestamp.now(),
        });
        showToast("Produk baru berhasil ditambahkan!", "success", "Tersimpan");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      showToast("Terjadi kesalahan saat menyimpan.", "error", "Gagal");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(deleteConfirm.id);
    try {
      await deleteDoc(doc(db, "products", deleteConfirm.id));
      showToast(
        `Produk "${deleteConfirm.name}" dihapus.`,
        "success",
        "Terhapus",
      );
      setDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      showToast("Gagal menghapus produk.", "error", "Error");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Data...
        </p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="p-6 md:p-10 font-sans max-w-7xl mx-auto pb-24">
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
              <Package className="text-blue-600" /> SaaS Product Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Kelola produk digital, paket harga (tiers), dan fitur layanan
              Anda. Total {products.length} Produk.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} /> Tambah Produk
          </button>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-slate-300" />
              </div>
              <p className="font-bold text-slate-900 text-lg mb-1">
                Belum Ada Produk
              </p>
              <p className="text-slate-500 text-sm">
                Klik "Tambah Produk" untuk mulai membangun skema harga Anda.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
                <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <ImageIcon size={40} className="mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        No Image
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        product.status === "active"
                          ? "bg-green-500 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {product.status === "active" ? "Active" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                        {product.category || "Uncategorized"}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Layers size={16} className="text-slate-400" />
                      {product.packages?.length || 0} Paket Tersedia
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl text-sm font-bold transition-colors"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          id: product.id as string,
                          name: product.name,
                        })
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl text-sm font-bold transition-colors"
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
                  Hapus Produk?
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Produk{" "}
                  <span className="font-bold text-slate-900">
                    "{deleteConfirm.name}"
                  </span>{" "}
                  akan dihapus beserta semua paket harga di dalamnya.
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
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center gap-2"
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
          MODAL FORM CREATE / EDIT (SUPER LARGE)
      ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl h-full max-h-[95vh] flex flex-col rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 md:px-8 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
                </div>
                {editingId ? "Edit Layanan & Paket" : "Buat Layanan Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
              <form
                id="productForm"
                onSubmit={handleSave}
                className="space-y-8"
              >
                {/* --- SECTION 1: INFO UTAMA --- */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Package className="text-blue-600" /> Informasi Utama
                    Layanan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Nama Produk / Layanan
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Contoh: Guwigo Live Streaming App"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Kategori
                      </label>
                      <div className="relative group">
                        <Tag
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <input
                          required
                          type="text"
                          placeholder="SaaS, Agency, dll"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Status Publikasi
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "active" | "inactive",
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer text-gray-900"
                      >
                        <option value="active">Active (Tampil di Web)</option>
                        <option value="inactive">Inactive (Sembunyikan)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Gambar Banner / Icon
                      </label>
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="w-28 h-28 shrink-0 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center relative">
                          {formData.imageUrl ? (
                            <img
                              src={formData.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={32} className="text-slate-300" />
                          )}
                          {isUploading && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                              <Loader2
                                className="animate-spin text-blue-600"
                                size={24}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 w-full">
                          <label
                            className={`flex items-center gap-3 px-4 py-3 w-full border-2 border-dashed rounded-xl cursor-pointer transition-all ${isUploading ? "bg-slate-50 border-slate-200 opacity-50" : "bg-blue-50 hover:bg-blue-100 border-blue-200"}`}
                          >
                            <UploadCloud
                              className={
                                isUploading ? "text-slate-400" : "text-blue-600"
                              }
                              size={20}
                            />
                            <span className="text-sm font-bold text-slate-700">
                              {isUploading
                                ? "Mengunggah..."
                                : "Pilih File Gambar (Maks 5MB)"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploading}
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Deskripsi Singkat
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Penjelasan singkat mengenai layanan ini..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* --- SECTION 2: DYNAMIC PACKAGE BUILDER --- */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Layers className="text-blue-600" /> Varian Paket & Harga
                      (Tiers)
                    </h3>
                    <button
                      type="button"
                      onClick={addPackage}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <Plus size={16} /> Tambah Paket
                    </button>
                  </div>

                  {formData.packages.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <Layers
                        size={40}
                        className="text-slate-300 mx-auto mb-3"
                      />
                      <p className="font-bold text-slate-600">
                        Belum ada paket harga.
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Klik tombol tambah paket di atas untuk mulai membuat
                        opsi harga (contoh: Free, Pro, Enterprise).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {formData.packages.map((pkg, pkgIndex) => (
                        <div
                          key={pkg.id}
                          className="relative bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 overflow-visible transition-all hover:border-blue-300"
                        >
                          {/* Tombol Hapus Paket */}
                          <button
                            type="button"
                            onClick={() => removePackage(pkg.id)}
                            className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-full shadow-sm transition-colors border border-red-200"
                            title="Hapus Paket"
                          >
                            <X size={16} />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* --- KIRI: Pengaturan Paket --- */}
                            <div className="md:col-span-5 space-y-5">
                              <h4 className="font-black text-slate-800 flex items-center gap-2 bg-slate-200/50 w-fit px-3 py-1 rounded-md text-xs uppercase tracking-widest">
                                Setting Paket {pkgIndex + 1}
                              </h4>

                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">
                                  Nama Paket
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Cth: Premium Tier"
                                  value={pkg.name}
                                  onChange={(e) =>
                                    updatePackage(
                                      pkg.id,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-bold focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">
                                    Harga (Rp)
                                  </label>
                                  <input
                                    type="number"
                                    required
                                    min="0"
                                    placeholder="0"
                                    value={pkg.price === 0 ? "" : pkg.price}
                                    onChange={(e) =>
                                      updatePackage(
                                        pkg.id,
                                        "price",
                                        Number(e.target.value),
                                      )
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-bold focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1">
                                    Siklus Tagihan
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="/Bulan, /Tahun, dll"
                                    value={pkg.billingPeriod}
                                    onChange={(e) =>
                                      updatePackage(
                                        pkg.id,
                                        "billingPeriod",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-bold focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400"
                                  />
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <label className="block text-xs font-bold text-slate-500 mb-2 border-b border-slate-100 pb-2">
                                  Aksi Tombol Pembelian
                                </label>
                                <div className="space-y-3 mt-2">
                                  <div className="flex gap-2">
                                    <select
                                      value={pkg.actionType}
                                      onChange={(e) =>
                                        updatePackage(
                                          pkg.id,
                                          "actionType",
                                          e.target.value,
                                        )
                                      }
                                      className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none text-gray-900 cursor-pointer"
                                    >
                                      <option value="checkout">
                                        Tripay Checkout
                                      </option>
                                      <option value="whatsapp">
                                        Chat WhatsApp
                                      </option>
                                    </select>
                                    <input
                                      type="text"
                                      required
                                      placeholder="Teks Tombol (cth: Beli)"
                                      value={pkg.buttonText}
                                      onChange={(e) =>
                                        updatePackage(
                                          pkg.id,
                                          "buttonText",
                                          e.target.value,
                                        )
                                      }
                                      className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:outline-none text-gray-900 placeholder:text-gray-400"
                                    />
                                  </div>
                                  {pkg.actionType === "whatsapp" && (
                                    <textarea
                                      rows={2}
                                      placeholder="Pesan otomatis WA..."
                                      value={pkg.waMessage}
                                      onChange={(e) =>
                                        updatePackage(
                                          pkg.id,
                                          "waMessage",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:outline-none resize-none text-gray-900 placeholder:text-gray-400"
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="checkbox"
                                  id={`popular-${pkg.id}`}
                                  checked={pkg.isPopular}
                                  onChange={(e) =>
                                    updatePackage(
                                      pkg.id,
                                      "isPopular",
                                      e.target.checked,
                                    )
                                  }
                                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                />
                                <label
                                  htmlFor={`popular-${pkg.id}`}
                                  className="text-sm font-bold text-slate-700 cursor-pointer flex items-center gap-1"
                                >
                                  Tandai "Most Popular"{" "}
                                  <Star
                                    size={14}
                                    className={
                                      pkg.isPopular
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-slate-300"
                                    }
                                  />
                                </label>
                              </div>
                            </div>

                            {/* --- KANAN: Daftar Fitur --- */}
                            <div className="md:col-span-7 bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
                              <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                                <h4 className="font-bold text-slate-800 text-sm">
                                  Daftar Fitur (Checklist)
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => addFeature(pkg.id)}
                                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                >
                                  <Plus size={12} /> Tambah
                                </button>
                              </div>

                              <div className="flex-1 space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                {pkg.features.length === 0 ? (
                                  <p className="text-xs text-slate-400 text-center py-4">
                                    Belum ada fitur ditambahkan.
                                  </p>
                                ) : (
                                  pkg.features.map((feat) => (
                                    <div
                                      key={feat.id}
                                      className="flex items-center gap-2 group"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateFeature(
                                            pkg.id,
                                            feat.id,
                                            "isIncluded",
                                            !feat.isIncluded,
                                          )
                                        }
                                        className={`shrink-0 p-1.5 rounded-md transition-colors ${feat.isIncluded ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                                        title={
                                          feat.isIncluded
                                            ? "Ubah jadi Silang"
                                            : "Ubah jadi Centang"
                                        }
                                      >
                                        {feat.isIncluded ? (
                                          <Check size={14} strokeWidth={3} />
                                        ) : (
                                          <X size={14} strokeWidth={3} />
                                        )}
                                      </button>
                                      <input
                                        type="text"
                                        required
                                        placeholder="Teks fitur (cth: Support 24/7)"
                                        value={feat.name}
                                        onChange={(e) =>
                                          updateFeature(
                                            pkg.id,
                                            feat.id,
                                            "name",
                                            e.target.value,
                                          )
                                        }
                                        className={`flex-1 bg-slate-50 border border-slate-200 rounded-md p-1.5 px-3 text-xs focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400 ${feat.isIncluded ? "text-gray-900 font-bold" : "text-gray-400 line-through font-medium"}`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeFeature(pkg.id, feat.id)
                                        }
                                        className="shrink-0 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-slate-200 p-5 px-6 md:px-8 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="productForm"
                disabled={isSaving || isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                {isSaving || isUploading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
