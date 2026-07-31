"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Instagram,
  Linkedin,
  MapPin,
  ArrowRight,
  Youtube,
  ArrowUp,
} from "lucide-react";

// ==========================================
// DATA KONFIGURASI
// ==========================================
const FOOTER_LINKS = [
  {
    title: "Free Tools",
    items: [
      { label: "QR Code Generator", href: "/tools/qrcode" },
      { label: "Password Generator", href: "/tools/password" },
      { label: "WA Link Builder", href: "/tools/wa-generator" },
      { label: "SEO Previewer", href: "/tools/seo-preview" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "The Journey", href: "/about" },
      { label: "Enterprise Services", href: "/services" },
      { label: "Guwigo Store", href: "/store" },
      { label: "Hire Us", href: "/contact", isSpecial: true },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Support Center", href: "/contact" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: "https://instagram.com/ikauii.diy" },
  { icon: Linkedin, href: "#" },
  { icon: Youtube, href: "#" },
];

export function FooterContent() {
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- LOGIKA PENYEMBUNYIAN FOOTER BERDASARKAN URL ---
  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage || isAuthPage) {
    return null;
  }

  return (
    <footer className="bg-[#0B1324] text-slate-400 pt-20 md:pt-32 pb-8 md:pb-12 relative z-0 overflow-hidden font-sans border-t border-slate-800">
      {/* Abstract Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[400px] bg-[#00D4FF]/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10 max-w-7xl">
        {/* ========================================= */}
        {/* TOP SECTION (Logo & Navigation)           */}
        {/* ========================================= */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 md:mb-20 gap-12 lg:gap-8">
          {/* Kolom Kiri: Branding */}
          <div className="max-w-md w-full">
            <Link
              href="/"
              className="flex flex-col group select-none w-fit mb-6"
            >
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-none group-hover:text-[#00D4FF] transition-colors duration-300">
                GUWIGO
              </span>
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] text-[#00D4FF] uppercase leading-none self-start ml-0.5 mt-1 group-hover:tracking-[0.5em] transition-all duration-500">
                INDONESIA
              </span>
            </Link>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
              We build intelligent digital ecosystems that empower businesses,
              campuses, and communities for the future.
            </p>
            <div className="mt-8">
              <a
                href="mailto:hello@guwigo.id"
                className="inline-flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest border-b border-slate-700 pb-2 hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all group"
              >
                Let's Talk Business{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Links (Responsive Grid) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 md:gap-16 w-full lg:w-auto">
            {FOOTER_LINKS.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-black mb-5 md:mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
                  {section.title}
                </h4>
                <ul className="space-y-3.5 md:space-y-4 text-sm font-medium">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        className="hover:text-[#00D4FF] transition-colors flex items-center gap-2"
                      >
                        {item.label}
                        {item.isSpecial && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================= */}
        {/* MIDDLE SECTION (HQ & Socials)             */}
        {/* ========================================= */}
        <div className="border-t border-slate-800/50 pt-10 md:pt-12 pb-10 md:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-8">
          {/* Headquarters */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-[#00D4FF] shrink-0 border border-slate-800">
              <MapPin size={20} />
            </div>
            <div>
              <h5 className="text-white font-bold mb-1 tracking-wide">
                Headquarters
              </h5>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Daerah Istimewa Yogyakarta, Indonesia
              </p>
            </div>
          </div>

          {/* Socials & Flag Counter (Rata kiri di HP, rata kanan di Desktop) */}
          <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-[#00D4FF] hover:text-[#0B1324] hover:border-[#00D4FF] transition-all hover:scale-110 shadow-sm"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>

            <a
              href="http://s01.flagcounter.com/more/fSB"
              target="_blank"
              rel="noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity drop-shadow-md rounded-lg overflow-hidden inline-block border border-slate-800 max-w-full"
              title="Global Visitors"
            >
              <img
                src="https://s01.flagcounter.com/count2/fSB/bg_0B1324/txt_94A3B8/border_1E293B/columns_2/maxflags_10/viewers_0/labels_0/pageviews_0/flags_0/percent_0/"
                alt="Flag Counter"
                className="w-full h-auto object-cover"
                style={{ border: 0 }}
              />
            </a>
          </div>
        </div>

        {/* ========================================= */}
        {/* BOTTOM BAR (Copyright & Back to Top)      */}
        {/* ========================================= */}
        <div className="border-t border-slate-800/50 pt-8 md:pt-12 relative">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 text-xs font-mono font-medium text-slate-600 mb-8 relative z-20">
            <p className="order-2 md:order-1">
              &copy; 2015-{new Date().getFullYear()} PT Guwigo Teknologi
              Indonesia.
            </p>

            <button
              onClick={scrollToTop}
              className="order-1 md:order-2 flex items-center gap-2 hover:text-[#00D4FF] transition-colors group focus:outline-none bg-slate-900/50 md:bg-transparent px-4 py-2 md:p-0 rounded-full md:rounded-none border border-slate-800 md:border-transparent"
              aria-label="Kembali ke atas"
            >
              BACK TO TOP
              <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-[#00D4FF] group-hover:-translate-y-1 group-hover:bg-[#0B1324] transition-all">
                <ArrowUp
                  size={14}
                  className="text-slate-400 group-hover:text-[#00D4FF]"
                />
              </span>
            </button>

            <div className="order-3 flex gap-4 md:gap-6 justify-center">
              <span className="hidden sm:inline">AHU-006752.AH.01.30</span>
              <span>System v3.0.0</span>
            </div>
          </div>

          {/* Massive Background Typography */}
          <div className="w-full overflow-hidden select-none opacity-[0.02] hover:opacity-10 transition-opacity duration-700 flex justify-center relative z-10 pointer-events-none">
            <h1 className="text-[18vw] md:text-[12vw] font-black text-white leading-none tracking-tighter mt-4 md:mt-0">
              GUWIGO
            </h1>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterContent;
