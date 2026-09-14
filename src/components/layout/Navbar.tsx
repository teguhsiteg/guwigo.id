"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Wrench, ArrowRight } from "lucide-react";
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
  const isVerifyPage = pathname?.startsWith("/verify");

  if (isAdminPage || isAuthPage || isVerifyPage) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Journey", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "News", href: "/news" },
    { name: "Store", href: "/store" },
    { name: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* ========================================= */}
      {/* TOP ANNOUNCEMENT MARQUEE BAR              */}
      {/* ========================================= */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white overflow-hidden flex items-center h-8 relative shadow-sm">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] absolute"
        >
          <span> WELCOME TO THE NEW ERA OF GUWIGO</span>
          <span>•</span>
          <span>PT GUWIGO TEKNOLOGI INDONESIA</span>
          <span>•</span>
          <Link
            href="/rebranding"
            className="flex items-center gap-1 hover:text-blue-100 transition-colors"
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
      {/* MAIN NAVBAR NAVIGATION (BRIGHT)           */}
      {/* ========================================= */}
      <header
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50"
            : "bg-white border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className="flex-shrink-0 group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
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

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActiveLink(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/tools"
                className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all duration-300 shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30"
              >
                <Wrench
                  size={14}
                  className="group-hover:rotate-12 transition-transform"
                />
                Free Tools
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-colors ${
                      isActiveLink(link.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-slate-100">
                  <Link
                    href="/tools"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
                  >
                    <Wrench size={16} /> Free Tools
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
