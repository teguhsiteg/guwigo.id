"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Phone,
  Mail,
  User,
  Save,
  LogOut,
  Settings,
  Package,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { User as UserType } from "@/types/auth";
import type { UserSubscription } from "@/types/payment";

interface UserProfile extends UserType {
  phone?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [phone, setPhone] = useState("");
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = auth.currentUser;

        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data() as UserProfile;
        setProfile({
          ...userData,
          email: user.email || "",
        });
        setPhone(userData?.phone || "");

        // Fetch user subscriptions
        const subsRef = collection(db, "user_subscriptions");
        const subsQuery = query(subsRef, where("userId", "==", user.uid));
        const subsSnapshot = await getDocs(subsQuery);
        const subsList: UserSubscription[] = [];
        subsSnapshot.forEach((doc) => {
          subsList.push(doc.data() as UserSubscription);
        });
        setSubscriptions(subsList);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({
          type: "error",
          text: "Gagal memuat data profil",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isMounted, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate phone number
    if (!phone) {
      setMessage({
        type: "error",
        text: "Nomor telepon harus diisi",
      });
      return;
    }

    if (!/^(\+62|62|0)[0-9]{9,12}$/.test(phone.replace(/\s/g, ""))) {
      setMessage({
        type: "error",
        text: "Format nomor telepon tidak valid. Gunakan format: 08xx atau +62x",
      });
      return;
    }

    setIsSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        phone: phone,
      });

      setProfile((prev) => (prev ? { ...prev, phone } : null));
      setMessage({
        type: "success",
        text: "Profil berhasil disimpan",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Gagal menyimpan profil",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("guwigo_user_session");
    localStorage.removeItem("guwigo_admin_session");
    auth.signOut();
    router.push("/login");
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-blue-600" size={32} />
            <h1 className="text-3xl font-black text-slate-900">
              Pengaturan Profil
            </h1>
          </div>
          <p className="text-slate-600">
            Kelola informasi profil dan langganan Anda
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <User size={24} className="text-blue-600" />
            Informasi Profil
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Name (Read only) */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Nama Lengkap
              </label>
              <div className="mt-2 p-4 bg-slate-50 rounded-xl text-slate-900 font-bold border border-slate-200">
                {profile?.name || "-"}
              </div>
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Email
              </label>
              <div className="mt-2 flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Mail size={20} className="text-blue-600 shrink-0" />
                <span className="text-slate-900 font-bold">
                  {profile?.email}
                </span>
              </div>
            </div>

            {/* Phone Number (Editable) */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Nomor Telepon *
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xx atau +62x"
                  className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 font-bold focus:border-blue-500 focus:bg-blue-50 transition-all outline-none"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Nomor telepon diperlukan untuk proses checkout pembayaran
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {isSaving ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>

        {/* Subscriptions Card */}
        {subscriptions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Package size={24} className="text-green-600" />
              Langganan Aktif ({subscriptions.length})
            </h2>

            <div className="space-y-4">
              {subscriptions.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {sub.packageName}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Dibeli:{" "}
                      {new Date(sub.purchasedAt).toLocaleDateString("id-ID")}
                    </p>
                    {sub.expiresAt && (
                      <p className="text-sm text-slate-600">
                        Berlaku hingga:{" "}
                        {new Date(sub.expiresAt).toLocaleDateString("id-ID")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    <CheckCircle2 size={14} />
                    {sub.status === "active" ? "Aktif" : "Expired"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
