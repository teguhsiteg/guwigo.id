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
  Sparkles,
  Menu,
  X,
  Eye,
  Truck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  MonitorDot,
  Globe, // <== TAMBAHKAN INI DI SINI
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
      group: "MAIN",
      items: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        // TAMBAHKAN BARIS INI UNTUK JALAN PINTAS KE WEB PUBLIK
        { href: "/", icon: Globe, label: "View Public Website" },
      ],
    },
    {
      group: "CONTENT",
      items: [
        { href: "/admin/hero", icon: Sparkles, label: "Hero & Branding" },
        { href: "/admin/about", icon: FileText, label: "About Us" },
        { href: "/admin/services", icon: Layers, label: "Services" },
        { href: "/admin/portfolio", icon: FolderOpen, label: "Portfolio" },
        { href: "/admin/bio", icon: LinkIcon, label: "Link in Bio" },
      ],
    },
    {
      group: "MANAGEMENT",
      items: [
        { href: "/admin/products", icon: Package, label: "Products" },
        { href: "/admin/members", icon: Users, label: "Team & Members" },
        {
          href: "/admin/testimonials",
          icon: MessageCircle,
          label: "Testimonials",
        },
        { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
      ],
    },
    {
      group: "BUSINESS",
      items: [
        {
          href: "/admin/transactions",
          icon: CreditCard,
          label: "Transactions",
        },
        { href: "/admin/reports", icon: BarChart3, label: "Reports" },
        {
          href: "/admin/contact-messages",
          icon: MessageSquare,
          label: "Contact Messages",
        },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        {
          href: "/admin/monitoring",
          icon: MonitorDot,
          label: "System Monitor",
        },
        { href: "/admin/settings", icon: Settings, label: "General Settings" },
        {
          href: "/admin/settings/payments",
          icon: CreditCard,
          label: "Payment System",
        },
        { href: "/admin/settings/shipping", icon: Truck, label: "Shipping" },
      ],
    },
  ];

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#0B1324] text-white rounded-xl shadow-lg shadow-slate-900/20 hover:scale-105 transition-all"
        title={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* DESKTOP COLLAPSE INDICATOR */}
      {!isMobileOpen && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="hidden md:flex fixed left-0 top-24 z-30 p-2 bg-[#0B1324] text-white rounded-r-xl shadow-lg transition-all border border-l-0 border-slate-800"
          title="Expand sidebar"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0B1324] border-r border-slate-800 flex flex-col shadow-2xl transition-all duration-300 z-40 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:${isCollapsed ? "md:w-20" : "md:w-72"} md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="h-24 border-b border-slate-800/80 px-6 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-4 min-w-max group"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#00D4FF] to-blue-600 flex items-center justify-center text-[#0B1324] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,212,255,0.3)]">
              <LayoutDashboard size={20} strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <div>
                <div className="text-lg font-black text-white tracking-widest uppercase leading-none mb-1">
                  GUWIGO
                </div>
                <div className="text-[9px] font-bold text-[#00D4FF] uppercase tracking-[0.2em]">
                  Workspace
                </div>
              </div>
            )}
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 bg-white/5 text-slate-400 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
          <div className="mx-4 mt-6 mb-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-2">
              <Eye size={12} /> Live Preview
            </p>
            <button
              onClick={() => resetRole()}
              className="text-xs text-white bg-amber-500/20 hover:bg-amber-500/40 px-3 py-1.5 rounded-lg font-bold transition-colors w-full"
            >
              Exit User View
            </button>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          {navItems.map((section, idx) => (
            <div key={idx} className="mb-8">
              {!isCollapsed && (
                <p className="px-6 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {section.group}
                </p>
              )}
              <div className="space-y-1 px-4">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const partialActive = isPartialActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 relative group ${
                        active
                          ? "bg-[#00D4FF]/10 text-[#00D4FF]"
                          : partialActive
                            ? "bg-white/5 text-white"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          active
                            ? "text-[#00D4FF]"
                            : "text-slate-400 group-hover:text-white transition-colors"
                        }
                      />

                      {!isCollapsed && <span>{item.label}</span>}

                      {/* Active Indicator Line */}
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00D4FF] rounded-r-full shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                      )}

                      {/* Tooltip saat collapsed */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-white text-[#0B1324] text-xs font-black rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl whitespace-nowrap z-50">
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
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-black/20">
          {/* Role Switcher Button */}
          {!isViewingAsUser && !isCollapsed && (
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl font-bold text-xs uppercase tracking-widest text-[#00D4FF] bg-[#00D4FF]/5 hover:bg-[#00D4FF]/10 transition-all border border-[#00D4FF]/20"
              >
                <Eye size={14} /> Preview as User
              </button>
              {showRoleSwitcher && (
                <div className="absolute bottom-full left-0 right-0 mb-3 bg-[#0B1324] border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden p-1">
                  <button
                    onClick={() => {
                      switchRole("member");
                      setShowRoleSwitcher(false);
                      setIsMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-widest hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Login as Member
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-3 w-full p-3 rounded-xl font-bold text-xs uppercase tracking-widest text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/10 hover:border-red-500/30`}
          >
            <LogOut size={16} />
            {!isCollapsed && "Logout System"}
          </button>

          {!isCollapsed && (
            <div className="pt-2 text-[10px] font-bold text-slate-600 text-center tracking-widest uppercase">
              Workspace v3.0
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#0B1324]/80 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `,
        }}
      />
    </>
  );
}
