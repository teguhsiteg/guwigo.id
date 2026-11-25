"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Wrench, ArrowRight, User } from "lucide-react";
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
  const isEventPage = pathname?.startsWith("/event") || pathname?.startsWith("/race-card");

  if (isAdminPage || isAuthPage || isVerifyPage || isEventPage) {
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
      <div className="bg-[#0A0F1D] text-[#E2E8F0]/90 border-b border-[#1E293B] overflow-hidden flex items-center h-8 relative shadow-sm">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-6 text-[10px] font-medium tracking-[0.18em] uppercase absolute"
        >
          <span>PT GUWIGO TEKNOLOGI INDONESIA</span>
          <span className="text-[#06B6D4]">◆</span>
          <span>BUILDING CONNECTED DIGITAL SYSTEMS</span>
          <span className="text-[#06B6D4]">◆</span>
          <Link
            href="/rebranding"
            className="flex items-center gap-1 text-[#38BDF8] hover:text-white transition-colors"
          >
            LIHAT ARAH REBRANDING <ArrowRight size={11} />
          </Link>
          <span className="text-[#06B6D4]">◆</span>
          <span>YOGYAKARTA ROOTED, INDONESIA & BEYOND</span>
          <span className="text-[#06B6D4]">◆</span>
          <span>ENTERPRISE SOFTWARE SOLUTIONS</span>
        </motion.div>
      </div>

      {/* ========================================= */}
      {/* MAIN NAVBAR NAVIGATION                    */}
      {/* ========================================= */}
      <header
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-[#FAF9F6]/92 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.03)]"
            : "bg-[#FAF9F6]/80 backdrop-blur-sm border-b border-[#E2E8F0]/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className="flex-shrink-0 group outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md select-none"
            >
              <div className="relative w-28 h-8 md:w-36 md:h-10 transition-transform duration-200 group-hover:scale-[1.02] active:scale-95">
                <Image
                  src="/images/branding/logo-guwigo-new.png"
                  alt="PT Guwigo Teknologi Indonesia"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs tracking-tight px-3.5 py-1.5 rounded-md transition-all duration-150 ${
                    isActiveLink(link.href)
                      ? "text-[#2563EB] bg-white shadow-sm font-semibold"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/60 font-medium"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2.5">
              <Link
                href="/tools"
                className="group flex items-center gap-1.5 px-4 py-2 bg-white text-[#0F172A] rounded-lg text-xs font-medium tracking-tight hover:bg-[#F1F5F9] active:scale-[0.98] transition-all duration-150 border border-[#E2E8F0] shadow-sm"
              >
                <Wrench
                  size={14}
                  className="group-hover:rotate-12 transition-transform text-[#2563EB]"
                />
                Free Tools
              </Link>
              <Link
                href="/login"
                className="group flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-xs font-medium tracking-tight hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150 shadow-sm shadow-blue-500/20"
              >
                <User size={14} />
                Guwigo ID
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                aria-label={
                  isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
                }
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
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
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-[#FAF9F6] border-b border-[#E2E8F0] overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActiveLink(link.href)
                        ? "text-[#2563EB] bg-[#EFF6FF] font-semibold"
                        : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-[#E2E8F0] flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#2563EB] text-white rounded-md text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm"
                  >
                    <User size={16} /> Masuk Guwigo ID
                  </Link>
                  <Link
                    href="/tools"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-[#0F172A] rounded-md text-xs font-medium hover:bg-[#F1F5F9] transition-colors border border-[#E2E8F0]"
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
