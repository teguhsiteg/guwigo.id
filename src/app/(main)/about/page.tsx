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
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 font-sans selection:bg-[#00D4FF]/30 selection:text-[#0B1324] overflow-x-hidden">
      {/* ========================================= */}
      {/* 1. HERO: THE VISION                       */}
      {/* ========================================= */}
      <section className="container mx-auto px-4 sm:px-6 mb-24 lg:mb-32 text-center max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Favicon Icon */}
          <div className="w-16 h-16 mx-auto mb-8 bg-[#0B1324] rounded-2xl flex items-center justify-center shadow-xl shadow-[#0B1324]/20 border border-slate-200">
            <div className="relative w-8 h-8">
              <Image
                src="/images/branding/loader.png" // Menggunakan logo monogram
                alt="Guwigo Icon"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <span className="text-[#00D4FF] font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">
            The Journey of Guwigo
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0B1324] mb-8 tracking-tight leading-[1.1]">
            Berakar di Yogyakarta, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-[#00D4FF]">
              Membangun Ekosistem Digital.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto mb-10">
            Berawal pada tahun 2015 sebagai entitas kreatif pendukung UMKM
            lokal, kini bertransformasi menjadi PT Guwigo Teknologi
            Indonesia—arsitek perangkat lunak dan solusi digital skala
            enterprise.
          </p>

          <Link
            href="/rebranding"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0B1324] text-white px-8 py-4 font-black text-xs uppercase tracking-widest hover:bg-[#00D4FF] hover:text-[#0B1324] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300 group"
          >
            Arah Baru Rebranding 2026
            <ArrowRight
              size={16}
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 lg:p-20 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden max-w-5xl mx-auto text-center"
        >
          {/* Subtle Accent Backgrounds */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

          <div className="space-y-10">
            <div>
              <Quote
                size={48}
                className="text-slate-100 fill-slate-50 mb-6 mx-auto"
              />
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight leading-snug">
                "Nama adalah visi, dan Guwigo adalah dedikasi."
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                Teguh Dwi Prayogo — CEO & Founder
              </p>
            </div>

            <div className="h-px w-24 bg-slate-200 mx-auto"></div>

            <div className="space-y-6 text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto text-base">
              <p>
                Identitas <strong>GUWIGO</strong> lahir dari penggalan nama
                pendirinya. Sebuah pengingat personal bahwa perusahaan ini
                dibangun dengan tanggung jawab dan integritas penuh:
              </p>

              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 inline-block w-full shadow-inner">
                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-300 tracking-[0.2em]">
                  <span className="text-[#0B1324]">teGU</span>h{" "}
                  <span className="text-[#0B1324]">dWI</span> prayo
                  <span className="text-[#0B1324]">GO</span>
                </p>
              </div>

              <p>
                Berakar kuat di Kabupaten Sleman, Daerah Istimewa Yogyakarta.
                Kami memegang filosofi
                <span className="italic text-slate-800 font-bold">
                  {" "}
                  "Yogyakarta Rooted, Indonesia and Beyond"
                </span>
                . Tumbuh dari melayani akar rumput, hingga kini dipercaya
                merancang arsitektur sistem bagi entitas korporat nasional.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================= */}
      {/* 3. THE "ENGINEER" SPIRIT                  */}
      {/* ========================================= */}
      <section className="container mx-auto px-4 sm:px-6 mb-32 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          {/* Visual Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full relative group"
          >
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 bg-[#0B1324]">
              {/* Abstrak Coding Visual */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 to-[#0B1324]"></div>

              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="space-y-3 font-mono text-[10px] md:text-xs text-[#00D4FF]/60 opacity-80">
                  <p>
                    <span className="text-pink-400">import</span> &#123; Vision
                    &#125; <span className="text-pink-400">from</span>{" "}
                    '@guwigo/core';
                  </p>
                  <p>
                    <span className="text-pink-400">const</span>{" "}
                    <span className="text-blue-300">architect</span> ={" "}
                    <span className="text-pink-400">new</span> Vision();
                  </p>
                  <p className="mt-4">
                    <span className="text-slate-500">
                      // Building scalable solutions
                    </span>
                  </p>
                  <p>
                    <span className="text-blue-300">architect</span>
                    .deploy(&#123;
                  </p>
                  <p className="pl-4">
                    scale: <span className="text-orange-300">'Enterprise'</span>
                    ,
                  </p>
                  <p className="pl-4">
                    impact: <span className="text-orange-300">'National'</span>
                  </p>
                  <p>&#125;);</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 flex items-center gap-4 z-20">
              <div className="bg-[#00D4FF]/10 p-3 rounded-2xl">
                <Code size={24} className="text-[#00D4FF]" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Core Expertise
                </p>
                <p className="font-black text-[#0B1324] text-sm md:text-base">
                  System Architecture
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6 lg:pr-10"
          >
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Keseimbangan antara Estetika dan Rekayasa.
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed text-base">
              Evolusi Guwigo adalah bukti nyata kemampuan beradaptasi. Mengawali
              langkah dengan menguasai aspek visual, kami kemudian memadukannya
              dengan rekayasa perangkat lunak tingkat tinggi.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed text-base">
              Inilah nilai pembeda ekosistem layanan kami. Sistem yang kami
              bangun kokoh secara logika <em>backend</em>, sekaligus intuitif
              dan ramah pengguna melalui antarmuka <em>UI/UX</em> yang berpusat
              pada manusia.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <PenTool size={24} className="text-[#0B1324] mb-4" />
                <h4 className="font-black text-slate-900 text-sm mb-1.5">
                  Creative Origin
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Visual Branding & Interface Design
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <Network size={24} className="text-[#00D4FF] mb-4" />
                <h4 className="font-black text-slate-900 text-sm mb-1.5">
                  Tech Ecosystem
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  SaaS & Enterprise Architecture
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[#00D4FF] font-black tracking-[0.2em] text-[10px] uppercase mb-3 block">
            Evolution of Guwigo
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0B1324] tracking-tight">
            Historical Milestones
          </h2>
        </motion.div>

        <div className="space-y-0 relative">
          {/* Garis Vertikal Timeline */}
          <div className="absolute left-[23px] md:left-1/2 md:-ml-px top-0 bottom-0 w-0.5 bg-slate-200/60"></div>

          {/* Timeline Item 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between group py-8"
          >
            <div className="md:w-1/2 md:text-right md:pr-12 pl-16 md:pl-0">
              <h4 className="text-xl font-black text-slate-900 group-hover:text-[#00D4FF] transition-colors">
                The Origin
              </h4>
              <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                Berdiri di Sleman. Fokus layanan pada perancangan identitas
                visual dan media promosi untuk mendukung digitalisasi UMKM
                lokal.
              </p>
            </div>
            {/* Titik Tengah */}
            <div className="absolute left-6 md:left-1/2 -ml-[5px] md:-ml-[5px] w-3 h-3 rounded-full bg-slate-200 border-2 border-white group-hover:bg-[#00D4FF] transition-colors z-10 mt-1.5 md:mt-0 shadow-sm"></div>

            <div className="md:w-1/2 md:pl-12 pl-16 mt-2 md:mt-0 hidden md:block">
              <span className="text-4xl font-black text-slate-200 group-hover:text-slate-900 transition-colors">
                2015
              </span>
            </div>
          </motion.div>

          {/* Timeline Item 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between group py-8"
          >
            <div className="md:w-1/2 md:text-right md:pr-12 pl-16 md:pl-0 hidden md:block">
              <span className="text-4xl font-black text-slate-200 group-hover:text-slate-900 transition-colors">
                2018 - 2022
              </span>
            </div>

            {/* Titik Tengah */}
            <div className="absolute left-6 md:left-1/2 -ml-[5px] md:-ml-[5px] w-3 h-3 rounded-full bg-slate-200 border-2 border-white group-hover:bg-[#00D4FF] transition-colors z-10 mt-1.5 md:mt-0 shadow-sm"></div>

            <div className="md:w-1/2 md:pl-12 pl-16">
              <h4 className="text-xl font-black text-slate-900 group-hover:text-[#00D4FF] transition-colors">
                Business Diversification
              </h4>
              <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                Ekspansi strategis ke berbagai sektor esensial, mulai dari
                digitalisasi layanan pribadi, retail perangkat keras, hingga
                produksi kreatif.
              </p>
            </div>
          </motion.div>

          {/* Timeline Item 3 (Current) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between group py-8"
          >
            <div className="md:w-1/2 md:text-right md:pr-12 pl-16 md:pl-0">
              <div className="inline-flex items-center gap-2 bg-[#0B1324] text-[#00D4FF] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 shadow-md">
                <Building2 size={12} /> Corporate Era
              </div>
              <h4 className="text-xl font-black text-slate-900">
                PT Guwigo Teknologi Indonesia
              </h4>
              <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                Pengukuhan entitas korporat. Memposisikan diri sebagai pusat
                pengembangan ekosistem Software-as-a-Service (SaaS) dan
                arsitektur Web Enterprise berskala nasional.
              </p>
            </div>

            {/* Titik Tengah (Active) */}
            <div className="absolute left-6 md:left-1/2 -ml-2.5 md:-ml-2.5 w-5 h-5 rounded-full bg-[#0B1324] border-4 border-white shadow-lg shadow-[#00D4FF]/40 z-10 mt-1 md:mt-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#00D4FF] rounded-full animate-pulse"></div>
            </div>

            <div className="md:w-1/2 md:pl-12 pl-16 mt-2 md:mt-0 hidden md:block">
              <span className="text-4xl font-black text-[#0B1324]">
                Present
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
