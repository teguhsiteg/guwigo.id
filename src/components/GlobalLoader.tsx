"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

export default function GlobalLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBypassedRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/login") || pathname?.startsWith("/register");
  
  const [isLoading, setIsLoading] = useState(!isBypassedRoute);

  useEffect(() => {
    if (isBypassedRoute) {
      setIsLoading(false);
      return;
    }

    try {
      if (sessionStorage.getItem("guwigo_intro_shown")) {
        setIsLoading(false);
        return;
      }
    } catch {}

    const timer = setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem("guwigo_intro_shown", "true");
      } catch {}
    }, 800);

    return () => clearTimeout(timer);
  }, [isBypassedRoute]);

  // KONFIGURASI ANIMASI CONTAINER DENGAN TIPE VARIANTS
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier untuk efek smooth ease-out
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: { duration: 0.6, ease: "easeInOut" },
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
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="global-loader"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0F1D]"
          >
            {/* Animasi Container Utama: Fade In, Scale Up */}
            <motion.div
              variants={containerVariants}
              className="relative w-36 h-36 md:w-48 md:h-48 mb-8 drop-shadow-[0_0_24px_rgba(37,99,235,0.35)] flex items-center justify-center"
            >
              {/* Animasi mengambang (floating) berulang */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
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

            {/* Typografi Logo Pendukung yang muncul setelah SVG tampil utuh */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-white tracking-[0.2em] uppercase leading-none mb-2 font-normal">
                GUWIGO
              </h2>
              <p className="text-[10px] md:text-[11px] font-semibold text-[#06B6D4] uppercase tracking-[0.3em]">
                Teknologi Indonesia
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konten halaman utama akan berada di bawah loader */}
      <div className={isLoading ? "h-screen overflow-hidden" : ""}>
        {children}
      </div>
    </>
  );
}
