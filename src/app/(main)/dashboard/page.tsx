"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  User,
  LogOut,
  ArrowRight,
  MonitorPlay,
  Loader2,
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import type { UserSubscription } from "@/types/payment";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Tolak akses jika tidak ada sesi login Member
    if (!localStorage.getItem("guwigo_user_session")) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = auth.currentUser;

        if (user) {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile({
              name: userDoc.data().name || user.displayName || "User",
              email: user.email || "",
              phone: user.phoneNumber || userDoc.data().phone,
            });
          }

          // Fetch user subscriptions
          const subsRef = collection(db, "user_subscriptions");
          const subsQuery = query(subsRef, where("userId", "==", user.uid));
          const subsSnapshot = await getDocs(subsQuery);
          const subsList: UserSubscription[] = [];

          subsSnapshot.forEach((doc) => {
            subsList.push(doc.data() as UserSubscription);
          });

          setSubscriptions(subsList);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted) {
      fetchUserData();
    }
  }, [isMounted]);

  const handleLogout = () => {
    localStorage.removeItem("guwigo_user_session");
    localStorage.removeItem("guwigo_admin_session");
    auth.signOut();
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isSubscriptionActive = (subscription: UserSubscription) => {
    if (!subscription.expiresAt) return true;
    return new Date(subscription.expiresAt) > new Date();
  };

  if (!isMounted) return null;

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Navbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <Link
            href="/"
            className="text-xl font-black text-slate-900 tracking-tighter"
          >
            GUWIGO<span className="text-blue-600">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} className="text-slate-600" />
            </Link>
            <div className="flex items-center gap-2 text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <User size={16} className="text-blue-600" />
              <span className="text-slate-700">Member</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
                Selamat Datang, {userProfile?.name}.
              </h1>
              <p className="text-slate-600 text-lg">
                Kelola langganan dan akses layanan premium Anda.
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Informasi Profil
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Nama
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {userProfile?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Email
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {userProfile?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Telepon
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {userProfile?.phone || "-"}
                  </p>
                </div>
              </div>
              <Link
                href="/settings"
                className="mt-6 inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
              >
                Edit Profil <ArrowRight size={18} />
              </Link>
            </div>

            {/* Active Subscriptions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Langganan Aktif ({subscriptions.length})
              </h2>

              {subscriptions.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
                  <AlertCircle
                    size={48}
                    className="text-slate-400 mx-auto mb-4"
                  />
                  <p className="text-slate-600 font-medium mb-6">
                    Anda belum memiliki langganan aktif.
                  </p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    Lihat Layanan <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptions.map((sub, index) => {
                    const active = isSubscriptionActive(sub);
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {sub.serviceName}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {sub.packageName}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1 ${
                              active
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-red-50 text-red-600 border-red-200"
                            }`}
                          >
                            {active ? (
                              <>
                                <CheckCircle size={12} /> Aktif
                              </>
                            ) : (
                              <>
                                <AlertCircle size={12} /> Expired
                              </>
                            )}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm text-slate-600">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                              Tanggal Pembelian
                            </p>
                            <p className="font-medium text-slate-900">
                              {formatDate(sub.purchasedAt)}
                            </p>
                          </div>
                          {sub.expiresAt && (
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                                Berlaku Hingga
                              </p>
                              <p className="font-medium text-slate-900">
                                {formatDate(sub.expiresAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Services */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Layanan Tersedia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card: Undangan AI */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles size={28} />
                  </div>
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full mb-3 w-max uppercase tracking-widest">
                    Premium
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Undangan AI Studio
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                    Editor visual cerdas untuk mencetak undangan
                    pernikahan/acara kualitas tinggi.
                  </p>
                  <Link
                    href="/tools/undangan-ai"
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    Buka Studio <ArrowRight size={18} />
                  </Link>
                </div>

                {/* Card: Free Tools */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <MonitorPlay size={28} />
                  </div>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full mb-3 w-max uppercase tracking-widest">
                    Free Access
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Koleksi Utilities
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                    Akses alat gratis seperti Generator Password, QR Code, dan
                    OBS Widget.
                  </p>
                  <Link
                    href="/tools"
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    Jelajahi <ArrowRight size={18} />
                  </Link>
                </div>

                {/* Card: Browse More Services */}
                <div className="bg-blue-50 rounded-3xl p-8 border border-blue-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center text-center">
                  <Sparkles size={48} className="text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Lebih Banyak Layanan
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-8">
                    Jelajahi semua paket layanan dan upgrade sekarang.
                  </p>
                  <Link
                    href="/services"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    Lihat Semua Layanan <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
