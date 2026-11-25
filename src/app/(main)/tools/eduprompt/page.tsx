"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Wand2,
  Building2,
  Target,
  Palette,
  ListChecks,
  Shapes,
  Terminal,
  Copy,
  RefreshCcw,
  Trash2,
  Box,
  Layers,
  Gem,
  Network,
  Briefcase,
  Smile,
  Crown,
  Heart,
  Coffee,
  Info,
  CheckCircle2,
} from "lucide-react";

const INITIAL_FORM_STATE = {
  nama: "",
  tagline: "",
  akreditasi: "",
  logo: "",
  alamat: "",
  wa: "",
  sosmed: "",
  tujuan: "Pendaftaran siswa baru",
  format: "Poster A4",
  audiens: "Calon mahasiswa dan orang tua",
  style: "3D modern dengan elemen melayang",
  warna1: "Biru Navy",
  warna2: "Putih Bersih",
  warna3: "Emas (Gold)",
  tahun: "2027/2028",
  prodi: "",
  keunggulan: "",
  fasilitas: "",
  beasiswa: "",
  jadwal: "",
  syarat: "",
  cara: "",
  qr: true,
  catatan: "",
  visualElements: ["Badge atau Pita bertuliskan 'Daftar Sekarang'"] as string[],
};

const STYLE_OPTIONS = [
  { id: "3D modern dengan elemen melayang", label: "3D Modern", icon: Box },
  {
    id: "2D flat design yang clean dan rapi",
    label: "2D Flat Design",
    icon: Layers,
  },
  {
    id: "Minimalis elegan dengan banyak white space",
    label: "Minimalis Elegan",
    icon: Gem,
  },
  {
    id: "Futuristic education dengan nuansa teknologi",
    label: "Futuristic Edu",
    icon: Network,
  },
  {
    id: "Corporate academic yang formal dan terpercaya",
    label: "Corporate Academic",
    icon: Briefcase,
  },
  {
    id: "Colorful student life yang ceria dan energik",
    label: "Colorful Student",
    icon: Smile,
  },
  {
    id: "Premium campus dengan nuansa mewah eksklusif",
    label: "Premium Campus",
    icon: Crown,
  },
];

const VISUAL_ELEMENTS_OPTIONS = [
  { label: "Foto Siswa/i", value: "Foto profil siswa/mahasiswa tersenyum" },
  { label: "Gedung Kampus", value: "Foto/Ilustrasi gedung kampus yang megah" },
  {
    label: "Ilustrasi 3D",
    value: "Ilustrasi 3D edukasi (buku, pensil terbang, dll)",
  },
  { label: "Ikon Buku", value: "Ikon grafis buku dan perlengkapan belajar" },
  { label: "Topi Toga", value: "Ilustrasi topi Toga kelulusan" },
  { label: "Laptop/Gadget", value: "Ilustrasi mahasiswa menggunakan laptop" },
  {
    label: 'Badge "Daftar"',
    value: "Badge atau Pita bertuliskan 'Daftar Sekarang'",
  },
  {
    label: "Grafik Progres",
    value: "Grafik/Panah yang menunjukkan progres (naik)",
  },
];

export default function EduPromptPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [promptOutput, setPromptOutput] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fungsi Pembuat Prompt
  const generatePrompt = () => {
    const v = formData;
    let prompt = `Tolong buatkan gambar desain ${v.format || "[Format]"} untuk keperluan ${v.tujuan || "[Tujuan]"}.\n\n`;

    prompt += `--- STYLE & TEMA VISUAL ---\n`;
    prompt += `Gaya visual yang diinginkan adalah: ${v.style}.\n`;
    prompt += `Gunakan palet warna utama: ${v.warna1 || "Biru"}, warna sekunder/latar: ${v.warna2 || "Putih"}, dan warna aksen/tombol: ${v.warna3 || "Emas"}.\n\n`;

    prompt += `--- IDENTITAS LEMBAGA ---\n`;
    prompt += `Nama Institusi: ${v.nama || "[Nama Institusi]"}\n`;
    if (v.tagline) prompt += `Tagline: "${v.tagline}"\n`;
    if (v.akreditasi) prompt += `Status: ${v.akreditasi}\n`;
    if (v.logo) prompt += `Instruksi Logo: ${v.logo}\n`;

    let kontak = [];
    if (v.alamat) kontak.push(`Alamat: ${v.alamat}`);
    if (v.wa) kontak.push(`WhatsApp: ${v.wa}`);
    if (v.sosmed) kontak.push(`Sosmed: ${v.sosmed}`);
    if (kontak.length > 0)
      prompt += `Info Kontak di desain: ${kontak.join(" | ")}\n`;
    prompt += `\n`;

    prompt += `--- INFORMASI KONTEN (Teks Utama) ---\n`;
    prompt += `Target Audiens: ${v.audiens}\n`;
    prompt += `Tahun Ajaran: ${v.tahun || "[Tahun Ajaran]"}\n`;
    if (v.prodi) prompt += `Program Studi/Jurusan: ${v.prodi}\n`;
    if (v.keunggulan)
      prompt += `Keunggulan:\n${v.keunggulan
        .split("\n")
        .map((line) => (line.startsWith("-") ? line : "- " + line))
        .join("\n")}\n`;
    if (v.fasilitas)
      prompt += `Fasilitas Utama:\n${v.fasilitas
        .split("\n")
        .map((line) => (line.startsWith("-") ? line : "- " + line))
        .join("\n")}\n`;
    if (v.beasiswa) prompt += `Info Beasiswa: ${v.beasiswa}\n`;
    if (v.jadwal) prompt += `Jadwal Pendaftaran: ${v.jadwal}\n`;
    if (v.syarat) prompt += `Syarat Pendaftaran: ${v.syarat}\n`;
    if (v.cara) prompt += `Call to Action (Cara Daftar): ${v.cara}\n`;
    if (v.qr)
      prompt += `*Mohon sediakan area/space kosong berbentuk kotak untuk menempelkan QR Code pendaftaran.\n`;
    prompt += `\n`;

    if (v.visualElements.length > 0) {
      prompt += `--- ELEMEN VISUAL TAMBAHAN ---\n`;
      prompt += `Mohon sertakan elemen visual atau ilustrasi berikut ini agar desain lebih menarik:\n`;
      v.visualElements.forEach((el) => {
        prompt += `- ${el}\n`;
      });

      // LOGIKA PENAMBAHAN INFO UPLOAD FOTO
      const hasRealPhoto = v.visualElements.some((el) => el.includes("Foto"));
      if (hasRealPhoto) {
        prompt += `\n*PENTING UNTUK AI: Saya telah mengunggah (upload) foto asli sebagai referensi. Mohon JANGAN membuat wajah/gedung AI generik, melainkan gunakan foto yang saya lampirkan untuk elemen visual tersebut.\n`;
      }
      prompt += `\n`;
    }

    if (v.catatan) {
      prompt += `--- CATATAN TAMBAHAN ---\n`;
      prompt += `${v.catatan}\n\n`;
    }

    prompt += `Pastikan layout desain tersusun rapi, teks informasi mudah dibaca (legible), hierarki visual jelas antara judul dan isi, dan memberikan kesan profesional serta kredibel.`;

    setPromptOutput(prompt);
  };

  useEffect(() => {
    generatePrompt();
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVisualElementChange = (value: string) => {
    setFormData((prev) => {
      const isChecked = prev.visualElements.includes(value);
      if (isChecked) {
        return {
          ...prev,
          visualElements: prev.visualElements.filter((el) => el !== value),
        };
      } else {
        return { ...prev, visualElements: [...prev.visualElements, value] };
      }
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptOutput);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      alert("Gagal menyalin teks. Silakan blok dan copy manual.");
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin mereset semua isian form ke pengaturan awal?",
      )
    ) {
      setFormData(INITIAL_FORM_STATE);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    generatePrompt();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#0F172A] min-h-screen font-sans selection:bg-[#2563EB]/20 selection:text-[#0F172A] pb-24">
      {/* Hero Section */}
      <section className="bg-[#0A0F1D] text-white py-20 lg:py-28 border-b border-[#1E293B] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#2563EB]/15 via-[#06B6D4]/10 to-transparent blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-[#38BDF8] transition-colors mb-4"
          >
            ← Kembali ke Tools Hub
          </Link>
          <div className="block"></div>
          <div className="inline-flex items-center justify-center gap-2 bg-[#2563EB]/10 text-[#38BDF8] px-3.5 py-1.5 rounded-full mb-6 border border-[#2563EB]/25 text-xs font-mono font-medium tracking-wide">
            <GraduationCap size={16} /> Guwigo Education Suite
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal mb-6 leading-tight tracking-tight text-white">
            Generator Prompt Desain <br className="hidden md:block" />{" "}
            <span className="italic text-[#38BDF8]">
              Edukasi & Pendaftaran Kampus
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Hasilkan prompt spesifik untuk AI Image Generator (Midjourney, DALL-E, Imagen) atau Desainer Grafis dalam hitungan detik.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main
        id="generator"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1 */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#E2E8F0]">
              <h2 className="text-lg font-serif font-normal text-[#0F172A] mb-6 border-b border-[#E2E8F0] pb-4 flex items-center gap-3">
                <div className="p-2 bg-[#2563EB]/10 rounded-lg text-[#2563EB]">
                  <Building2 size={20} />
                </div>
                1. Identitas Lembaga
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Nama Sekolah/Univ
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all font-normal text-sm text-[#0F172A]"
                    placeholder="Contoh: Universitas Gemilang"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all font-normal text-sm text-[#0F172A]"
                    placeholder="Contoh: Mencetak Generasi Emas"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Akreditasi
                  </label>
                  <input
                    type="text"
                    name="akreditasi"
                    value={formData.akreditasi}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all font-normal text-sm text-[#0F172A]"
                    placeholder="Contoh: Akreditasi A (Unggul)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Instruksi Logo
                  </label>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all font-normal text-sm text-[#0F172A]"
                    placeholder="Sediakan ruang logo di kiri atas"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all font-normal text-sm text-[#0F172A] resize-none"
                    placeholder="Jl. Pendidikan No.1, Kota Cerdas"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    No WhatsApp & Nama
                  </label>
                  <input
                    type="text"
                    name="wa"
                    value={formData.wa}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all font-normal text-sm text-[#0F172A]"
                    placeholder="0812-3456-7890 (Admin)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Media Sosial
                  </label>
                  <input
                    type="text"
                    name="sosmed"
                    value={formData.sosmed}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all font-normal text-sm text-[#0F172A]"
                    placeholder="IG/Tiktok: @kampusgemilang"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#E2E8F0]">
              <h2 className="text-lg font-serif font-normal text-[#0F172A] mb-6 border-b border-[#E2E8F0] pb-4 flex items-center gap-3">
                <div className="p-2 bg-[#2563EB]/10 rounded-lg text-[#2563EB]">
                  <Target size={20} />
                </div>
                2. Tujuan & Format Desain
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Tujuan Desain
                  </label>
                  <select
                    name="tujuan"
                    value={formData.tujuan}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A] cursor-pointer"
                  >
                    <option value="Pendaftaran siswa baru">
                      Pendaftaran Siswa Baru (PPDB)
                    </option>
                    <option value="Pendaftaran mahasiswa baru">
                      Pendaftaran Mahasiswa Baru (PMB)
                    </option>
                    <option value="Open registration">
                      Open Registration (Umum)
                    </option>
                    <option value="Promosi program unggulan">
                      Promosi Program Unggulan
                    </option>
                    <option value="Promosi Beasiswa">Informasi Beasiswa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Format Desain
                  </label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A] cursor-pointer"
                  >
                    <option value="Poster A4">Poster A4</option>
                    <option value="Brosur lipat tiga (Trifold)">
                      Brosur Lipat Tiga (Trifold)
                    </option>
                    <option value="Banner Vertikal (X-Banner)">
                      Banner Vertikal (X-Banner/Roll-up)
                    </option>
                    <option value="Spanduk Horizontal">
                      Spanduk Horizontal
                    </option>
                    <option value="Feed Instagram (Rasio 1:1)">
                      Feed Instagram (1:1)
                    </option>
                    <option value="Story Instagram (Rasio 9:16)">
                      Story Instagram (9:16)
                    </option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Target Audiens Utama
                  </label>
                  <select
                    name="audiens"
                    value={formData.audiens}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A] cursor-pointer"
                  >
                    <option value="Calon mahasiswa dan orang tua">
                      Calon Mahasiswa & Orang Tua
                    </option>
                    <option value="Siswa TK/PAUD dan orang tua">
                      Siswa TK/PAUD & Orang Tua
                    </option>
                    <option value="Siswa SD/MI dan orang tua">
                      Siswa SD/MI & Orang Tua
                    </option>
                    <option value="Siswa SMP/MTs dan orang tua">
                      Siswa SMP/MTs & Orang Tua
                    </option>
                    <option value="Siswa SMA/SMK dan orang tua">
                      Siswa SMA/SMK & Orang Tua
                    </option>
                    <option value="Masyarakat umum">Masyarakat Umum</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#E2E8F0]">
              <h2 className="text-lg font-serif font-normal text-[#0F172A] mb-6 border-b border-[#E2E8F0] pb-4 flex items-center gap-3">
                <div className="p-2 bg-[#2563EB]/10 rounded-lg text-[#2563EB]">
                  <Palette size={20} />
                </div>
                3. Style Visual
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STYLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.style === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, style: opt.id }))
                      }
                      className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all relative overflow-hidden h-full flex flex-col items-center justify-center gap-2.5 group ${
                        isSelected
                          ? "border-[#2563EB] bg-[#2563EB]/5 shadow-sm"
                          : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Icon
                        size={28}
                        className={
                          isSelected
                            ? "text-[#2563EB]"
                            : "text-slate-400 group-hover:text-[#2563EB] transition-colors"
                        }
                      />
                      <span
                        className={`text-xs font-semibold ${isSelected ? "text-[#2563EB]" : "text-slate-700"}`}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2
                          className="absolute top-2 right-2 text-[#2563EB]"
                          size={15}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
                <label className="block text-xs font-medium text-slate-500 mb-4 uppercase tracking-wide">
                  Warna Dominan Desain
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1.5 block font-medium uppercase tracking-wider">
                      Warna Utama
                    </label>
                    <input
                      type="text"
                      name="warna1"
                      value={formData.warna1}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg font-normal text-sm text-[#0F172A] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1.5 block font-medium uppercase tracking-wider">
                      Warna Latar
                    </label>
                    <input
                      type="text"
                      name="warna2"
                      value={formData.warna2}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg font-normal text-sm text-[#0F172A] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1.5 block font-medium uppercase tracking-wider">
                      Warna Tombol/Aksen
                    </label>
                    <input
                      type="text"
                      name="warna3"
                      value={formData.warna3}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg font-normal text-sm text-[#0F172A] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#E2E8F0]">
              <h2 className="text-lg font-serif font-normal text-[#0F172A] mb-6 border-b border-[#E2E8F0] pb-4 flex items-center gap-3">
                <div className="p-2 bg-[#2563EB]/10 rounded-lg text-[#2563EB]">
                  <ListChecks size={20} />
                </div>
                4. Informasi Konten
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    name="tahun"
                    value={formData.tahun}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A]"
                    placeholder="2027/2028"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Prodi / Jurusan
                  </label>
                  <input
                    type="text"
                    name="prodi"
                    value={formData.prodi}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A]"
                    placeholder="Sistem Informasi, Manajemen..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Keunggulan Lembaga (Point-point)
                  </label>
                  <textarea
                    name="keunggulan"
                    value={formData.keunggulan}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A] resize-none"
                    placeholder="- Lulusan siap kerja&#10;- Kurikulum Internasional"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Fasilitas Utama
                  </label>
                  <textarea
                    name="fasilitas"
                    value={formData.fasilitas}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A] resize-none"
                    placeholder="- Lab Komputer Modern&#10;- Perpustakaan Digital"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Info Beasiswa
                  </label>
                  <input
                    type="text"
                    name="beasiswa"
                    value={formData.beasiswa}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A]"
                    placeholder="Beasiswa s/d 100%"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Jadwal Gelombang
                  </label>
                  <input
                    type="text"
                    name="jadwal"
                    value={formData.jadwal}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A]"
                    placeholder="Gel 1: Jan-Maret, Gel 2: April-Juni"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Syarat Singkat
                  </label>
                  <input
                    type="text"
                    name="syarat"
                    value={formData.syarat}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A]"
                    placeholder="FC Ijazah, Pas Foto 3x4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Call to Action (CTA)
                  </label>
                  <input
                    type="text"
                    name="cara"
                    value={formData.cara}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A]"
                    placeholder="Daftar di www.kampus.ac.id"
                  />
                </div>
                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer p-3.5 bg-slate-50/60 border border-[#E2E8F0] rounded-lg hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      name="qr"
                      checked={formData.qr}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      Sertakan area khusus untuk menempelkan QR Code Pendaftaran
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#E2E8F0]">
              <h2 className="text-lg font-serif font-normal text-[#0F172A] mb-6 border-b border-[#E2E8F0] pb-4 flex items-center gap-3">
                <div className="p-2 bg-[#2563EB]/10 rounded-lg text-[#2563EB]">
                  <Shapes size={20} />
                </div>
                5. Elemen Visual Tambahan
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {VISUAL_ELEMENTS_OPTIONS.map((opt, idx) => {
                  const isChecked = formData.visualElements.includes(opt.value);
                  return (
                    <label
                      key={idx}
                      className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${isChecked ? "border-[#2563EB] bg-[#2563EB]/5" : "border-[#E2E8F0] hover:border-slate-300 bg-white"}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleVisualElementChange(opt.value)}
                        className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB] border-slate-300 rounded"
                      />
                      <span
                        className={`text-xs font-medium ${isChecked ? "text-[#2563EB]" : "text-slate-700"}`}
                      >
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* INFO BOX: Upload Foto Asli */}
              <div className="mb-6 p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-3">
                <Info size={18} className="text-[#2563EB] shrink-0 mt-0.5" />
                <p className="text-xs font-normal text-blue-900 leading-relaxed">
                  <strong className="font-semibold">Tips Penggunaan AI:</strong>{" "}
                  Jika Anda memilih elemen berupa foto asli (misal: Foto Siswa/i
                  atau Gedung Kampus), pastikan Anda{" "}
                  <strong>mengupload file foto tersebut</strong> ke ChatGPT atau
                  AI Generator yang Anda gunakan agar hasil gambar sesuai dengan
                  aslinya.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                  Catatan Instruksi Khusus
                </label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-normal text-sm text-[#0F172A] resize-none"
                  placeholder="Contoh: Buat desain terkesan islami modern, pastikan teks promo dibuat sangat besar..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PREVIEW & ACTION */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-24 rounded-xl shadow-xl border border-[#1E293B] overflow-hidden flex flex-col h-[calc(100vh-8rem)] min-h-[600px] bg-[#0A0F1D]">
              {/* Output Header */}
              <div className="bg-[#0F172A] px-5 py-4 border-b border-[#1E293B] flex justify-between items-center z-10">
                <h3 className="text-sm font-mono text-white flex items-center gap-2.5">
                  <Terminal className="text-[#38BDF8]" size={18} /> AI Prompt
                  Result
                </h3>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2563EB]"></span>
                </span>
              </div>

              {/* Output Body */}
              <div className="flex-grow p-5 overflow-y-auto custom-scrollbar bg-[#0A0F1D] relative">
                <div className="flex items-center gap-2 text-[11px] text-[#38BDF8] bg-[#2563EB]/10 px-3 py-2 rounded-lg font-mono mb-4 border border-[#2563EB]/20">
                  <Info size={14} /> Terupdate otomatis secara real-time.
                </div>
                <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono leading-relaxed break-words">
                  {promptOutput}
                </pre>
              </div>

              {/* Output Footer & Actions */}
              <div className="bg-[#0F172A] p-4 border-t border-[#1E293B] space-y-3">
                <button
                  onClick={handleCopy}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 px-4 rounded-lg transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg text-xs uppercase tracking-wider"
                >
                  <Copy size={16} /> COPY FULL PROMPT
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleRefresh}
                    className="bg-[#1E293B] hover:bg-[#334155] text-slate-200 font-medium py-2.5 px-3 rounded-lg transition-colors flex justify-center items-center gap-2 text-xs font-mono uppercase tracking-wider border border-[#334155]"
                  >
                    <RefreshCcw
                      size={13}
                      className={isRefreshing ? "animate-spin" : ""}
                    />{" "}
                    Refresh
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 font-medium py-2.5 px-3 rounded-lg transition-colors flex justify-center items-center gap-2 text-xs font-mono uppercase tracking-wider"
                  >
                    <Trash2 size={13} /> Reset Form
                  </button>
                </div>
              </div>

              {/* PREMIUM SUPPORT / DONATION PANEL */}
              <div className="bg-[#0F172A] p-4 border-t border-[#1E293B]">
                <div className="text-center mb-3">
                  <h4 className="text-white font-medium mb-1 flex justify-center items-center gap-1.5 text-xs font-mono">
                    <Heart
                      className="text-pink-500 fill-pink-500 animate-pulse"
                      size={14}
                    />{" "}
                    Support The Creator
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed px-2 font-normal">
                    Tools ini 100% gratis. Jika ini menghemat waktu kerja Anda,
                    silakan traktir kami kopi! ☕
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <a
                    href="https://cebanmatters.com/donation/teguhsiteg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[11px] font-mono py-2 px-2.5 rounded-lg flex items-center justify-center transition-all"
                  >
                    CebanMatters
                  </a>
                  <a
                    href="https://sociabuzz.com/teguhsiteg35/tribe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[11px] font-mono py-2 px-2.5 rounded-lg flex items-center justify-center transition-all"
                  >
                    SociaBuzz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#0F172A] text-white px-5 py-3 rounded-xl border border-[#1E293B] shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 font-medium text-xs font-mono">
          <CheckCircle2 size={18} className="text-[#38BDF8]" />
          Prompt berhasil disalin ke clipboard!
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `,
        }}
      />
    </div>
  );
}
