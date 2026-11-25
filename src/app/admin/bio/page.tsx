"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Plus,
  Save,
  Trash2,
  Edit2,
  Loader2,
  Link as LinkIcon,
  LayoutGrid,
} from "lucide-react";

// Interface Data
interface BioLink {
  id: string;
  title: string;
  desc: string;
  url: string;
  iconName: string;
  featured: boolean;
  colSpan: string;
  order: number;
}

export default function AdminBioPage() {
  const [links, setLinks] = useState<BioLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State Formulir
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    url: "",
    iconName: "Terminal",
    featured: false,
    colSpan: "col-span-2 sm:col-span-1",
    order: 1,
  });

  // Ambil Data dari Firestore
  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "bio_links"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const data: BioLink[] = [];
      snapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as BioLink);
      });
      setLinks(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  // Simpan atau Update Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        // Update data
        const docRef = doc(db, "bio_links", editingId);
        await updateDoc(docRef, formData);
        alert("Tautan berhasil diperbarui!");
      } else {
        // Tambah data baru
        await addDoc(collection(db, "bio_links"), formData);
        alert("Tautan baru berhasil ditambahkan!");
      }

      // Reset form dan refresh data
      setEditingId(null);
      setFormData({
        title: "",
        desc: "",
        url: "",
        iconName: "Terminal",
        featured: false,
        colSpan: "col-span-2 sm:col-span-1",
        order: links.length + 2, // Otomatis taruh di urutan paling bawah
      });
      fetchLinks();
    } catch (error) {
      console.error("Error menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  // Persiapkan Form untuk Edit
  const handleEdit = (link: BioLink) => {
    setEditingId(link.id);
    setFormData({
      title: link.title,
      desc: link.desc,
      url: link.url,
      iconName: link.iconName,
      featured: link.featured,
      colSpan: link.colSpan,
      order: link.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hapus Data
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tautan ini?")) return;
    try {
      await deleteDoc(doc(db, "bio_links", id));
      fetchLinks();
    } catch (error) {
      console.error("Error menghapus data:", error);
    }
  };

  // Batal Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      desc: "",
      url: "",
      iconName: "Terminal",
      featured: false,
      colSpan: "col-span-2 sm:col-span-1",
      order: links.length + 1,
    });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 font-sans selection:bg-[#2563EB]/20 selection:text-[#0F172A]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header Admin */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-serif font-normal text-[#0F172A] tracking-tight flex items-center gap-3">
            <LayoutGrid
              className="text-[#2563EB] fill-[#2563EB]/10"
              size={30}
            />
            Manajemen <span className="italic text-[#2563EB]">Link in Bio</span>
          </h1>
          <p className="text-slate-500 font-normal text-sm mt-2">
            Atur konfigurasi tautan dan ekosistem digital untuk laman /bio Guwigo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PANEL KIRI: FORM INPUT */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#E2E8F0] shadow-sm sticky top-32">
              <h2 className="text-lg font-serif font-normal text-[#0F172A] mb-6 flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
                {editingId ? (
                  <Edit2 size={18} className="text-amber-500" />
                ) : (
                  <Plus size={18} className="text-[#2563EB]" />
                )}
                {editingId ? "Edit Tautan Bio" : "Tambah Tautan Baru"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 ml-0.5 block mb-1.5">
                    Judul Tautan
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50/50 border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    placeholder="Contoh: Guwigo Store"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 ml-0.5 block mb-1.5">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full bg-slate-50/50 border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all resize-none"
                    placeholder="Contoh: Katalog merchandise resmi & apparel."
                  ></textarea>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 ml-0.5 block mb-1.5">
                    URL Tujuan
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50/50 border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    placeholder="Contoh: /store atau https://domain.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 ml-0.5 block mb-1.5">
                      Ikon Visual
                    </label>
                    <select
                      name="iconName"
                      value={formData.iconName}
                      onChange={handleChange}
                      className="w-full bg-slate-50/50 border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all cursor-pointer"
                    >
                      <option value="Terminal">Terminal (Tech)</option>
                      <option value="Globe">Globe (Web)</option>
                      <option value="ShoppingBag">Shopping Bag (Store)</option>
                      <option value="Code2">Code (Dev)</option>
                      <option value="MessageCircle">Chat (WA)</option>
                      <option value="Briefcase">Briefcase (Business)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 ml-0.5 block mb-1.5">
                      Urutan Tampil
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      required
                      min={1}
                      className="w-full bg-slate-50/50 border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 ml-0.5 block mb-1.5">
                    Ukuran Kotak (Bento Size)
                  </label>
                  <select
                    name="colSpan"
                    value={formData.colSpan}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all cursor-pointer"
                  >
                    <option value="col-span-2 sm:col-span-1">
                      Setengah Lebar (Half)
                    </option>
                    <option value="col-span-2">Lebar Penuh (Full Width)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3.5 border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <div>
                      <span className="text-sm font-medium text-[#0F172A] block">
                        Jadikan Sorotan (Featured)
                      </span>
                      <span className="text-xs text-slate-500 font-normal">
                        Tandai sebagai tautan prioritas utama.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {editingId ? "Update Data" : "Simpan Tautan"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-5 bg-slate-100 text-slate-600 font-medium rounded-lg text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* PANEL KANAN: DAFTAR TAUTAN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#E2E8F0] shadow-sm min-h-[600px]">
              <h2 className="text-lg font-serif font-normal text-[#0F172A] mb-6 flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
                <LinkIcon size={18} className="text-slate-400" />
                Daftar Tautan Aktif
              </h2>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2
                    size={28}
                    className="animate-spin text-[#2563EB] mb-4"
                  />
                  <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                    Memuat Database...
                  </p>
                </div>
              ) : links.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-[#E2E8F0]">
                  <p className="text-slate-500 font-normal text-sm">
                    Belum ada tautan yang ditambahkan.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border transition-all ${
                        link.featured
                          ? "border-[#2563EB] bg-[#2563EB]/5"
                          : "border-[#E2E8F0] bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 font-mono text-xs font-semibold text-slate-600">
                          {link.order}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">
                            {link.title}
                          </h3>
                          <p className="text-xs font-normal text-slate-500 mb-1">
                            {link.url}
                          </p>
                          <div className="flex gap-2">
                            <span className="text-[9px] font-mono uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              Ikon: {link.iconName}
                            </span>
                            <span className="text-[9px] font-mono uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {link.colSpan.includes("sm:col-span-1")
                                ? "Half Width"
                                : "Full Width"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleEdit(link)}
                          className="flex-1 sm:flex-none p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                          title="Edit Tautan"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="flex-1 sm:flex-none p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                          title="Hapus Tautan"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
