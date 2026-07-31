"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGIKA PENYEMBUNYIAN FOOTER/NAVBAR YANG BARU ---
  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/bio");
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage || isAuthPage) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Journey", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Store", href: "/store" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* ========================================= */}
      {/* TOP ANNOUNCEMENT MARQUEE BAR              */}
      {/* ========================================= */}
      <div className="bg-[#22D3EE] text-[#0B1120] overflow-hidden flex items-center h-8 relative shadow-md">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] absolute"
        >
          <span> WELCOME TO THE NEW ERA OF GUWIGO</span>
          <span>•</span>
          <span>PT GUWIGO TEKNOLOGI INDONESIA</span>
          <span>•</span>
          <Link
            href="/rebranding"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            LIHAT PENGUMUMAN REBRANDING <ArrowRight size={12} />
          </Link>
          <span>•</span>
          <span>BUILDING SMARTER DIGITAL FUTURE</span>
          <span>•</span>
          <span>ENTERPRISE SOFTWARE SOLUTIONS</span>
        </motion.div>
      </div>

      {/* ========================================= */}
      {/* MAIN NAVBAR NAVIGATION                    */}
      {/* ========================================= */}
      <header
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-[#0B1120]/95 backdrop-blur-md shadow-lg border-b border-white/10"
            : "bg-[#0B1120] border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className="flex-shrink-0 group outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] rounded-md"
            >
              {/* Ukuran logo disesuaikan untuk mobile (w-28 h-8) dan desktop (md:w-36 md:h-10) */}
              <div className="relative w-28 h-8 md:w-36 md:h-10 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                <Image
                  src="/images/branding/logo-guwigo-new.png"
                  alt="PT Guwigo Teknologi Indonesia"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:text-[#22D3EE] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#22D3EE] after:transition-all after:duration-300 hover:after:w-full py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B1120] rounded-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/tools"
                className="group flex items-center gap-2 px-6 py-2.5 bg-[#22D3EE] text-[#0B1120] rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#1CA8C4] transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] outline-none focus-visible:ring-4 focus-visible:ring-[#22D3EE]/50"
              >
                <Sparkles
                  size={14}
                  className="text-[#0B1120] group-hover:scale-110 transition-transform"
                />
                Free Tools
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
                aria-label={
                  isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
                }
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-[#0B1120] border-b border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm font-bold uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-[#22D3EE] rounded-xl transition-colors focus:outline-none focus:bg-white/5"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-white/10">
                  <Link
                    href="/tools"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#22D3EE] text-[#0B1120] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1CA8C4] transition-colors focus:outline-none focus:ring-4 focus:ring-[#22D3EE]/30"
                  >
                    <Sparkles size={16} /> Free Tools
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
