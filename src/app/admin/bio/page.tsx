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
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header Admin */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutGrid
              className="text-[#00D4FF] fill-[#00D4FF]/20"
              size={32}
            />
            Manajemen Link in Bio
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Atur konfigurasi tampilan tautan Bento Grid untuk halaman /bio
            perusahaan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PANEL KIRI: FORM INPUT */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-32">
              <h2 className="text-xl font-black text-[#0B1324] mb-6 flex items-center gap-2">
                {editingId ? (
                  <Edit2 size={20} className="text-amber-500" />
                ) : (
                  <Plus size={20} className="text-[#00D4FF]" />
                )}
                {editingId ? "Edit Tautan Bio" : "Tambah Tautan Baru"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                    Judul Tautan
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all"
                    placeholder="Contoh: Guwigo Store"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all resize-none"
                    placeholder="Contoh: Katalog merch premium."
                  ></textarea>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                    URL Tujuan
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all"
                    placeholder="Contoh: /store atau https://domain.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                      Ikon Visual
                    </label>
                    <select
                      name="iconName"
                      value={formData.iconName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all cursor-pointer"
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                      Urutan Tampil
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      required
                      min={1}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                    Ukuran Kotak (Bento Size)
                  </label>
                  <select
                    name="colSpan"
                    value={formData.colSpan}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all cursor-pointer"
                  >
                    <option value="col-span-2 sm:col-span-1">
                      Setengah Lebar (Half)
                    </option>
                    <option value="col-span-2">Lebar Penuh (Full Width)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-300 text-[#00D4FF] focus:ring-[#00D4FF]"
                    />
                    <div>
                      <span className="text-sm font-black text-[#0B1324] block">
                        Jadikan Sorotan (Featured)
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Ubah warna menjadi Cyan mencolok.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-[#0B1324] text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-[#00D4FF] hover:text-[#0B1324] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
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
                      className="px-6 bg-slate-100 text-slate-600 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
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
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[600px]">
              <h2 className="text-xl font-black text-[#0B1324] mb-6 flex items-center gap-2 border-b border-slate-100 pb-6">
                <LinkIcon size={20} className="text-slate-400" />
                Daftar Tautan Aktif
              </h2>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2
                    size={32}
                    className="animate-spin text-[#00D4FF] mb-4"
                  />
                  <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                    Memuat Database...
                  </p>
                </div>
              ) : links.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500 font-medium">
                    Belum ada tautan yang ditambahkan.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl border transition-all ${
                        link.featured
                          ? "border-[#00D4FF] bg-[#00D4FF]/5"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 font-black text-slate-500">
                          {link.order}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-base">
                            {link.title}
                          </h3>
                          <p className="text-xs font-medium text-slate-500 mb-1">
                            {link.url}
                          </p>
                          <div className="flex gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                              Ikon: {link.iconName}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
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
                          className="flex-1 sm:flex-none p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                          title="Edit Tautan"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="flex-1 sm:flex-none p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                          title="Hapus Tautan"
                        >
                          <Trash2 size={16} />
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
