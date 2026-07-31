"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ArrowDown } from "lucide-react";

export default function GuwigoRebrandingAnnouncement() {
  const [showLogoModal, setShowLogoModal] = useState(false);

  // --- KONFIGURASI ANIMASI SVG ---
  const drawLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay: custom * 0.5,
          type: "spring" as const,
          duration: 2,
          bounce: 0,
        },
        opacity: { delay: custom * 0.5, duration: 0.1 },
      },
    }),
  };

  const fillShape = {
    hidden: { fill: "rgba(34, 211, 238, 0)" },
    visible: {
      fill: "rgba(34, 211, 238, 1)",
      transition: {
        delay: 2.5,
        duration: 1,
        ease: "easeInOut" as const,
      },
    },
  };

  // --- DATA REBRANDING ---
  const highlights = [
    {
      title: "Modern Technology Identity",
      description:
        "Guwigo kini hadir dengan identitas visual yang lebih modern, scalable, dan merepresentasikan perusahaan teknologi masa depan.",
    },
    {
      title: "Human-Centered Approach",
      description:
        "Kami tetap mempertahankan pendekatan humanis dalam setiap solusi digital yang kami bangun.",
    },
    {
      title: "Enterprise Ready",
      description:
        "Rebranding ini memperkuat positioning Guwigo sebagai perusahaan software engineering & digital solutions untuk skala startup hingga enterprise.",
    },
  ];

  const brandPersonality = [
    { label: "Tech Driven", value: 40, color: "bg-cyan-400" },
    { label: "Creative", value: 30, color: "bg-cyan-400" },
    { label: "Human Centered", value: 20, color: "bg-cyan-400" },
    { label: "Yogyakarta Rooted", value: 10, color: "bg-[#F4B942]" },
  ];

  const logoSystem = [
    {
      title: "Primary Logo",
      usage: "Website, proposal, company profile, pitch deck",
      type: "primary",
      src: "/images/branding/loader.png", // Sesuaikan path logo final
    },
    {
      title: "Icon Only",
      usage: "Instagram, WhatsApp, favicon, watermark",
      type: "icon",
      src: "/images/branding/loader.png", // Sesuaikan path logo final
    },
    {
      title: "Monogram / App Icon",
      usage: "UI software, mobile apps, loading screen",
      type: "monogram",
      src: "/images/branding/loader.png", // Sesuaikan path logo final
    },
  ];

  const colors = [
    {
      name: "Midnight Navy",
      code: "#0B1120",
      meaning: "Professional • Trusted • Enterprise",
    },
    {
      name: "Electric Cyan",
      code: "#22D3EE",
      meaning: "Innovation • AI • Digital Future",
    },
    {
      name: "Warm Gold",
      code: "#F4B942",
      meaning: "Vision • Premium • Jogja Identity",
    },
    {
      name: "Soft White",
      code: "#F8FAFC",
      meaning: "Clean • Minimal • Modern",
    },
  ];

  const scrollToHighlights = () => {
    document
      .getElementById("highlights")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden font-sans relative pt-24 selection:bg-cyan-500/30 selection:text-cyan-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_50%)] pointer-events-none" />

      {/* ========================================= */}
      {/* 1. HERO SECTION DENGAN ANIMASI LOGO       */}
      {/* ========================================= */}
      <section className="relative px-6 py-24 md:px-16 lg:px-28 min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-300 mb-8 backdrop-blur font-bold tracking-wide">
              PT Guwigo Teknologi Indonesia
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              GUWIGO
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                REBRANDING 2026
              </span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl font-medium">
              Dari identitas komunitas kreatif menuju perusahaan teknologi
              modern yang fokus membangun solusi digital adaptif, scalable, dan
              human-centered dari Yogyakarta untuk Indonesia.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <button
                onClick={scrollToHighlights}
                className="rounded-2xl bg-cyan-400 text-slate-950 px-8 py-4 font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2 group"
              >
                Explore New Identity
                <ArrowDown
                  size={18}
                  className="group-hover:translate-y-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>

          {/* RIGHT SIDE: ANIMATED ICONIC MARK & MODAL BUTTON */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute h-96 w-96 rounded-full bg-cyan-400/20 blur-[100px] pointer-events-none" />

            <div className="relative h-[420px] w-[420px] rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0B1120] to-[#020617] p-10 shadow-2xl backdrop-blur-xl flex items-center justify-center group">
              <button
                onClick={() => setShowLogoModal(true)}
                className="relative flex items-center justify-center h-72 w-72 rounded-full border-[2px] border-cyan-500/30 bg-[#0B1120] shadow-inner transition-all duration-500 group-hover:scale-105 group-hover:border-cyan-400 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] focus:outline-none"
                title="Klik untuk memperbesar logo"
              >
                {/* --- KOMPONEN ANIMASI SVG DITANAM DI SINI --- */}
                <div className="relative w-44 h-44 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full overflow-visible"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.circle
                      cx="50"
                      cy="55"
                      r="32"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="4"
                      strokeLinecap="round"
                      variants={drawLine}
                      custom={0}
                      initial="hidden"
                      animate="visible"
                      className="opacity-50"
                    />
                    <motion.path
                      d="M 12 55 L 35 55 L 65 85 C 75 95, 85 85, 75 75 L 50 50"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={drawLine}
                      custom={1}
                      initial="hidden"
                      animate="visible"
                    />
                    <motion.path
                      d="M 88 55 L 65 55 L 35 85 C 25 95, 15 85, 25 75 L 50 50"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={drawLine}
                      custom={1.5}
                      initial="hidden"
                      animate="visible"
                    />
                    <motion.path
                      d="M 50 15 L 68 45 L 32 45 Z"
                      stroke="#22D3EE"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      variants={drawLine}
                      custom={2}
                      initial="hidden"
                      animate="visible"
                    />
                    <motion.path
                      d="M 50 15 L 68 45 L 32 45 Z"
                      variants={fillShape}
                      initial="hidden"
                      animate="visible"
                    />
                  </svg>
                </div>

                <div className="absolute inset-0 rounded-full border border-cyan-400/10 animate-pulse pointer-events-none" />

                <div className="absolute bottom-6 bg-[#020617]/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn size={14} /> Lihat Detail
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 2. HIGHLIGHTS SECTION                     */}
      {/* ========================================= */}
      <section
        id="highlights"
        className="relative px-6 md:px-16 lg:px-28 py-20"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {highlights.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:border-cyan-400/50 hover:bg-white/10 transition duration-500 group"
            >
              <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================= */}
      {/* 3. PHILOSOPHY SECTION                     */}
      {/* ========================================= */}
      <section className="relative px-6 md:px-16 lg:px-28 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="h-1 w-20 bg-cyan-400 rounded-full" />
            <span className="uppercase tracking-[0.3em] text-cyan-300 text-sm font-bold">
              Brand Philosophy
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Core Concept */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            >
              <h2 className="text-4xl font-black mb-6">
                The Nexus Core Concept
              </h2>

              <div className="space-y-5 text-slate-300 leading-relaxed text-lg font-medium">
                <p>
                  Kami melepaskan inisial &quot;G&quot; untuk menciptakan simbol
                  yang sepenuhnya abstrak dan ikonik, merepresentasikan Guwigo
                  sebagai
                  <span className="text-white font-bold">
                    {" "}
                    pusat dari inovasi digital modern.
                  </span>
                </p>

                <p>
                  <span className="text-cyan-400 font-bold">
                    The Infinite Nexus:
                  </span>{" "}
                  Garis melingkar yang saling menyilang melambangkan arsitektur
                  perangkat lunak, integrasi sistem, dan ekosistem digital satu
                  pintu yang saling terkoneksi kuat.
                </p>

                <p>
                  <span className="text-cyan-400 font-bold">
                    The Ascending Arrow:
                  </span>{" "}
                  Bentuk mata panah melesat di bagian atas mencerminkan
                  pergerakan progresif, kecepatan inovasi, serta komitmen
                  membawa bisnis klien menembus batas masa depan.
                </p>
              </div>
            </motion.div>

            {/* Brand Personality (With Animated Progress Bars) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-transparent p-10 backdrop-blur-xl"
            >
              <h2 className="text-4xl font-black mb-8">Brand Personality</h2>

              <div className="space-y-8">
                {brandPersonality.map((trait, idx) => (
                  <div key={trait.label}>
                    <div className="flex justify-between mb-3 text-sm text-slate-200 font-bold tracking-wide">
                      <span>{trait.label}</span>
                      <span className="text-cyan-400">{trait.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${trait.value}%` }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                          duration: 1.2,
                          delay: idx * 0.2,
                          ease: "easeOut",
                        }}
                        className={`absolute top-0 left-0 h-full rounded-full ${trait.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 4. LOGO SYSTEM SECTION                    */}
      {/* ========================================= */}
      <section className="relative px-6 md:px-16 lg:px-28 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-14"
          >
            <div className="h-1 w-20 bg-cyan-400 rounded-full" />
            <span className="uppercase tracking-[0.3em] text-cyan-300 text-sm font-bold">
              Logo System
            </span>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {logoSystem.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="rounded-[2.5rem] border border-white/10 bg-[#0B1120] p-10 text-center hover:border-cyan-400/40 transition duration-500 group shadow-lg"
              >
                <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-slate-800 to-[#0B1120] border border-slate-700 shadow-xl group-hover:border-cyan-500/60 transition-colors duration-500">
                  <div
                    className={`relative transition-transform duration-500 group-hover:scale-110 ${item.type === "primary" ? "w-24 h-24" : "w-20 h-20"}`}
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {item.usage}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 5. COLOR SYSTEM SECTION                   */}
      {/* ========================================= */}
      <section className="relative px-6 md:px-16 lg:px-28 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-14"
          >
            <div className="h-1 w-20 bg-cyan-400 rounded-full" />
            <span className="uppercase tracking-[0.3em] text-cyan-300 text-sm font-bold">
              Color System
            </span>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {colors.map((color, idx) => (
              <motion.div
                key={color.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="rounded-[2.5rem] border border-white/10 bg-white/5 overflow-hidden group hover:-translate-y-3 transition-transform duration-500 shadow-lg"
              >
                <div
                  className="h-40 w-full transition-colors duration-500"
                  style={{ backgroundColor: color.code }}
                />

                <div className="p-8">
                  <h3 className="text-xl font-bold">{color.name}</h3>
                  <p className="text-cyan-400 mt-1 font-mono text-sm font-bold">
                    {color.code}
                  </p>
                  <p className="text-slate-400 mt-4 leading-relaxed text-sm font-medium">
                    {color.meaning}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* MODAL / POPUP LOGO DETAIL                 */}
      {/* ========================================= */}
      <AnimatePresence>
        {showLogoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/90 backdrop-blur-xl p-4"
            onClick={() => setShowLogoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              className="relative w-full max-w-4xl bg-[#0B1120] border border-cyan-500/30 rounded-[3rem] p-10 md:p-16 shadow-[0_0_120px_rgba(34,211,238,0.15)] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLogoModal(false)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-red-500/80 hover:rotate-90 transition-all duration-300 focus:outline-none"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-12">
                <span className="text-cyan-400 font-bold tracking-[0.4em] text-xs uppercase block mb-4">
                  Official Iconic Mark
                </span>
                <h3 className="text-4xl font-black text-white">
                  The Nexus Core
                </h3>
              </div>

              <div className="relative w-64 h-64 md:w-96 md:h-96 drop-shadow-[0_0_35px_rgba(34,211,238,0.3)]">
                <Image
                  src="/images/branding/loader.png" // Sesuaikan path logo final
                  alt="Guwigo Detailed Abstract Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <p className="mt-12 text-center text-slate-400 font-medium text-base max-w-lg leading-relaxed">
                Simbol abstrak ini murni melambangkan ekosistem perangkat lunak
                yang saling terintegrasi kokoh dan terus bergerak dinamis
                menembus masa depan teknologi.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
