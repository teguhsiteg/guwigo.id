"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Layers,
  Settings,
  Loader2,
  Box,
  CheckCircle,
  CheckCircle2, // <-- Ini yang baru ditambahkan
  AlertCircle,
  XCircle,
  Star,
  ChevronDown,
  ChevronUp,
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
// TIPE DATA STRUKTUR LAYANAN TERBARU
// (Disinkronkan dengan halaman /services)
// ==========================================
interface Feature {
  id: string; // Akan di-generate pakai uuid/math.random saat save
  name: string;
  isIncluded: boolean;
}

interface ProductPackage {
  id?: string;
  name: string;
  price: number;
  billingPeriod: string;
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
  packages: ProductPackage[];
}

interface FormErrors {
  name?: string;
  category?: string;
  description?: string;
  packages?: Record<number, Record<string, string>>;
}

const initialFormState: Product = {
  name: "",
  category: "Development",
  description: "",
  status: "active",
  imageUrl: "",
  packages: [],
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // State untuk Accordion (Menyimpan index paket yang sedang terbuka)
  const [expandedPackages, setExpandedPackages] = useState<number[]>([]);

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

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. CEK AUTENTIKASI ADMIN & AMBIL DATA
  useEffect(() => {
    setIsMounted(true);
    if (!localStorage.getItem("guwigo_admin_session")) {
      router.push("/login");
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data: Product[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...(doc.data() as Product) });
      });
      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      showToast(
        "Pastikan punya koneksi internet yang stabil.",
        "error",
        "Gagal memuat katalog",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  // ==========================================
  // FORM VALIDATION
  // ==========================================
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Nama layanan harus diisi";
    }
    if (!formData.category.trim()) {
      errors.category = "Kategori harus diisi";
    }
    if (!formData.description.trim()) {
      errors.description = "Deskripsi harus diisi";
    }

    if (formData.packages.length === 0) {
      errors.packages = { 0: { global: "Minimal harus ada 1 paket harga" } };
    } else {
      const packageErrors: Record<number, Record<string, string>> = {};
      formData.packages.forEach((pkg, idx) => {
        const pkgErrors: Record<string, string> = {};
        if (!pkg.name.trim()) pkgErrors.name = "Nama paket harus diisi";
        if (pkg.price === undefined || pkg.price === null || isNaN(pkg.price))
          pkgErrors.price = "Harga harus berupa angka valid";

        if (
          pkg.features.length === 0 ||
          pkg.features.every((f) => !f.name.trim())
        ) {
          pkgErrors.features = "Minimal ada 1 fitur yang diisi";
        }
        if (Object.keys(pkgErrors).length > 0) {
          packageErrors[idx] = pkgErrors;
        }
      });
      if (Object.keys(packageErrors).length > 0) {
        errors.packages = packageErrors;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==========================================
  // FUNGSI MANAJEMEN MODAL & DATABASE
  // ==========================================
  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingId(product.id as string);
      setFormData(product);
      // Buka semua accordion saat mode edit
      setExpandedPackages(product.packages.map((_, index) => index));
    } else {
      setEditingId(null);
      setFormData(initialFormState);
      setExpandedPackages([]);
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
    setFormErrors({});
    setExpandedPackages([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast(
        "Periksa kembali baris yang berwarna merah",
        "error",
        "Ada kesalahan pengisian",
      );
      return;
    }

    // Generate ID unik untuk package dan feature sebelum save jika belum ada
    const dataToSave = {
      ...formData,
      packages: formData.packages.map((pkg) => ({
        ...pkg,
        id: pkg.id || `pkg_${Math.random().toString(36).substring(2, 9)}`,
        features: pkg.features.map((f) => ({
          ...f,
          id: f.id || `feat_${Math.random().toString(36).substring(2, 9)}`,
        })),
      })),
    };

    setIsSaving(true);
    try {
      if (editingId) {
        const docRef = doc(db, "products", editingId);
        await updateDoc(docRef, dataToSave);
        showToast("Layanan berhasil diperbarui", "success", "Berhasil");
      } else {
        await addDoc(collection(db, "products"), dataToSave);
        showToast("Layanan baru berhasil diterbitkan", "success", "Berhasil");
      }
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving document: ", error);
      showToast(
        "Terjadi kesalahan saat menyimpan data. Coba lagi.",
        "error",
        "Gagal menyimpan",
      );
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
        `Layanan "${deleteConfirm.name}" berhasil dihapus`,
        "success",
        "Berhasil",
      );
      setDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting document: ", error);
      showToast("Gagal menghapus data. Coba lagi.", "error", "Gagal menghapus");
    } finally {
      setIsDeleting(null);
    }
  };

  // ==========================================
  // FUNGSI ACCORDION
  // ==========================================
  const toggleAccordion = (index: number) => {
    setExpandedPackages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // ==========================================
  // FUNGSI MANAJEMEN DINAMIS PAKET & FITUR
  // ==========================================
  const addPackage = () => {
    const newIndex = formData.packages.length;
    setFormData({
      ...formData,
      packages: [
        ...formData.packages,
        {
          name: "",
          price: 0,
          billingPeriod: "Per Project",
          isPopular: false,
          actionType: "checkout",
          buttonText: "Pesan Sekarang",
          waMessage: "",
          features: [{ id: "", name: "", isIncluded: true }],
        },
      ],
    });
    // Otomatis buka accordion untuk paket yang baru dibuat
    setExpandedPackages((prev) => [...prev, newIndex]);
  };

  const removePackage = (index: number) => {
    const newPackages = [...formData.packages];
    newPackages.splice(index, 1);
    setFormData({ ...formData, packages: newPackages });
    // Update state accordion
    setExpandedPackages((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const updatePackage = (
    index: number,
    field: keyof ProductPackage,
    value: any,
  ) => {
    const newPackages = [...formData.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setFormData({ ...formData, packages: newPackages });
  };

  const addFeature = (pkgIndex: number) => {
    const newPackages = [...formData.packages];
    newPackages[pkgIndex].features.push({ id: "", name: "", isIncluded: true });
    setFormData({ ...formData, packages: newPackages });
  };

  const removeFeature = (pkgIndex: number, featIndex: number) => {
    const newPackages = [...formData.packages];
    newPackages[pkgIndex].features.splice(featIndex, 1);
    setFormData({ ...formData, packages: newPackages });
  };

  const updateFeatureName = (
    pkgIndex: number,
    featIndex: number,
    value: string,
  ) => {
    const newPackages = [...formData.packages];
    newPackages[pkgIndex].features[featIndex].name = value;
    setFormData({ ...formData, packages: newPackages });
  };

  const toggleFeatureInclusion = (pkgIndex: number, featIndex: number) => {
    const newPackages = [...formData.packages];
    newPackages[pkgIndex].features[featIndex].isIncluded =
      !newPackages[pkgIndex].features[featIndex].isIncluded;
    setFormData({ ...formData, packages: newPackages });
  };

  // ==========================================
  // RENDER UI ADMIN
  // ==========================================
  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="p-6 md:p-10 font-sans max-w-6xl mx-auto pb-24">
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
              <Layers className="text-[#22D3EE]" /> Master Katalog Layanan
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Manajemen seluruh produk digital, paket harga, dan metode
              *checkout* ekosistem Guwigo.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#0B1120] hover:bg-slate-800 text-[#22D3EE] px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
          >
            <Plus size={18} /> Tambah Layanan Baru
          </button>
        </div>

        {/* TABEL DATA */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-24 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={40} className="animate-spin mb-4 text-[#22D3EE]" />
              <p className="font-bold text-xs tracking-widest uppercase">
                Menyinkronkan Database...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-900 font-bold text-lg mb-2">
                Katalog Masih Kosong
              </p>
              <p className="text-slate-500 text-sm">
                Klik tombol "Tambah Layanan Baru" di atas untuk mulai membangun
                ekosistem.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-5 pl-8">Info Layanan</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-center">Jumlah Tier</th>
                    <th className="p-5 pr-8 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt="Icon"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Box size={18} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">
                              {product.name}
                            </p>
                            <p className="text-xs font-bold text-[#22D3EE] mt-0.5 uppercase tracking-widest">
                              {product.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${product.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                        >
                          {product.status === "active" ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100">
                          {product.packages.length} Paket
                        </span>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm"
                            title="Edit"
                            aria-label={`Edit layanan ${product.name}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                id: product.id as string,
                                name: product.name,
                              })
                            }
                            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm disabled:opacity-50"
                            title="Hapus"
                            aria-label={`Hapus layanan ${product.name}`}
                            disabled={isDeleting === product.id}
                          >
                            {isDeleting === product.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900 mb-1">
                  Hapus Layanan?
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Layanan{" "}
                  <span className="font-bold text-slate-900">
                    "{deleteConfirm.name}"
                  </span>{" "}
                  beserta seluruh paket harganya akan dihapus permanen.
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

      {/* MODAL FORM CREATE / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-50 w-full max-w-4xl h-[95vh] flex flex-col rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-white/10">
            {/* Modal Header */}
            <div className="bg-[#0B1120] text-white px-8 py-6 flex justify-between items-center shrink-0 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#22D3EE]">
                    {editingId ? <Edit size={20} /> : <Plus size={20} />}
                  </div>
                  {editingId
                    ? "Edit Konfigurasi Layanan"
                    : "Rakit Layanan Baru"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-colors"
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {formErrors &&
                Object.keys(formErrors).length > 0 &&
                formErrors.packages?.["0"]?.global && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-red-700">
                      {formErrors.packages["0"].global}
                    </p>
                  </div>
                )}

              <form
                id="serviceForm"
                onSubmit={handleSave}
                className="space-y-8"
              >
                {/* 1. INFO DASAR */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Settings size={20} className="text-[#22D3EE]" /> Profil
                    Layanan
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Nama Layanan Resmi
                      </label>
                      <input
                        required
                        type="text"
                        className={`w-full bg-slate-50 border rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 focus:bg-white transition-all ${
                          formErrors.name
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="Contoh: Enterprise Web Dev"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (formErrors.name)
                            setFormErrors({ ...formErrors, name: "" });
                        }}
                      />
                      {formErrors.name && (
                        <p className="text-[10px] font-bold text-red-600 mt-2 ml-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Kategori Ekosistem
                      </label>
                      <input
                        required
                        type="text"
                        className={`w-full bg-slate-50 border rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 focus:bg-white transition-all ${
                          formErrors.category
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="Contoh: Development"
                        value={formData.category}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          });
                          if (formErrors.category)
                            setFormErrors({ ...formErrors, category: "" });
                        }}
                      />
                      {formErrors.category && (
                        <p className="text-[10px] font-bold text-red-600 mt-2 ml-1">
                          {formErrors.category}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Deskripsi Promosi
                    </label>
                    <textarea
                      required
                      rows={4}
                      className={`w-full bg-slate-50 border rounded-xl p-4 text-sm font-medium text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 focus:bg-white transition-all resize-none ${
                        formErrors.description
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                      placeholder="Jelaskan *value proposition* dari layanan ini..."
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        });
                        if (formErrors.description)
                          setFormErrors({ ...formErrors, description: "" });
                      }}
                    />
                    {formErrors.description && (
                      <p className="text-[10px] font-bold text-red-600 mt-2 ml-1">
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        URL Icon / Cover (Opsional)
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 focus:bg-white transition-all"
                        placeholder="https://... atau /images/..."
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Status Publikasi
                      </label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 focus:bg-white transition-all cursor-pointer appearance-none"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "active" | "inactive",
                          })
                        }
                      >
                        <option value="active">
                          PUBLISHED (Tampil di Web)
                        </option>
                        <option value="inactive">DRAFT (Sembunyikan)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. MANAJEMEN PAKET (ACCORDION STYLE) */}
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Layers size={20} className="text-[#22D3EE]" />{" "}
                        Arsitektur Paket Harga
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Gunakan toggle panah untuk membuka/menutup form tiap
                        paket.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addPackage}
                      className="bg-[#0B1120] text-[#22D3EE] px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                      <Plus size={16} /> Tier Baru
                    </button>
                  </div>

                  {formData.packages.length === 0 && (
                    <div className="text-center p-16 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-500">
                      <Layers
                        size={48}
                        className="mx-auto mb-4 text-slate-300"
                      />
                      <p className="font-black text-slate-900 text-lg mb-1 tracking-tight">
                        Belum ada arsitektur paket
                      </p>
                      <p className="text-sm font-medium">
                        Klik tombol "Tier Baru" di atas untuk membuat varian
                        harga.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {formData.packages.map((pkg, pkgIndex) => {
                      const isExpanded = expandedPackages.includes(pkgIndex);

                      return (
                        <div
                          key={pkgIndex}
                          className={`bg-white rounded-[2rem] border shadow-sm relative overflow-hidden transition-all duration-300 ${
                            formErrors.packages?.[pkgIndex]
                              ? "border-red-300"
                              : pkg.isPopular
                                ? "border-[#22D3EE]"
                                : "border-slate-200"
                          }`}
                        >
                          {/* Accordion Header */}
                          <div
                            className={`flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors ${isExpanded ? "border-b border-slate-100" : ""}`}
                            onClick={() => toggleAccordion(pkgIndex)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                {isExpanded ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                  {pkg.name || `Paket #${pkgIndex + 1}`}
                                  {pkg.isPopular && (
                                    <Star
                                      size={14}
                                      className="fill-[#22D3EE] text-[#22D3EE]"
                                    />
                                  )}
                                </h4>
                                {!isExpanded && (
                                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                                    Rp
                                    {Number(pkg.price).toLocaleString(
                                      "id-ID",
                                    )}{" "}
                                    • {pkg.features.length} Fitur
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // Mencegah accordion tertrigger
                                removePackage(pkgIndex);
                              }}
                              className="text-slate-400 hover:text-white bg-slate-100 hover:bg-red-500 p-2.5 rounded-xl transition-colors shadow-sm"
                              title="Hapus Paket"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Accordion Body (Form) */}
                          {isExpanded && (
                            <div className="p-6 md:p-8 bg-slate-50/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="lg:col-span-2">
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Nama Paket *
                                  </label>
                                  <input
                                    required
                                    type="text"
                                    className={`w-full bg-white border rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all ${
                                      formErrors.packages?.[pkgIndex]?.name
                                        ? "border-red-500"
                                        : "border-slate-200"
                                    }`}
                                    placeholder="Contoh: Essential Pro"
                                    value={pkg.name}
                                    onChange={(e) =>
                                      updatePackage(
                                        pkgIndex,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Harga (Rp) *
                                  </label>
                                  <input
                                    required
                                    type="number"
                                    min="0"
                                    className={`w-full bg-white border rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all ${
                                      formErrors.packages?.[pkgIndex]?.price
                                        ? "border-red-500"
                                        : "border-slate-200"
                                    }`}
                                    placeholder="0 = Gratis"
                                    value={pkg.price}
                                    onChange={(e) =>
                                      updatePackage(
                                        pkgIndex,
                                        "price",
                                        Number(e.target.value),
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Siklus
                                  </label>
                                  <input
                                    required
                                    type="text"
                                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all"
                                    placeholder="Bulan / Project"
                                    value={pkg.billingPeriod}
                                    onChange={(e) =>
                                      updatePackage(
                                        pkgIndex,
                                        "billingPeriod",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-6 rounded-2xl border border-slate-200">
                                <div>
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                    Opsi Visual
                                  </label>
                                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={pkg.isPopular}
                                        onChange={(e) =>
                                          updatePackage(
                                            pkgIndex,
                                            "isPopular",
                                            e.target.checked,
                                          )
                                        }
                                      />
                                      <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22D3EE]"></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                      <Star
                                        size={14}
                                        className={
                                          pkg.isPopular
                                            ? "fill-[#22D3EE] text-[#22D3EE]"
                                            : "text-slate-400"
                                        }
                                      />
                                      Jadikan Rekomendasi
                                    </span>
                                  </label>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Logika Checkout (Call to Action)
                                  </label>
                                  <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold text-slate-900 outline-none focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all cursor-pointer appearance-none"
                                    value={pkg.actionType}
                                    onChange={(e) =>
                                      updatePackage(
                                        pkgIndex,
                                        "actionType",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="checkout">
                                      Tripay Payment Gateway (Instan)
                                    </option>
                                    <option value="whatsapp">
                                      Konsultasi WhatsApp (Manual Deal)
                                    </option>
                                  </select>
                                </div>
                              </div>

                              {/* DAFTAR FITUR */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Matriks Fitur
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => addFeature(pkgIndex)}
                                    className="text-[#0B1120] hover:text-[#22D3EE] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg transition-colors shadow-sm"
                                  >
                                    <Plus size={14} /> Tambah Baris
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  {pkg.features.map((feat, featIndex) => (
                                    <div
                                      key={featIndex}
                                      className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 focus-within:border-[#22D3EE] focus-within:ring-2 focus-within:ring-[#22D3EE]/20 transition-all shadow-sm"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleFeatureInclusion(
                                            pkgIndex,
                                            featIndex,
                                          )
                                        }
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${feat.isIncluded ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"}`}
                                        title={
                                          feat.isIncluded
                                            ? "Termasuk (Centang)"
                                            : "Tidak Termasuk (Coret)"
                                        }
                                      >
                                        {feat.isIncluded ? (
                                          <CheckCircle2 size={18} />
                                        ) : (
                                          <X size={18} />
                                        )}
                                      </button>

                                      <input
                                        required
                                        type="text"
                                        className={`flex-1 bg-transparent border-none p-2 text-sm outline-none transition-colors ${feat.isIncluded ? "font-bold text-slate-900" : "font-medium text-slate-400 line-through"}`}
                                        placeholder="Deskripsi fitur..."
                                        value={feat.name}
                                        onChange={(e) =>
                                          updateFeatureName(
                                            pkgIndex,
                                            featIndex,
                                            e.target.value,
                                          )
                                        }
                                      />

                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeFeature(pkgIndex, featIndex)
                                        }
                                        className="w-10 h-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 transition-colors flex items-center justify-center"
                                        title="Hapus Baris"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ))}
                                </div>

                                {formErrors.packages?.[pkgIndex]?.features && (
                                  <p className="text-[10px] font-bold text-red-600 mt-3 ml-1 uppercase tracking-widest">
                                    * {formErrors.packages[pkgIndex].features}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#0B1120] p-6 px-8 flex justify-end gap-4 shrink-0 rounded-b-[2.5rem]">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Batalkan
              </button>
              <button
                type="submit"
                form="serviceForm"
                disabled={isSaving}
                className="bg-[#22D3EE] hover:bg-white text-[#0B1120] px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 shadow-xl shadow-[#22D3EE]/20 active:scale-95"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Menyimpan..." : "Simpan Arsitektur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
