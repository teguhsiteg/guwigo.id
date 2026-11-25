"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Layers,
  Package,
  BarChart3,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  FolderOpen,
  LayoutTemplate,
  Menu,
  X,
  Eye,
  Truck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  MonitorDot,
  Globe,
  Wrench,
  Receipt,
  FileSpreadsheet,
  Newspaper,
  Binary,
  Flag,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { switchRole, resetRole, userRole } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isViewingAsUser = userRole === "member";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("guwigo_admin_session");
      localStorage.removeItem("admin_uid");
      localStorage.removeItem("guwigo_role_override");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path: string) => pathname === path;
  const isPartialActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    {
      group: "UTAMA",
      items: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/", icon: Globe, label: "Lihat Web Publik" },
      ],
    },
    {
      group: "MANAJEMEN KONTEN",
      items: [
        { href: "/admin/events", icon: Flag, label: "Race Card & Event Lari" },
        { href: "/admin/hero", icon: LayoutTemplate, label: "Landing Page (Hero)" },
        { href: "/admin/news", icon: Newspaper, label: "Berita & Artikel" },
        { href: "/admin/portfolio", icon: FolderOpen, label: "Portofolio Karya" },
        { href: "/admin/services", icon: Layers, label: "Layanan Platform" },
        { href: "/admin/tools", icon: Wrench, label: "Tools & Utilities" },
        { href: "/admin/about", icon: FileText, label: "Tentang Kami" },
        { href: "/admin/bio", icon: LinkIcon, label: "Link in Bio" },
      ],
    },
    {
      group: "GUWIGO STORE",
      items: [
        { href: "/admin/products", icon: Package, label: "Produk & Jasa" },
        { href: "/admin/transactions", icon: CreditCard, label: "Transaksi" },
      ],
    },
    {
      group: "KEUANGAN",
      items: [
        { href: "/admin/invoices", icon: FileSpreadsheet, label: "Invoice" },
        { href: "/admin/receipts", icon: Receipt, label: "Kuitansi" },
        { href: "/admin/number-generator", icon: Binary, label: "Nomor Surat & Dokumen" },
        { href: "/admin/invoices/settings", icon: Settings, label: "Pengaturan Invoice" },
      ],
    },
    {
      group: "SISTEM & LAINNYA",
      items: [
        { href: "/admin/members", icon: Users, label: "Tim & Member" },
        { href: "/admin/testimonials", icon: MessageCircle, label: "Testimoni" },
        { href: "/admin/gallery", icon: ImageIcon, label: "Galeri" },
        { href: "/admin/reports", icon: BarChart3, label: "Laporan" },
        { href: "/admin/contact-messages", icon: MessageSquare, label: "Pesan Masuk" },
        { href: "/admin/monitoring", icon: MonitorDot, label: "Monitor Sistem" },
        { href: "/admin/settings", icon: Settings, label: "Pengaturan Umum" },
        { href: "/admin/settings/payments", icon: CreditCard, label: "Sistem Pembayaran" },
        { href: "/admin/settings/shipping", icon: Truck, label: "Pengiriman" },
      ],
    },
  ];

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="no-print md:hidden fixed top-4 left-4 z-50 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 transition-all"
        title={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* DESKTOP COLLAPSE INDICATOR */}
      {!isMobileOpen && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="no-print hidden md:flex fixed left-0 top-24 z-30 p-2 bg-white text-blue-600 rounded-r-xl shadow-md transition-all border border-l-0 border-slate-200 hover:bg-blue-50"
          title="Expand sidebar"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* SIDEBAR — APPLE MACOS STYLE */}
      <aside
        className={`no-print fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-black/[0.06] flex flex-col shadow-apple-sm transition-all duration-300 z-40 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:${isCollapsed ? "md:w-20" : "md:w-72"} md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="h-20 border-b border-black/[0.04] px-6 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 min-w-max group select-none"
          >
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-[#0071E3] flex items-center justify-center text-white group-hover:scale-105 active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,113,227,0.3)]">
              <LayoutDashboard size={20} strokeWidth={2.2} />
            </div>
            {!isCollapsed && (
              <div>
                <div className="text-base font-bold text-[#1D1D1F] tracking-tight leading-none mb-0.5">
                  GUWIGO
                </div>
                <div className="text-[9px] font-semibold text-[#0071E3] uppercase tracking-[0.2em]">
                  Workspace
                </div>
              </div>
            )}
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 bg-black/[0.04] text-[#86868B] rounded-full hover:text-[#1D1D1F] transition-colors"
          >
            <X size={18} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Role Switcher Indicator */}
        {isViewingAsUser && !isCollapsed && (
          <div className="mx-4 mt-4 mb-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-2 mb-2">
              <Eye size={12} /> Live Preview
            </p>
            <button
              onClick={() => resetRole()}
              className="text-xs text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-xl font-semibold transition-colors w-full"
            >
              Exit User View
            </button>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {navItems.map((section, idx) => (
            <div key={idx} className="mb-5">
              {!isCollapsed && (
                <p className="px-5 mb-1.5 text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">
                  {section.group}
                </p>
              )}
              <div className="space-y-0.5 px-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const partialActive = isPartialActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-150 relative group ${
                        active
                          ? "bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,113,227,0.25)] font-semibold"
                          : partialActive
                            ? "bg-black/[0.04] text-[#1D1D1F] font-semibold"
                            : "text-[#48484A] hover:bg-black/[0.04] hover:text-[#1D1D1F] active:scale-[0.98]"
                      }`}
                    >
                      <Icon
                        size={17}
                        className={
                          active
                            ? "text-white"
                            : "text-[#86868B] group-hover:text-[#1D1D1F] transition-colors"
                        }
                      />

                      {!isCollapsed && <span className="tracking-tight">{item.label}</span>}

                      {/* Tooltip saat collapsed */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-[#1D1D1F] text-white text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
          {/* Role Switcher Button */}
          {!isViewingAsUser && !isCollapsed && (
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all border border-blue-100"
              >
                <Eye size={14} /> Preview as User
              </button>
              {showRoleSwitcher && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden p-1">
                  <button
                    onClick={() => {
                      switchRole("member");
                      setShowRoleSwitcher(false);
                      setIsMobileOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Login as Member
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full p-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 transition-all border border-red-100"
          >
            <LogOut size={16} />
            {!isCollapsed && "Logout System"}
          </button>

          {!isCollapsed && (
            <div className="pt-1 text-[10px] font-bold text-slate-300 text-center tracking-widest uppercase">
              Workspace v4.0
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `,
        }}
      />
    </>
  );
}
