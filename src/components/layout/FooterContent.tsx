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
    title: "Products & Ecosystem",
    items: [
      { label: "TeGe Omni (WhatsApp CRM)", href: "https://omni.guwigo.com" },
      { label: "TeGe Rental & POS", href: "https://rental.guwigo.com" },
      { label: "Guwigo Events", href: "https://events.guwigo.com" },
      { label: "Queue by Guwigo", href: "https://antrean.guwigo.com" },
      { label: "Guwigo Account ID", href: "https://account.guwigo.com" },
    ],
  },
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
      { label: "News & Wawasan", href: "/news" },
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
    pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/bio");
  const isAdminPage = pathname?.startsWith("/admin");
  const isVerifyPage = pathname?.startsWith("/verify");
  const isEventPage = pathname?.startsWith("/event") || pathname?.startsWith("/race-card");

  if (isAdminPage || isAuthPage || isVerifyPage || isEventPage) {
    return null;
  }

  return (
    <footer className="bg-[#0A0F1D] text-[#94A3B8] pt-20 md:pt-28 pb-8 md:pb-12 relative z-0 overflow-hidden font-sans border-t border-[#1E293B]">
      {/* Abstract Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[400px] bg-[#2563EB]/10 rounded-md blur-[140px] pointer-events-none"></div>

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
              <span className="text-3xl md:text-4xl font-serif tracking-tight text-white leading-none group-hover:text-[#60A5FA] transition-colors duration-200">
                GUWIGO
              </span>
              <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] text-[#06B6D4] uppercase leading-none self-start ml-0.5 mt-1.5 transition-all duration-200">
                TEKNOLOGI INDONESIA
              </span>
            </Link>
            <p className="text-[#94A3B8] text-base leading-relaxed font-normal">
              Kami merancang arsitektur sistem dan ekosistem digital cerdas yang
              memberdayakan bisnis, kampus, dan institusi siap menghadapi masa depan.
            </p>
            <div className="mt-8">
              <a
                href="mailto:hello@guwigo.id"
                className="inline-flex items-center gap-3 text-white font-medium text-xs uppercase tracking-widest border-b border-[#1E293B] pb-2 hover:border-[#2563EB] hover:text-[#60A5FA] transition-all group"
              >
                Mari Berdiskusi Proyek{" "}
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform text-[#06B6D4]"
                />
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Links (Responsive Grid) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 md:gap-16 w-full lg:w-auto">
            {FOOTER_LINKS.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-medium mb-5 md:mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
                  {section.title}
                </h4>
                <ul className="space-y-3.5 md:space-y-4 text-sm font-normal">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        className="hover:text-[#60A5FA] transition-colors flex items-center gap-2 text-[#94A3B8]"
                      >
                        {item.label}
                        {item.isSpecial && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse shrink-0"></span>
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
        <div className="border-t border-[#1E293B] pt-10 md:pt-12 pb-10 md:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-8">
          {/* Headquarters */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#131C31] rounded-md flex items-center justify-center text-[#60A5FA] shrink-0 border border-[#1E293B]">
              <MapPin size={18} />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1 tracking-wide text-sm">
                Headquarters
              </h5>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Daerah Istimewa Yogyakarta, Indonesia
              </p>
            </div>
          </div>

          {/* Socials & Flag Counter */}
          <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-md bg-[#131C31] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all hover:scale-105 shadow-sm"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>

            <a
              href="http://s01.flagcounter.com/more/fSB"
              target="_blank"
              rel="noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity drop-shadow-md rounded-lg overflow-hidden inline-block border border-[#1E293B] max-w-full"
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
        <div className="border-t border-[#1E293B] pt-8 md:pt-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 text-xs font-sans text-[#64748B] mb-8 relative z-20">
            <p className="order-2 md:order-1">
              &copy; 2015-{new Date().getFullYear()} PT Guwigo Teknologi
              Indonesia.
            </p>

            <button
              onClick={scrollToTop}
              className="order-1 md:order-2 flex items-center gap-2 hover:text-[#60A5FA] transition-colors group focus:outline-none bg-[#131C31] md:bg-transparent px-4 py-2 md:p-0 rounded-md md:rounded-none border border-[#1E293B] md:border-transparent text-xs tracking-wider"
              aria-label="Kembali ke atas"
            >
              KEMBALI KE ATAS
              <span className="w-7 h-7 rounded-lg bg-[#131C31] flex items-center justify-center border border-[#1E293B] group-hover:border-[#2563EB] group-hover:-translate-y-0.5 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                <ArrowUp
                  size={13}
                  className="text-[#A39E98] group-hover:text-white transition-colors"
                />
              </span>
            </button>

            <div className="order-3 flex gap-4 md:gap-6 justify-center">
              <span className="hidden sm:inline">AHU-006752.AH.01.30</span>
              <span>Ecosystem v3.2</span>
            </div>
          </div>

          {/* Massive Background Typography */}
          <div className="w-full overflow-hidden select-none opacity-[0.03] hover:opacity-[0.06] transition-opacity duration-700 flex justify-center relative z-10 pointer-events-none">
            <h1 className="text-[18vw] md:text-[12vw] font-serif font-normal text-white leading-none tracking-tight mt-4 md:mt-0">
              GUWIGO
            </h1>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterContent;
