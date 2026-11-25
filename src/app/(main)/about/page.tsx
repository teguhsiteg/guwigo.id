"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Quote,
  Code,
  PenTool,
  Building2,
  Network,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A] overflow-x-hidden">
      {/* ========================================= */}
      {/* 1. HERO: THE VISION                       */}
      {/* ========================================= */}
      <section className="container mx-auto px-4 sm:px-6 mb-24 lg:mb-32 text-center max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Favicon Icon */}
          <div className="w-14 h-14 mx-auto mb-8 bg-[#0A0F1D] rounded-lg flex items-center justify-center shadow-md border border-[#1E293B]">
            <div className="relative w-7 h-7">
              <Image
                src="/images/branding/loader.png"
                alt="Guwigo Icon"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <span className="text-[#2563EB] font-medium tracking-[0.2em] text-xs uppercase mb-3 block">
            Jejak Langkah Guwigo
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0F172A] mb-6 tracking-tight leading-[1.15] font-normal">
            Berakar di Yogyakarta, <br />
            <span className="italic text-[#2563EB]">
              Membangun Ekosistem Digital.
            </span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] leading-relaxed font-normal max-w-2xl mx-auto mb-10">
            Berawal pada tahun 2015 sebagai entitas kreatif pendukung digitalisasi UMKM
            lokal, kini bertransformasi menjadi PT Guwigo Teknologi
            Indonesia—arsitek perangkat lunak dan solusi sistem skala
            enterprise.
          </p>

          <Link
            href="/rebranding"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2563EB] text-white px-7 py-3.5 font-medium text-xs uppercase tracking-wider hover:bg-[#1D4ED8] transition-all duration-150 shadow-sm shadow-blue-500/20 group"
          >
            Arah Baru Rebranding 2026
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </section>

      {/* ========================================= */}
      {/* 2. NAME ORIGIN & PHILOSOPHY               */}
      {/* ========================================= */}
      <section className="container mx-auto px-4 sm:px-6 mb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-lg p-8 md:p-14 lg:p-16 border border-[#E2E8F0] shadow-sm relative overflow-hidden max-w-5xl mx-auto text-center"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/[0.05] rounded-md blur-[80px] -z-10 pointer-events-none"></div>

          <div className="space-y-8">
            <div>
              <Quote
                size={40}
                className="text-[#E2E8F0] fill-[#FAF9F6] mb-5 mx-auto"
              />
              <h2 className="text-2xl md:text-3xl font-serif font-normal text-[#0F172A] mb-3 tracking-tight leading-snug">
                "Nama adalah visi, dan Guwigo adalah dedikasi."
              </h2>
              <p className="text-[#94A3B8] font-medium uppercase tracking-[0.2em] text-[11px]">
                Teguh Dwi Prayogo — CEO & Founder
              </p>
            </div>

            <div className="h-px w-20 bg-[#E2E8F0] mx-auto"></div>

            <div className="space-y-6 text-[#64748B] font-normal leading-relaxed max-w-3xl mx-auto text-base">
              <p>
                Identitas <strong>GUWIGO</strong> lahir dari penggalan nama
                pendirinya. Sebuah pengingat personal bahwa perusahaan ini
                dibangun dengan tanggung jawab dan integritas penuh:
              </p>

              <div className="bg-[#FAF9F6] p-6 md:p-8 rounded-md border border-[#E2E8F0] inline-block w-full">
                <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#64748B] tracking-[0.15em]">
                  <span className="text-[#2563EB] font-semibold">teGU</span>h{" "}
                  <span className="text-[#2563EB] font-semibold">dWI</span> prayo
                  <span className="text-[#2563EB] font-semibold">GO</span>
                </p>
              </div>

              <p>
                Berakar kuat di Kabupaten Sleman, Daerah Istimewa Yogyakarta.
                Kami memegang filosofi
                <span className="italic text-[#0F172A] font-medium">
                  {" "}
                  "Yogyakarta Rooted, Indonesia and Beyond"
                </span>
                . Tumbuh dari melayani akar rumput, hingga kini dipercaya
                merancang arsitektur sistem bagi entitas korporat dan institusi nasional.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================= */}
      {/* 3. THE "ENGINEER" SPIRIT                  */}
      {/* ========================================= */}
      <section className="container mx-auto px-4 sm:px-6 mb-32 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
          {/* Visual Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full relative group"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg border border-[#1E293B] bg-[#0A0F1D]">
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <div className="flex gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60"></div>
                </div>
                <div className="space-y-3 font-mono text-[11px] md:text-xs text-[#E2E8F0]/80">
                  <p>
                    <span className="text-[#60A5FA]">import</span> &#123; Vision
                    &#125; <span className="text-[#60A5FA]">from</span>{" "}
                    '@guwigo/core';
                  </p>
                  <p>
                    <span className="text-[#60A5FA]">const</span>{" "}
                    <span className="text-[#38BDF8]">architect</span> ={" "}
                    <span className="text-[#60A5FA]">new</span> Vision();
                  </p>
                  <p className="mt-4 text-[#64748B]">
                    // Crafting thoughtful, resilient architecture
                  </p>
                  <p>
                    <span className="text-[#38BDF8]">architect</span>
                    .deploy(&#123;
                  </p>
                  <p className="pl-4">
                    scale: <span className="text-[#A5F3FC]">'Enterprise'</span>,
                  </p>
                  <p className="pl-4">
                    craft: <span className="text-[#A5F3FC]">'Human-Centric'</span>,
                  </p>
                  <p className="pl-4">
                    impact: <span className="text-[#A5F3FC]">'National'</span>
                  </p>
                  <p>&#125;);</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-5 -left-4 md:-left-8 bg-white p-5 rounded-md shadow-md border border-[#E2E8F0] flex items-center gap-4 z-20">
              <div className="bg-[#EFF6FF] p-2.5 rounded-lg text-[#2563EB]">
                <Code size={22} />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-0.5">
                  Fokus Utama
                </p>
                <p className="font-serif text-[#0F172A] text-sm md:text-base font-normal">
                  Arsitektur Sistem & Rekayasa
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex-1 space-y-6 lg:pr-8"
          >
            <h3 className="text-3xl md:text-4xl font-serif text-[#0F172A] font-normal tracking-tight leading-[1.15]">
              Harmoni antara Estetika dan Ketelitian Rekayasa.
            </h3>
            <p className="text-[#64748B] font-normal leading-relaxed text-base">
              Evolusi Guwigo adalah cerminan dari dedikasi berkesinambungan. Mengawali
              langkah dengan kepekaan desain antarmuka, kami kemudian memadukannya
              dengan arsitektur rekayasa perangkat lunak tingkat korporat.
            </p>
            <p className="text-[#64748B] font-normal leading-relaxed text-base">
              Inilah pembeda utama ekosistem Guwigo: setiap baris kode dibangun dengan
              struktur <em>backend</em> yang tangguh, sekaligus disempurnakan dengan
              pengalaman visual yang tenang, jernih, dan berpusat pada manusia.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-6 rounded-md border border-[#E2E8F0] shadow-sm">
                <PenTool size={22} className="text-[#2563EB] mb-3" />
                <h4 className="font-serif text-[#0F172A] text-base mb-1 font-normal">
                  Creative Roots
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Desain Antarmuka & Identitas Visual
                </p>
              </div>
              <div className="bg-white p-6 rounded-md border border-[#E2E8F0] shadow-sm">
                <Network size={22} className="text-[#2563EB] mb-3" />
                <h4 className="font-serif text-[#0F172A] text-base mb-1 font-normal">
                  Sistem Enterprise
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  SaaS, Cloud & Keamanan Sistem
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 4. TIMELINE                               */}
      {/* ========================================= */}
      <section className="container mx-auto px-4 sm:px-6 max-w-4xl pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[#2563EB] font-medium tracking-[0.2em] text-xs uppercase mb-2 block">
            Evolusi Guwigo
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] font-normal tracking-tight">
            Tonggak Sejarah Perjalanan
          </h2>
        </motion.div>

        <div className="space-y-0 relative">
          {/* Garis Vertikal Timeline */}
          <div className="absolute left-[23px] md:left-1/2 md:-ml-px top-0 bottom-0 w-0.5 bg-[#E2E8F0]"></div>

          {/* Timeline Item 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between group py-8"
          >
            <div className="md:w-1/2 md:text-right md:pr-12 pl-16 md:pl-0">
              <h4 className="text-xl font-serif font-normal text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                The Origin
              </h4>
              <p className="text-[#64748B] text-sm font-normal mt-2 leading-relaxed">
                Berdiri di Kabupaten Sleman. Berfokus pada perancangan identitas
                visual dan media promosi untuk mendukung digitalisasi UMKM lokal.
              </p>
            </div>
            <div className="absolute left-6 md:left-1/2 -ml-[5px] md:-ml-[5px] w-3 h-3 rounded-full bg-[#E2E8F0] border-2 border-white group-hover:bg-[#2563EB] transition-colors z-10 mt-1.5 md:mt-0 shadow-sm"></div>

            <div className="md:w-1/2 md:pl-12 pl-16 mt-2 md:mt-0 hidden md:block">
              <span className="text-3xl font-serif text-[#94A3B8] group-hover:text-[#0F172A] transition-colors">
                2015
              </span>
            </div>
          </motion.div>

          {/* Timeline Item 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between group py-8"
          >
            <div className="md:w-1/2 md:text-right md:pr-12 pl-16 md:pl-0 hidden md:block">
              <span className="text-3xl font-serif text-[#94A3B8] group-hover:text-[#0F172A] transition-colors">
                2018 - 2022
              </span>
            </div>

            <div className="absolute left-6 md:left-1/2 -ml-[5px] md:-ml-[5px] w-3 h-3 rounded-full bg-[#E2E8F0] border-2 border-white group-hover:bg-[#2563EB] transition-colors z-10 mt-1.5 md:mt-0 shadow-sm"></div>

            <div className="md:w-1/2 md:pl-12 pl-16">
              <h4 className="text-xl font-serif font-normal text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                Diversifikasi & Ekspansi
              </h4>
              <p className="text-[#64748B] text-sm font-normal mt-2 leading-relaxed">
                Ekspansi strategis ke perbaikan perangkat keras presisi, solusi POS kustom,
                dan digitalisasi sistem terintegrasi.
              </p>
            </div>
          </motion.div>

          {/* Timeline Item 3 (Current) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between group py-8"
          >
            <div className="md:w-1/2 md:text-right md:pr-12 pl-16 md:pl-0">
              <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] px-3.5 py-1 rounded-md text-[10px] font-medium tracking-wider mb-3">
                <Building2 size={12} className="text-[#2563EB]" /> Era Korporasi
              </div>
              <h4 className="text-xl font-serif font-normal text-[#0F172A]">
                PT Guwigo Teknologi Indonesia
              </h4>
              <p className="text-[#64748B] text-sm font-normal mt-2 leading-relaxed">
                Pengukuhan badan hukum resmi. Menjadi arsitek perangkat lunak, penyedia SaaS
                enterprise terpadu, dan mitra transformasi digital kampus serta pemerintah daerah.
              </p>
            </div>

            <div className="absolute left-6 md:left-1/2 -ml-2.5 md:-ml-2.5 w-5 h-5 rounded-md bg-[#0A0F1D] border-4 border-white shadow-md z-10 mt-1 md:mt-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full"></div>
            </div>

            <div className="md:w-1/2 md:pl-12 pl-16 mt-2 md:mt-0 hidden md:block">
              <span className="text-3xl font-serif text-[#0F172A]">
                Present
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
