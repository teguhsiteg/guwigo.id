"use client";

import { useState, useEffect } from "react";
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
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Bookmark,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  Archive,
  UploadCloud,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { Button, Badge, Modal } from "@/components/ui";
import Card from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "sonner";
import { NewsArticle, NEWS_CATEGORIES, NewsStatus } from "@/types/news";

const defaultFormData: Omit<NewsArticle, "id" | "createdAt" | "updatedAt" | "publishedAt"> = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  category: "Teknologi",
  tags: ["guwigo", "inovasi"],
  coverImage: "/images/branding/logo-guwigo-new.png",
  author: {
    name: "Redaksi Guwigo",
    role: "Editorial Team",
  },
  status: "published",
  isFeatured: false,
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [tagsInput, setTagsInput] = useState("guwigo, inovasi");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<NewsArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: NewsArticle[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as NewsArticle);
      });
      setArticles(list);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat daftar berita");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setTagsInput("guwigo, inovasi");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: NewsArticle) => {
    setEditingId(article.id || null);
    setFormData({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      category: article.category,
      tags: article.tags || [],
      coverImage: article.coverImage || "",
      author: article.author || { name: "Redaksi Guwigo", role: "Editorial Team" },
      status: article.status || "published",
      isFeatured: !!article.isFeatured,
    });
    setTagsInput((article.tags || []).join(", "));
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingId ? prev.slug : autoSlug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "dmykuvc7g");

      const res = await fetch("https://api.cloudinary.com/v1_1/guwigo/image/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.secure_url) {
        setFormData((prev) => ({ ...prev, coverImage: json.secure_url }));
        toast.success("Cover berhasil diunggah!");
      } else {
        toast.error("Gagal mengunggah cover ke Cloudinary");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat unggah cover");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Judul dan isi artikel wajib diisi!");
      return;
    }

    try {
      setIsSaving(true);
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const finalPayload = {
        ...formData,
        tags: parsedTags,
        updatedAt: Timestamp.now(),
      };

      if (editingId) {
        await updateDoc(doc(db, "news", editingId), finalPayload);
        toast.success("Artikel berhasil diperbarui");
      } else {
        await addDoc(collection(db, "news"), {
          ...finalPayload,
          views: 0,
          publishedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
        });
        toast.success("Artikel baru berhasil diterbitkan");
      }

      setIsModalOpen(false);
      fetchArticles();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan artikel");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm?.id) return;
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "news", deleteConfirm.id));
      toast.success("Artikel berhasil dihapus");
      setDeleteConfirm(null);
      fetchArticles();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus artikel");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === "all" || a.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Newspaper className="text-blue-600" />
            Pusat Berita & Artikel
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Publikasikan siaran pers resmi, edukasi teknologi, dan wawasan perkembangan ekosistem Guwigo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/news" target="_blank">
            <Button variant="outline" size="sm" icon={<ExternalLink size={16} />}>
              Lihat Portal Berita
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus size={16} />}>
            Tulis Artikel Baru
          </Button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <Input
            placeholder="Cari berita berdasarkan judul atau kata kunci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">Semua Kategori</option>
            {NEWS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ARTICLES GRID / LIST */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider">Memuat Arsip Berita...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Newspaper size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Belum Ada Artikel Berita</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Mulai tulis siaran pers atau artikel wawasan teknologi pertama untuk publik.
          </p>
          <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus size={16} />}>
            Tulis Berita Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card key={item.id} padding="none" className="overflow-hidden group hover:shadow-lg transition-all border border-slate-200 flex flex-col">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                    No Cover Image
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.isFeatured && (
                    <span className="px-2 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Bookmark size={10} /> Sorotan
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
                    <Calendar size={12} />
                    {item.publishedAt?.toDate?.()?.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) || "Baru saja"}
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.summary || item.content.slice(0, 100)}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{item.author?.name || "Guwigo"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/news/${item.slug}`} target="_blank">
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Halaman Publik"
                      >
                        <Eye size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit Artikel"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Artikel"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Artikel Berita" : "Tulis Artikel Baru"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Judul Artikel"
            placeholder="Contoh: Guwigo Resmi Merilis Sistem Billing & Verifikasi Digital"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slug URL (Otomatis)"
              placeholder="guwigo-resmi-merilis-sistem-billing"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              hint="URL: /news/{slug}"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori Berita
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 outline-none focus:border-blue-500"
              >
                {NEWS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Textarea
            label="Ringkasan Singkat (Lead Paragraph)"
            rows={2}
            placeholder="Ringkasan 1-2 kalimat pengantar berita untuk cuplikan dan SEO meta description..."
            value={formData.summary}
            onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Gambar Sampul (Cover Image)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                placeholder="https://... atau upload file"
                className="flex-1 h-11 px-4 rounded-xl border border-slate-200 text-sm font-mono"
              />
              <label className="cursor-pointer px-4 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-colors">
                <UploadCloud size={16} />
                {isUploading ? "Mengunggah..." : "Pilih File"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <Textarea
            label="Isi Artikel Lengkap"
            rows={8}
            placeholder="Tuliskan naskah berita secara lengkap di sini. Mendukung baris baru dan format paragraf..."
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Penulis / Redaksi"
              value={formData.author.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  author: { ...prev.author, name: e.target.value },
                }))
              }
            />

            <Input
              label="Tag Kata Kunci (Pisahkan koma)"
              placeholder="teknologi, enterprise, inovasi"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                }
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              Jadikan Artikel Sorotan (Featured)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingId ? "Simpan Perubahan" : "Terbitkan Artikel"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Konfirmasi Hapus Artikel"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Apakah Anda yakin ingin menghapus artikel{" "}
            <strong className="text-slate-900">{deleteConfirm?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={isDeleting}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Hapus Artikel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
