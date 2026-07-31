"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

export default function AnimatedLogo() {
  // KONFIGURASI ANIMASI CONTAINER DENGAN TYPE VARIANTS
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1], // Efek transisi smooth (Cubic Bezier)
      },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.6, duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-12 bg-[#0B1324] rounded-[3rem] border border-white/5 shadow-2xl">
      {/* Animasi Container Utama: Fade In, Scale Up, dan Glowing Pulse */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-48 h-48 drop-shadow-[0_0_30px_rgba(0,188,254,0.4)] mb-8 flex items-center justify-center"
      >
        {/* Animasi mengambang (floating) berulang secara konstan */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-full"
        >
          {/* PEMANGGILAN FILE LOKAL LOADER.PNG */}
          <Image
            src="/images/branding/loader.png"
            alt="Guwigo Ecosystem"
            fill
            priority
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Typografi Logo Pendukung yang muncul setelah logo utama tampil */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-[0.2em] uppercase font-sans leading-none mb-2 drop-shadow-md">
          GUWIGO
        </h2>
        <p className="text-[9px] md:text-[11px] font-black text-[#00D4FF] uppercase tracking-[0.5em] opacity-90 drop-shadow-sm">
          Teknologi Indonesia
        </p>
      </motion.div>
    </div>
  );
}
