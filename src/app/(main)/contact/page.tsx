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
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324] overflow-x-hidden">
      {/* ==========================================
          1. HERO SECTION EKSKLUSIF (DARK PREMIUM THEME)
      ========================================== */}
      <section className="bg-[#0B1324] pt-40 pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Background Visual Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00D4FF]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black text-[#00D4FF] uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <MessageSquare size={12} /> Connect with Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-blue-500">
              Touch.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Punya ide liar untuk bisnis Anda? Atau butuh solusi arsitektur
            teknis yang kokoh? Tim engineer kami siap mendengarkan dan
            mewujudkannya menjadi mahakarya digital.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. CONTACT CONTENT (SPLIT LAYOUT)
      ========================================== */}
      <section className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* PANEL KIRI: INFO & MAPS (LIGHT/CARD MODE) */}
          <div className="w-full lg:w-5/12 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-900/5">
              <h3 className="text-xl font-black text-[#0B1324] mb-8 tracking-tight flex items-center gap-3">
                Contact Information
              </h3>

              <div className="space-y-8">
                {/* Headquarters */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-[#0B1324] shrink-0 group-hover:bg-[#00D4FF] group-hover:border-[#00D4FF] transition-colors shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">
                      Headquarters
                    </h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      Daerah Istimewa Yogyakarta, Indonesia
                      <br />
                      55581
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-[#0B1324] shrink-0 group-hover:bg-[#00D4FF] group-hover:border-[#00D4FF] transition-colors shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">Email Us</h4>
                    <a
                      href="mailto:hello@guwigo.id"
                      className="block text-slate-500 text-sm font-medium hover:text-[#00D4FF] transition-colors mb-0.5"
                    >
                      hello@guwigo.com
                    </a>
                    <a
                      href="mailto:partners@guwigo.id"
                      className="block text-slate-500 text-sm font-medium hover:text-[#00D4FF] transition-colors"
                    >
                      partners@guwigo.com
                    </a>
                  </div>
                </div>

                {/* Phone / WA */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-[#0B1324] shrink-0 group-hover:bg-emerald-400 group-hover:border-emerald-400 group-hover:text-[#0B1324] transition-colors shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">
                      Call / WhatsApp
                    </h4>
                    <a
                      href="https://wa.me/6285179594146"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-slate-500 text-sm font-medium hover:text-emerald-500 transition-colors"
                    >
                      +62 851-7959-4146
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed (Menggunakan Image Placeholder dengan gaya Premium) */}
            <div className="h-64 bg-slate-200 rounded-[2.5rem] overflow-hidden relative shadow-lg group">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=400"
                alt="Map Location"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-[#0B1324]/40 flex flex-col items-center justify-center transition-opacity group-hover:bg-[#0B1324]/20">
                <a
                  href="https://maps.google.com/?q=Sardonoharjo+Sleman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-[#00D4FF] hover:border-[#00D4FF] hover:text-[#0B1324] transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)] flex items-center gap-2"
                >
                  <MapPin size={16} /> Buka Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* PANEL KANAN: FORM (DARK MODE FORM) */}
          <div className="w-full lg:w-7/12 bg-[#0B1324] p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-slate-800 flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 relative overflow-hidden">
            {/* Glow Accent inside form */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                Send a Message
              </h3>
              <p className="text-slate-400 text-sm font-medium">
                Pesan Anda akan langsung masuk ke WhatsApp representatif kami.
              </p>
            </div>

            <form
              onSubmit={handleSendMessage}
              className="space-y-6 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all shadow-inner"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all shadow-inner"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Subjek (Kategori) */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Subjek Konsultasi
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all shadow-inner appearance-none cursor-pointer"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "3rem",
                    }}
                  >
                    <option value="" className="bg-[#0B1324] text-slate-300">
                      Pilih Topik Diskusi...
                    </option>
                    <option
                      value="Pembuatan Website"
                      className="bg-[#0B1324] text-white"
                    >
                      Jasa Pembuatan Website
                    </option>
                    <option
                      value="Aplikasi Custom"
                      className="bg-[#0B1324] text-white"
                    >
                      Sistem Aplikasi Custom / ERP
                    </option>
                    <option
                      value="Digital Marketing"
                      className="bg-[#0B1324] text-white"
                    >
                      Layanan Digital Marketing
                    </option>
                    <option
                      value="Kerjasama"
                      className="bg-[#0B1324] text-white"
                    >
                      Kerjasama / B2B Partnership
                    </option>
                    <option value="Lainnya" className="bg-[#0B1324] text-white">
                      Topik Lainnya
                    </option>
                  </select>
                </div>
              </div>

              {/* Pesan */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Pesan Anda *
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/30 focus:border-[#00D4FF]/50 transition-all resize-none shadow-inner"
                  placeholder="Ceritakan detail visi atau kebutuhan arsitektur digital Anda di sini..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#00D4FF] hover:bg-white text-[#0B1324] font-black py-4 md:py-5 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <Send
                    size={16}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                  Kirim via WhatsApp
                </button>
                <p className="text-center text-[10px] text-slate-500 font-medium mt-4 flex justify-center items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-500" /> Privasi
                  dan data perusahaan Anda terjamin aman.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
