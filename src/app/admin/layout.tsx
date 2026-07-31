"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "./components/Sidebar";
import TopLoadingBar from "./components/TopLoadingBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userRole, isLoading, isAuthenticated } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (userRole !== "admin") {
        router.push("/dashboard");
        return;
      }

      setIsAuthorized(true);
    }
  }, [isLoading, isAuthenticated, userRole, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-gray-50">
        <TopLoadingBar />
        {/* Render shell layout while loading so it doesn't look blank */}
        <div className="hidden md:block w-72 bg-white border-r border-slate-200" />
        <main className="flex-1 bg-gray-50" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 md:ml-72 overflow-auto bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
