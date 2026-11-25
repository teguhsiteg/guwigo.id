"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllEvents,
  saveEvent,
  removeEvent,
} from "@/lib/event-service";
import { EventConfig } from "@/lib/event-config";
import {
  Flag,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EventConfig>({
    slug: "",
    title: "",
    subtitle: "",
    theme: "theme-pocari",
    categories: ["5K", "10K", "21K", "42K"],
    defaultCategory: "21K",
    hashtag: "#EventLari2026",
    organizer: "",
  });

  const [categoriesInput, setCategoriesInput] = useState("5K, 10K, 21K, 42K");

  // Load events
  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Gagal memuat event:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      slug: "",
      title: "",
      subtitle: "",
      theme: "theme-pocari",
      categories: ["5K", "10K", "21K", "42K"],
      defaultCategory: "21K",
      hashtag: "#EventLari2026",
      organizer: "Guwigo Event Technology",
    });
    setCategoriesInput("5K, 10K, 21K, 42K");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (evt: EventConfig) => {
    setIsEditing(true);
    setFormData(evt);
    setCategoriesInput((evt.categories || []).join(", "));
    setIsModalOpen(true);
  };

  // Save Event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug.trim() || !formData.title.trim()) {
      alert("Harap isi Slug URL dan Nama Event.");
      return;
    }

    const cats = categoriesInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const payload: EventConfig = {
      ...formData,
      slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      categories: cats.length > 0 ? cats : ["5K", "10K", "21K", "42K"],
      defaultCategory: cats.includes(formData.defaultCategory)
        ? formData.defaultCategory
        : cats[0] || "21K",
    };

    try {
      await saveEvent(payload);
      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error("Gagal menyimpan event:", err);
      alert("Terjadi kesalahan saat menyimpan event.");
    }
  };

  // Delete Event
  const handleDelete = async (slug: string, title: string) => {
    if (confirm(`Yakin ingin menghapus event "${title}"?`)) {
      try {
        await removeEvent(slug);
        loadEvents();
      } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Gagal menghapus event.");
      }
    }
  };

  // Copy Link
  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://guwigo.com";
    const fullUrl = `${origin}/event/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !isEditing
        ? val
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
        : prev.slug,
    }));
  };

  const filteredEvents = events.filter(
    (e) =>
      (e.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.slug || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.subtitle || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Flag size={20} />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Manajemen Race Card & Event Lari
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Kelola link landing page race card khusus klien (<code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded text-xs font-semibold">guwigo.com/event/[nama-event]</code>)
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus size={18} /> Tambah Event Klien Baru
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama event atau slug link..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900"
          />
        </div>

        <button
          onClick={loadEvents}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          title="Refresh data"
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Events Table / Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                <th className="p-4 pl-6">Nama Event & Sub-title</th>
                <th className="p-4">Link URL Publik Klien</th>
                <th className="p-4">Tema Warna</th>
                <th className="p-4">Kategori Jarak</th>
                <th className="p-4 text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Memuat daftar event...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada event yang terdaftar. Klik <strong>"Tambah Event Klien Baru"</strong> untuk membuat link event pertama Anda.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.slug} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-900 text-base">{evt.title}</div>
                      <div className="text-xs text-slate-500 font-medium">{evt.subtitle}</div>
                      {evt.organizer && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {evt.organizer}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          /event/{evt.slug}
                        </code>
                        <button
                          onClick={() => handleCopyLink(evt.slug)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Copy Link Lengkap"
                        >
                          {copiedSlug === evt.slug ? (
                            <Check size={16} className="text-emerald-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        <a
                          href={`/event/${evt.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Buka Halaman Race Card"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-full ${
                            evt.theme === "theme-maybank"
                              ? "bg-amber-500"
                              : evt.theme === "theme-borobudur"
                              ? "bg-red-600"
                              : evt.theme === "theme-sunset"
                              ? "bg-orange-500"
                              : evt.theme === "theme-cyber"
                              ? "bg-lime-500"
                              : evt.theme === "theme-emerald"
                              ? "bg-emerald-600"
                              : "bg-blue-600"
                          }`}
                        />
                        <span className="text-xs font-medium text-slate-600 capitalize">
                          {(evt.theme || "").replace("theme-", "")}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(evt.categories || []).map((c) => (
                          <span
                            key={c}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(evt)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Konfigurasi"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(evt.slug, evt.title)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">
                {isEditing ? "Edit Konfigurasi Event" : "Tambah Event Klien Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Event Lari *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: POCARI SWEAT RUN 2026"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sub-title / Lokasi Lomba *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BANDUNG · GEDUNG SATE"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Slug URL (Link yang dibagikan) *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-semibold text-slate-500">
                    guwigo.com/event/
                  </span>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    placeholder="pocari-sweat-run-2026"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:border-blue-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tema Warna
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        theme: e.target.value as EventConfig["theme"],
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="theme-pocari">Electric Blue (Pocari)</option>
                    <option value="theme-maybank">Yellow & Black (Maybank)</option>
                    <option value="theme-borobudur">Crimson Red (Borobudur)</option>
                    <option value="theme-sunset">Neon Sunset (Trail Run)</option>
                    <option value="theme-cyber">Cyber Lime (Jakarta Fest)</option>
                    <option value="theme-emerald">Forest Emerald</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Penyelenggara
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pocari Sweat & BeyondPace"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori Jarak (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="5K, 10K, 21K, 42K"
                  value={categoriesInput}
                  onChange={(e) => setCategoriesInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hashtag Footer
                </label>
                <input
                  type="text"
                  placeholder="#PocariRun2026 #BandungLari"
                  value={formData.hashtag}
                  onChange={(e) => setFormData({ ...formData, hashtag: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20"
                >
                  {isEditing ? "Simpan Perubahan" : "Buat Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
