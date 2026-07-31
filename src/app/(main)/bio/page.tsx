"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Globe,
  ShoppingBag,
  Code2,
  Terminal,
  MessageCircle,
  ExternalLink,
  Briefcase,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ==========================================
// 1. DATA PROFIL STATIS
// ==========================================
const profileData = {
  name: "Guwigo Ecosystem",
  tagline: "Building Smarter Digital Future.",
  description:
    "Discover the power of our integrated digital solutions, enterprise architecture, and creative technology crafted from Yogyakarta for Indonesia.",
  avatar: "/images/branding/loader.png",
  socials: [
    { icon: <Instagram size={18} />, url: "https://instagram.com/ikauii.diy" },
    { icon: <Linkedin size={18} />, url: "https://linkedin.com" },
    { icon: <Youtube size={18} />, url: "https://youtube.com" },
    { icon: <Mail size={18} />, url: "mailto:hello@guwigo.id" },
  ],
  primaryLink: {
    id: "primary-01",
    title: "Konsultasi Enterprise",
    desc: "Chat with our expert engineers today",
    url: "https://wa.me/6285179594146",
    iconName: "MessageCircle",
  },
};

// ==========================================
// 2. ICON & COLOR MAPPER (Gaya Premium Workspace)
// ==========================================
const getIconConfig = (iconName: string) => {
  switch (iconName) {
    case "MessageCircle":
      return {
        icon: <MessageCircle size={22} className="text-white" />,
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        shadow: "shadow-blue-500/20",
      };
    case "ShoppingBag":
      return {
        icon: <ShoppingBag size={22} className="text-[#0B1324]" />,
        bg: "bg-gradient-to-br from-amber-400 to-orange-500",
        shadow: "shadow-amber-500/20",
      };
    case "Globe":
      return {
        icon: <Globe size={22} className="text-white" />,
        bg: "bg-gradient-to-br from-emerald-400 to-teal-500",
        shadow: "shadow-emerald-500/20",
      };
    case "Terminal":
      return {
        icon: <Terminal size={22} className="text-white" />,
        bg: "bg-gradient-to-br from-rose-500 to-red-600",
        shadow: "shadow-rose-500/20",
      };
    case "Code2":
      return {
        icon: <Code2 size={22} className="text-white" />,
        bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
        shadow: "shadow-indigo-500/20",
      };
    case "Briefcase":
      return {
        icon: <Briefcase size={22} className="text-[#0B1324]" />,
        bg: "bg-gradient-to-br from-[#00D4FF] to-blue-400",
        shadow: "shadow-[#00D4FF]/20",
      };
    default:
      return {
        icon: <ExternalLink size={22} className="text-white" />,
        bg: "bg-gradient-to-br from-slate-600 to-slate-700",
        shadow: "shadow-slate-500/20",
      };
  }
};

interface BioLink {
  id: string;
  title: string;
  desc: string;
  url: string;
  iconName: string;
  featured: boolean;
  order: number;
}

const formatUrl = (url: string) => {
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("/")
  ) {
    return url;
  }
  return `https://${url}`;
};

export default function LinkInBioPage() {
  const [bentoLinks, setBentoLinks] = useState<BioLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // 3. FETCH DATA DARI FIREBASE
  // ==========================================
  useEffect(() => {
    const fetchBioLinks = async () => {
      try {
        const q = query(collection(db, "bio_links"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const data: BioLink[] = [];

        querySnapshot.forEach((docSnapshot) => {
          data.push({ id: docSnapshot.id, ...docSnapshot.data() } as BioLink);
        });

        if (data.length === 0) {
          setBentoLinks([
            {
              id: "1",
              title: "Free Web Utilities",
              desc: "QR & SEO Tools gratis",
              url: "/tools",
              iconName: "Terminal",
              featured: true,
              order: 1,
            },
            {
              id: "2",
              title: "Guwigo Store",
              desc: "Katalog premium merch",
              url: "/store",
              iconName: "ShoppingBag",
              featured: false,
              order: 2,
            },
            {
              id: "3",
              title: "Company Profile",
              desc: "Pelajari visi & misi",
              url: "/about",
              iconName: "Globe",
              featured: false,
              order: 3,
            },
            {
              id: "4",
              title: "Enterprise Services",
              desc: "Solusi IT terintegrasi",
              url: "/services",
              iconName: "Code2",
              featured: false,
              order: 4,
            },
          ]);
        } else {
          setBentoLinks(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBioLinks();
  }, []);

  const featuredLinks = bentoLinks.filter((link) => link.featured);
  const gridLinks = bentoLinks.filter((link) => !link.featured);

  // Konfigurasi Animasi Framer Motion
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 90, damping: 15 },
    },
  };

  return (
    <>
      {/* 
        HACK CSS UNTUK MOBILE: 
        Memaksa header dan footer utama disembunyikan di layar HP (lebar di bawah 768px).
        Pastikan tag global website Bapak menggunakan <header> dan <footer>. 
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 768px) {
          header, footer, nav, .global-header, .global-footer { 
            display: none !important; 
          }
          /* Menghilangkan padding atas dari layout global jika ada */
          main { padding-top: 0 !important; } 
        }
      `,
        }}
      />

      <div className="min-h-screen bg-[#09090B] flex justify-center pt-10 md:pt-20 pb-24 font-sans text-slate-200 selection:bg-[#00D4FF]/30 relative overflow-hidden">
        {/* Background Visual Effects (Premium Dark Glow) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00D4FF]/10 via-indigo-900/5 to-transparent blur-[100px] rounded-full"></div>
        </div>

        <motion.div
          className="w-full max-w-[500px] px-6 relative z-10 flex flex-col"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ========================================= */}
          {/* HEADER SECTION                            */}
          {/* ========================================= */}
          <motion.div
            variants={itemVariants}
            className="mb-10 text-center flex flex-col items-center"
          >
            <div className="relative mb-6 group cursor-pointer">
              {/* Outer Glow Animation */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00D4FF] to-blue-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-20 h-20 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center p-2 shadow-2xl overflow-hidden">
                <Image
                  src={profileData.avatar}
                  alt="Logo"
                  width={50}
                  height={50}
                  className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white mb-2">
              {profileData.name}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium max-w-[350px]">
              {profileData.description}
            </p>

            <div className="flex gap-4">
              {profileData.socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00D4FF]/10 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* ========================================= */}
          {/* PILL BUTTONS SECTION (PRIORITY ACCESS)    */}
          {/* ========================================= */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Sparkles size={16} className="text-[#00D4FF]" />
              <h2 className="text-xs font-black text-slate-300 tracking-widest uppercase">
                Priority Access
              </h2>
              <Sparkles size={16} className="text-[#00D4FF]" />
            </div>

            <div className="space-y-4">
              {/* Primary Link (Dari Data Statis) */}
              <a
                href={profileData.primaryLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00D4FF]/50 hover:bg-white/10 transition-all duration-300 shadow-lg group relative overflow-hidden"
              >
                {/* Subtle highlight effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/0 via-[#00D4FF]/5 to-[#00D4FF]/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 -skew-x-12"></div>

                {(() => {
                  const config = getIconConfig(
                    profileData.primaryLink.iconName,
                  );
                  return (
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${config.bg} shadow-lg ${config.shadow} group-hover:scale-105 transition-transform`}
                    >
                      {config.icon}
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#00D4FF] transition-colors">
                    {profileData.primaryLink.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {profileData.primaryLink.desc}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-500 group-hover:text-[#00D4FF] group-hover:translate-x-1 transition-all"
                />
              </a>

              {/* Featured Links (Dari Firebase) */}
              {featuredLinks.map((link) => {
                const config = getIconConfig(link.iconName);
                return (
                  <a
                    key={link.id}
                    href={formatUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-sm group"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${config.bg} shadow-lg ${config.shadow} group-hover:scale-105 transition-transform`}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1 pr-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-white">
                          {link.title}
                        </h3>
                        {link.order === 1 && (
                          <span className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {link.desc}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* ========================================= */}
          {/* GRID SECTION (EXPLORE USE CASES)          */}
          {/* ========================================= */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-white/10 flex-1"></div>
              <h2 className="text-[10px] font-black text-slate-500 tracking-widest uppercase px-4">
                Explore Ecosystem
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 size={24} className="text-[#00D4FF] animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Grid Links (Dari Firebase) */}
                {gridLinks.map((link) => {
                  const config = getIconConfig(link.iconName);
                  return (
                    <a
                      key={link.id}
                      href={formatUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group"
                    >
                      <div
                        className={`w-12 h-12 rounded-[14px] flex items-center justify-center mb-4 ${config.bg} shadow-md ${config.shadow}`}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1.5 leading-tight group-hover:text-blue-400 transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                          {link.desc}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Footer Brand */}
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <Code2 size={12} />
              Powered by Guwigo
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
