"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Routes yang memerlukan login
const PROTECTED_ROUTES = [
  "/dashboard",
  "/member/dashboard",
  "/settings",
  "/mentoring/register",
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Cek apakah route memerlukan login
      const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route),
      );

      if (isProtected && !isAuthenticated) {
        router.push(`/login?redirectTo=${pathname}`);
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // HANYA RETURN CHILDREN SAJA.
  // Navbar dan Footer sudah diurus oleh src/app/layout.tsx (Root Layout)
  return <>{children}</>;
}
