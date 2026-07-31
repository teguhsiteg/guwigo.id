"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  MessageCircle,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
  MapPin,
  Send,
  MessageSquare,
  Save,
  Clock,
} from "lucide-react";

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
type ToastType = "success" | "error" | "info";
interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

const ToastContainer = ({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) => (
  <div className="fixed top-6 right-6 z-[100] space-y-3 max-w-sm w-full pointer-events-none">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-right-8 duration-300 ${toast.type === "success" ? "bg-green-50 border border-green-200" : toast.type === "error" ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"}`}
      >
        {toast.type === "success" && (
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        )}
        {toast.type === "error" && (
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        )}
        {toast.type === "info" && (
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          {toast.title && (
            <p
              className={`font-bold text-sm tracking-wide ${toast.type === "success" ? "text-green-900" : toast.type === "error" ? "text-red-900" : "text-blue-900"}`}
            >
              {toast.title}
            </p>
          )}
          <p
            className={`text-sm mt-0.5 font-medium leading-relaxed ${toast.type === "success" ? "text-green-700" : toast.type === "error" ? "text-red-700" : "text-blue-700"}`}
          >
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-slate-400 hover:text-slate-900 bg-white/50 hover:bg-white p-1 rounded-full shrink-0 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

// ==========================================
// INTERFACES
// ==========================================
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: Timestamp;
}

interface DailyHours {
  isOpen: boolean;
  open: string;
  close: string;
}

interface BusinessHours {
  senin: DailyHours;
  selasa: DailyHours;
  rabu: DailyHours;
  kamis: DailyHours;
  jumat: DailyHours;
  sabtu: DailyHours;
  minggu: DailyHours;
}

interface ContactSettings {
  adminEmail: string;
  adminPhone: string;
  officeAddress: string;
  businessHours: BusinessHours;
}

const defaultHours: BusinessHours = {
  senin: { isOpen: true, open: "08:00", close: "17:00" },
  selasa: { isOpen: true, open: "08:00", close: "17:00" },
  rabu: { isOpen: true, open: "08:00", close: "17:00" },
  kamis: { isOpen: true, open: "08:00", close: "17:00" },
  jumat: { isOpen: true, open: "08:00", close: "17:00" },
  sabtu: { isOpen: false, open: "09:00", close: "15:00" },
  minggu: { isOpen: false, open: "09:00", close: "15:00" },
};

export default function ContactMessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );

  const [isSettingsModal, setIsSettingsModal] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [adminSettings, setAdminSettings] = useState<ContactSettings>({
    adminEmail: "emailbisnismasteg@gmail.com",
    adminPhone: "6281234567890",
    officeAddress: "Yogyakarta, Indonesia",
    businessHours: defaultHours,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => removeToast(id), 5000);
    },
    [],
  );
  const removeToast = useCallback(
    (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "contact-messages"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];
      setMessages(msgs);

      const settingsDoc = await getDoc(doc(db, "admin", "contact-settings"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setAdminSettings({
          adminEmail: data.adminEmail || "emailbisnismasteg@gmail.com",
          adminPhone: data.adminPhone || "6281234567890",
          officeAddress: data.officeAddress || "Yogyakarta, Indonesia",
          businessHours: data.businessHours || defaultHours,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast(
        "Gagal memuat data. Periksa koneksi Anda.",
        "error",
        "Koneksi Error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await setDoc(doc(db, "admin", "contact-settings"), adminSettings);
      showToast(
        "Data kontak & jam operasional berhasil diperbarui!",
        "success",
        "Tersimpan",
      );
      setIsSettingsModal(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Gagal menyimpan pengaturan.", "error", "Error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleHourChange = (
    day: keyof BusinessHours,
    field: keyof DailyHours,
    value: any,
  ) => {
    setAdminSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleMarkAs = async (id: string, status: "read" | "replied") => {
    try {
      await updateDoc(doc(db, "contact-messages", id), { status });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status } : msg)),
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      showToast(
        `Pesan ditandai sebagai ${status}.`,
        "success",
        "Status Diperbarui",
      );
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Gagal memperbarui status pesan.", "error", "Error");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteDoc(doc(db, "contact-messages", deleteConfirm.id));
      setMessages((prev) => prev.filter((msg) => msg.id !== deleteConfirm.id));
      if (selectedMessage?.id === deleteConfirm.id) setSelectedMessage(null);
      showToast(
        `Pesan dari "${deleteConfirm.name}" berhasil dihapus.`,
        "success",
        "Terhapus",
      );
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting:", error);
      showToast("Gagal menghapus pesan.", "error", "Error");
    }
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Memuat Inbox...
        </p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="p-6 md:p-10 font-sans max-w-7xl mx-auto pb-24 h-[calc(100vh-80px)] flex flex-col">
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
              <MessageCircle className="text-blue-600" /> CRM Inbox
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Kelola pesan dari klien. Total {messages.length} pesan,{" "}
              <span className="font-bold text-blue-600">
                {unreadCount} belum dibaca.
              </span>
            </p>
          </div>
          <button
            onClick={() => setIsSettingsModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Settings size={18} /> Atur Kontak & Jam Kerja
          </button>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* LEFT: MESSAGE LIST */}
          <div className="w-full lg:w-1/3 flex flex-col bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-widest ml-2">
                Semua Pesan
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                  <Mail size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium text-sm">Inbox kosong</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border ${
                      selectedMessage?.id === msg.id
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : msg.status === "unread"
                          ? "bg-white border-transparent hover:bg-slate-50 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                          : "bg-transparent border-transparent hover:bg-slate-50 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p
                        className={`text-sm truncate pr-2 ${msg.status === "unread" ? "font-black text-slate-900" : "font-bold text-slate-700"}`}
                      >
                        {msg.name}
                      </p>
                      {msg.status === "unread" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1 shadow-sm shadow-blue-400/50" />
                      )}
                    </div>
                    <p
                      className={`text-xs truncate ${msg.status === "unread" ? "font-bold text-slate-800" : "font-medium text-slate-500"}`}
                    >
                      {msg.subject}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1">
                      <Calendar size={10} />
                      {msg.createdAt
                        ?.toDate?.()
                        ?.toLocaleDateString?.("id-ID", {
                          day: "numeric",
                          month: "short",
                        }) || "Baru saja"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: MESSAGE DETAIL */}
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            {selectedMessage ? (
              <>
                <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-start justify-between gap-4 shrink-0">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-2xl shrink-0">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 leading-tight mb-1">
                        {selectedMessage.subject}
                      </h2>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedMessage.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-slate-500">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <Mail size={12} /> {selectedMessage.email}
                        </a>
                        {selectedMessage.phone && (
                          <a
                            href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 hover:text-green-600 transition-colors"
                          >
                            <Phone size={12} /> {selectedMessage.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-end gap-1">
                      <Calendar size={12} />
                      {selectedMessage.createdAt
                        ?.toDate?.()
                        ?.toLocaleDateString?.("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${selectedMessage.status === "unread" ? "bg-blue-100 text-blue-700" : selectedMessage.status === "replied" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                    >
                      {selectedMessage.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 whitespace-pre-wrap text-sm font-medium text-slate-700 leading-relaxed min-h-[200px]">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-white flex flex-wrap gap-3 shrink-0">
                  {selectedMessage.phone && (
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}?text=Halo%20${selectedMessage.name},%20menanggapi%20pesan%20Anda%20di%20website%20Guwigo:`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        handleMarkAs(selectedMessage.id, "replied")
                      }
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                    >
                      <MessageSquare size={16} /> Balas via WA
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    onClick={() => handleMarkAs(selectedMessage.id, "replied")}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                  >
                    <Send size={16} /> Balas via Email
                  </a>
                  <div className="flex-1"></div>
                  {selectedMessage.status !== "read" &&
                    selectedMessage.status !== "replied" && (
                      <button
                        onClick={() => handleMarkAs(selectedMessage.id, "read")}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors"
                      >
                        <CheckCircle2 size={16} /> Tandai Dibaca
                      </button>
                    )}
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        id: selectedMessage.id,
                        name: selectedMessage.name,
                      })
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle size={40} className="text-slate-300" />
                </div>
                <p className="font-bold text-slate-900 text-lg">Pilih Pesan</p>
                <p className="text-sm font-medium">
                  Klik salah satu pesan di samping untuk membaca detailnya.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          SETTINGS MODAL 
      ========================================== */}
      {isSettingsModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center shrink-0">
              <h2 className="font-bold flex items-center gap-2">
                <Settings size={18} className="text-blue-400" /> Kontak & Jam
                Kerja
              </h2>
              <button
                onClick={() => setIsSettingsModal(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 bg-slate-50 flex-1 overflow-y-auto custom-scrollbar">
              <form
                id="settingsForm"
                onSubmit={handleSaveSettings}
                className="space-y-6"
              >
                {/* Kontak Dasar */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2">
                    Informasi Kontak
                  </h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Nomor WhatsApp Tujuan
                    </label>
                    <div className="relative group">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={16}
                      />
                      <input
                        required
                        type="text"
                        value={adminSettings.adminPhone}
                        onChange={(e) =>
                          setAdminSettings({
                            ...adminSettings,
                            adminPhone: e.target.value,
                          })
                        }
                        placeholder="6281234567890"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Email Penerima Utama
                    </label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={16}
                      />
                      <input
                        required
                        type="email"
                        value={adminSettings.adminEmail}
                        onChange={(e) =>
                          setAdminSettings({
                            ...adminSettings,
                            adminEmail: e.target.value,
                          })
                        }
                        placeholder="admin@guwigo.com"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Alamat Kantor Induk
                    </label>
                    <div className="relative group">
                      <MapPin
                        className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={16}
                      />
                      <textarea
                        required
                        rows={2}
                        value={adminSettings.officeAddress}
                        onChange={(e) =>
                          setAdminSettings({
                            ...adminSettings,
                            officeAddress: e.target.value,
                          })
                        }
                        placeholder="Jl. Contoh No. 1..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Jam Operasional (Google Maps Style) */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" /> Jam
                    Operasional
                  </h3>
                  <div className="space-y-2">
                    {(
                      Object.keys(adminSettings.businessHours) as Array<
                        keyof BusinessHours
                      >
                    ).map((day) => (
                      <div
                        key={day}
                        className="flex items-center justify-between gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200 transition-colors"
                      >
                        {/* Day & Toggle */}
                        <div className="flex items-center gap-3 w-32">
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={adminSettings.businessHours[day].isOpen}
                              onChange={(e) =>
                                handleHourChange(
                                  day,
                                  "isOpen",
                                  e.target.checked,
                                )
                              }
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                          <span
                            className={`text-sm font-bold capitalize ${adminSettings.businessHours[day].isOpen ? "text-slate-900" : "text-slate-400"}`}
                          >
                            {day}
                          </span>
                        </div>

                        {/* Time Inputs */}
                        <div className="flex-1 flex items-center justify-end gap-2">
                          {adminSettings.businessHours[day].isOpen ? (
                            <>
                              <input
                                type="time"
                                value={adminSettings.businessHours[day].open}
                                onChange={(e) =>
                                  handleHourChange(day, "open", e.target.value)
                                }
                                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 w-24 text-center"
                              />
                              <span className="text-slate-400 font-bold text-xs">
                                -
                              </span>
                              <input
                                type="time"
                                value={adminSettings.businessHours[day].close}
                                onChange={(e) =>
                                  handleHourChange(day, "close", e.target.value)
                                }
                                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 w-24 text-center"
                              />
                            </>
                          ) : (
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg w-full text-center max-w-[206px]">
                              Tutup
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="p-5 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsSettingsModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="settingsForm"
                disabled={isSavingSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSavingSettings ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}{" "}
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900 mb-1">
                  Hapus Pesan?
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Pesan dari{" "}
                  <span className="font-bold text-slate-900">
                    "{deleteConfirm.name}"
                  </span>{" "}
                  akan dihapus permanen.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
