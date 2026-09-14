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
  const [isLoading, setIsLoading] = useState(true);

  // Matikan loader yang menghalangi admin dan jangan muncul terus di setiap klik rute
  useEffect(() => {
    const isAdmin = pathname?.startsWith("/admin");
    const isAuth = pathname?.startsWith("/login") || pathname?.startsWith("/register");

    // Di area admin dan auth, langsung render tanpa splash screen loader
    if (isAdmin || isAuth) {
      setIsLoading(false);
      return;
    }

    // Hanya tampilkan intro sekali per sesi kunjungan browser
    try {
      const hasLoaded = sessionStorage.getItem("guwigo_intro_shown");
      if (hasLoaded) {
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback jika sessionStorage diblokir
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem("guwigo_intro_shown", "true");
      } catch {}
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

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
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0B1324]"
          >
            {/* Animasi Container Utama: Fade In, Scale Up, dan Glowing Pulse */}
            <motion.div
              variants={containerVariants}
              className="relative w-40 h-40 md:w-56 md:h-56 mb-8 drop-shadow-[0_0_30px_rgba(0,188,254,0.4)] flex items-center justify-center"
            >
              {/* Animasi mengambang (floating) berulang */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
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
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-[0.2em] uppercase font-sans leading-none mb-2 drop-shadow-md">
                GUWIGO
              </h2>
              <p className="text-[9px] md:text-[11px] font-black text-[#00D4FF] uppercase tracking-[0.5em] opacity-90 drop-shadow-sm">
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
