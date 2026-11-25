"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage(); // Pakai Bahasa

  // STATE FORMULIR
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // LOGIC KIRIM KE WHATSAPP
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman

    const { name, email, subject, message } = formData;

    // Validasi sederhana
    if (!name || !message) {
      alert("Mohon isi Nama dan Pesan Anda.");
      return;
    }

    // Format Pesan WA
    let waMsg = `*Halo Admin Guwigo!* 👋%0A`;
    waMsg += `Saya ingin bertanya/konsultasi.%0A%0A`;
    waMsg += `*Nama:* ${name}%0A`;
    waMsg += `*Email:* ${email || "-"}%0A`;
    waMsg += `*Subjek:* ${subject || "Pertanyaan Umum"}%0A`;
    waMsg += `---------------------------%0A`;
    waMsg += `*Pesan:*%0A${message}`;

    // Kirim (Ganti nomor sesuai nomor Anda)
    window.open(`https://wa.me/6285179594146?text=${waMsg}`, "_blank");
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION (EDITORIAL BRAND THEME)
      ========================================== */}
      <section className="pt-36 md:pt-44 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center border-b border-[#E2E8F0]">
        {/* Subtle Ambient Blue Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#2563EB]/[0.05] rounded-md blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-medium text-[#1D4ED8] mb-6 shadow-sm">
            <MessageSquare size={13} className="text-[#2563EB]" /> Hubungi Tim Kami
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0F172A] mb-5 tracking-tight leading-[1.15] font-normal">
            Mari Berdiskusi{" "}
            <span className="italic text-[#2563EB]">
              Proyek Anda.
            </span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Punya visi teknologi untuk organisasi Anda? Atau butuh perancangan arsitektur
            perangkat lunak yang handal? Tim engineer kami siap mendengarkan dan merancang solusi terbaik.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. CONTACT CONTENT (SPLIT LAYOUT)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 py-16 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* PANEL KIRI: INFO & MAPS */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="bg-white p-7 md:p-9 rounded-lg border border-[#E2E8F0] shadow-sm">
              <h3 className="text-lg font-serif font-normal text-[#0F172A] mb-6 tracking-tight flex items-center gap-3">
                Informasi Kantor & Kontak
              </h3>

              <div className="space-y-6">
                {/* Headquarters */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md flex items-center justify-center text-[#2563EB] shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif text-[#0F172A] text-base font-normal mb-0.5">
                      Kantor Operasional
                    </h4>
                    <p className="text-[#64748B] text-sm font-normal leading-relaxed">
                      Sardonoharjo, Sleman, Daerah Istimewa Yogyakarta 55581
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md flex items-center justify-center text-[#2563EB] shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif text-[#0F172A] text-base font-normal mb-0.5">Surel Resmi</h4>
                    <a
                      href="mailto:hello@guwigo.id"
                      className="block text-[#64748B] text-sm hover:text-[#2563EB] transition-colors mb-0.5"
                    >
                      hello@guwigo.com
                    </a>
                    <a
                      href="mailto:partners@guwigo.id"
                      className="block text-[#64748B] text-sm hover:text-[#2563EB] transition-colors"
                    >
                      partners@guwigo.com
                    </a>
                  </div>
                </div>

                {/* Phone / WA */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md flex items-center justify-center text-[#2563EB] shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif text-[#0F172A] text-base font-normal mb-0.5">
                      Konsultasi WhatsApp
                    </h4>
                    <a
                      href="https://wa.me/6285179594146"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#64748B] text-sm hover:text-[#2563EB] transition-colors"
                    >
                      +62 851-7959-4146
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed Card */}
            <div className="h-56 bg-slate-200 rounded-lg overflow-hidden relative shadow-sm border border-[#E2E8F0] group">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=400"
                alt="Lokasi Guwigo"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-[#0A0F1D]/40 flex flex-col items-center justify-center transition-opacity group-hover:bg-[#0A0F1D]/25">
                <a
                  href="https://maps.google.com/?q=Sardonoharjo+Sleman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] text-[#0F172A] px-6 py-2.5 rounded-md font-medium text-xs tracking-wider hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all shadow-md flex items-center gap-2"
                >
                  <MapPin size={14} /> Buka Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* PANEL KANAN: FORM (MIDNIGHT NAVY CONTAINER) */}
          <div className="w-full lg:w-7/12 bg-[#0A0F1D] text-white p-7 md:p-10 rounded-lg shadow-xl border border-[#1E293B] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/[0.12] blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 mb-8">
              <h3 className="text-2xl font-serif font-normal text-white mb-2 tracking-tight">
                Kirim Pesan Konsultasi
              </h3>
              <p className="text-[#94A3B8] text-sm font-normal">
                Pesan Anda akan langsung terhubung ke saluran WhatsApp representatif kami.
              </p>
            </div>

            <form
              onSubmit={handleSendMessage}
              className="space-y-5 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nama */}
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider ml-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#131C31] border border-[#1E293B] rounded-md px-4 py-3 text-sm font-normal text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider ml-1">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#131C31] border border-[#1E293B] rounded-md px-4 py-3 text-sm font-normal text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                    placeholder="nama@perusahaan.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Subjek (Kategori) */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider ml-1">
                  Subjek Konsultasi
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#131C31] border border-[#1E293B] rounded-md px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all appearance-none cursor-pointer"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.2em 1.2em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="" className="bg-[#0A0F1D] text-[#94A3B8]">
                      Pilih Topik Diskusi...
                    </option>
                    <option
                      value="Pembuatan Website"
                      className="bg-[#0A0F1D] text-white"
                    >
                      Jasa Pembuatan Website / Portal
                    </option>
                    <option
                      value="Aplikasi Custom"
                      className="bg-[#0A0F1D] text-white"
                    >
                      Sistem Aplikasi Custom / SaaS Enterprise
                    </option>
                    <option
                      value="Digital Marketing"
                      className="bg-[#0A0F1D] text-white"
                    >
                      Layanan Transformasi Digital & POS
                    </option>
                    <option
                      value="Kerjasama"
                      className="bg-[#0A0F1D] text-white"
                    >
                      Kerjasama / B2B Partnership
                    </option>
                    <option value="Lainnya" className="bg-[#0A0F1D] text-white">
                      Topik Lainnya
                    </option>
                  </select>
                </div>
              </div>

              {/* Pesan */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider ml-1">
                  Pesan Anda *
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-[#131C31] border border-[#1E293B] rounded-md px-4 py-3 text-sm font-normal text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all resize-none"
                  placeholder="Ceritakan detail visi atau kebutuhan arsitektur digital Anda di sini..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3.5 rounded-md text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-sm"
                >
                  <Send
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                  Kirim via WhatsApp
                </button>
                <p className="text-center text-[10px] text-[#94A3B8] font-normal mt-3.5 flex justify-center items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#06B6D4]" /> Privasi
                  dan data kebutuhan organisasi Anda terjamin aman.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
