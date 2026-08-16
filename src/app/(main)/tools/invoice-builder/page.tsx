"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Info,
  Plus,
  Loader2,
  RefreshCw,
  LogOut,
  Trash2,
  Image as ImageIcon,
  PenTool,
  Stamp,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
}

// ============================================================================
// HACK FIX: Pindahkan FormRow ke LUAR fungsi utama agar tidak re-render terus
// dan menyebabkan kursor input terlepas saat mengetik.
// ============================================================================
const FormRow = ({ label, required = false, children, badge = "" }: any) => (
  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6 py-2">
    <div className="md:w-1/3 pt-2">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
        {badge && (
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </label>
    </div>
    <div className="md:w-2/3">{children}</div>
  </div>
);

export default function InvoiceBuilderPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // --- 1. LOGIKA FIREBASE AUTH ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else setCurrentUser(null);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("guwigo_user_session", "ACTIVE");
      localStorage.setItem("user_uid", result.user.uid);
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Gagal melakukan login.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("guwigo_user_session");
      localStorage.removeItem("user_uid");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // --- 2. STATE FORM INVOICE ---
  const [docType, setDocType] = useState("Invoice");
  const [docTheme, setDocTheme] = useState("light");

  // State Perusahaan (Logo & Tanda Tangan)
  const [company, setCompany] = useState({
    logo: "",
    signature: "",
    invertSignature: false,
    name: "PT Teknologi Nusantara",
    address: "Jl. Sudirman No. 123, Jakarta Selatan\nDKI Jakarta 12190",
    contact: "hello@nusantara.tech | 0812-3456-7890",
    signerName: "Direktur Utama",
  });

  const [customer, setCustomer] = useState({
    id: "",
    name: "PT Klien Sejahtera",
    phone: "08123456789",
    email: "finance@klien.com",
    notes: "",
  });

  const [invoice, setInvoice] = useState({
    date: new Date().toISOString().split("T")[0],
    number: "INV-20260807-1001",
    orderId: "0befe-a111-4e26-845a-99ae",
    reference: "",
    notes:
      "Pembayaran via Transfer Bank BCA\nNo Rek: 1234567890 a.n PT Teknologi Nusantara",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .split("T")[0],
  });

  const [payment, setPayment] = useState({
    via: "Virtual Account / Bank Transfer",
    expiry: "Saat jatuh tempo",
  });

  const [taxSetting, setTaxSetting] = useState({
    type: "Harga tidak termasuk pajak",
    rate: 11,
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      name: "Layanan Cloud Enterprise",
      qty: 1,
      price: 15000000,
      discount: 0,
    },
  ]);

  const [useEMeterai, setUseEMeterai] = useState(false);
  const [discounts, setDiscounts] = useState({ nominal: 0, shipping: 0 });

  const EMETERAI_FEE = 13000;

  // --- LOGIKA DINAMIS ---
  const isQuote = docType === "Penawaran";
  const labelDocTitle = isQuote ? "PENAWARAN" : "INVOICE";
  const labelDate = isQuote ? "Tanggal Penawaran" : "Tanggal Invoice";
  const labelDueDate = isQuote ? "Berlaku Hingga" : "Jatuh Tempo";
  const labelTotal = isQuote ? "Estimasi Total" : "Total Tagihan";

  // --- LOGIKA TEMA KERTAS YANG CERDAS ---
  const themeClasses = {
    wrapper: docTheme === "dark" ? "bg-[#0F172A]" : "bg-white",
    textMain: docTheme === "dark" ? "text-white" : "text-slate-800",
    textMuted: docTheme === "dark" ? "text-slate-400" : "text-slate-500",
    textSub: docTheme === "dark" ? "text-slate-300" : "text-slate-600",
    borderLight:
      docTheme === "dark" ? "border-slate-700/50" : "border-slate-200",
    borderStrong: docTheme === "dark" ? "border-slate-500" : "border-slate-800",
    bgCard:
      docTheme === "dark"
        ? "bg-[#1E293B] border-slate-700"
        : "bg-slate-100 border-slate-200",
    banner:
      docTheme === "dark"
        ? "bg-orange-500/20 text-orange-300"
        : "bg-orange-100 text-orange-800",
  };

  // --- KALKULASI ---
  const subtotal = items.reduce(
    (acc, item) => acc + item.qty * item.price - item.discount,
    0,
  );
  const afterDiscount = subtotal - discounts.nominal;
  const taxAmount =
    taxSetting.type === "Tanpa pajak"
      ? 0
      : (afterDiscount * taxSetting.rate) / 100;
  const totalTagihan =
    afterDiscount +
    taxAmount +
    discounts.shipping +
    (useEMeterai ? EMETERAI_FEE : 0);

  // --- HANDLERS ---
  const handleAddItem = () =>
    setItems([
      ...items,
      { id: Date.now().toString(), name: "", qty: 1, price: 0, discount: 0 },
    ]);
  const handleRemoveItem = (id: string) =>
    setItems(items.filter((item) => item.id !== id));
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) =>
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "signature",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany({ ...company, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateInvoiceNumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    const prefix = isQuote ? "QUO" : "INV";
    setInvoice({ ...invoice, number: `${prefix}-${dateStr}-${random}` });
  };

  useEffect(() => {
    generateInvoiceNumber();
  }, [docType]);

  // --- 3. AKSI SIMPAN DATABASE & DOWNLOAD ---
  const saveInvoiceToDatabase = async () => {
    if (!currentUser) return;
    try {
      const invoiceRef = doc(
        db,
        "users",
        currentUser.uid,
        "invoices",
        invoice.number,
      );
      await setDoc(invoiceRef, {
        docType,
        docTheme,
        company,
        customer,
        invoice,
        payment,
        taxSetting,
        items,
        discounts,
        useEMeterai,
        total: totalTagihan,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Gagal menyimpan invoice:", error);
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById("invoice-preview-doc");
    if (!element) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const opt: any = {
      margin: 10,
      filename: `${invoice.number}_${customer.name}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleAction = async () => {
    setIsProcessing(true);
    await saveInvoiceToDatabase();

    if (!useEMeterai) {
      await generatePDF();
      setIsProcessing(false);
    } else {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert(
          `Membuka Payment Gateway...\nTagihan e-Meterai: Rp ${EMETERAI_FEE.toLocaleString("id-ID")}`,
        );
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
        alert("Gagal menghubungkan ke payment gateway.");
      }
    }
  };

  // Kelas gaya standar untuk semua input
  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

  // --- TAMPILAN LOADING & AUTH ---
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `header, footer, nav[aria-label="Global"] { display: none !important; } main { padding-top: 0 !important; margin: 0 !important; }`,
          }}
        />
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans px-4">
          <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Guwigo Invoice
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              Silakan masuk menggunakan akun Google Anda untuk mengakses panel
              tagihan.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Masuk dengan Google
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        header, footer, .global-header, #header, #footer { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
        body { background-color: #F8F9FA !important; }
      `,
        }}
      />

      <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20 pt-0 mt-0">
        {/* TOP NAVBAR */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-[100] w-full">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-semibold"
              >
                <ArrowLeft size={18} />{" "}
                <span className="hidden sm:inline">
                  Kembali ke halaman utama
                </span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 mr-4 border-r border-slate-200 pr-4">
                <img
                  src={
                    currentUser.photoURL ||
                    `https://ui-avatars.com/api/?name=${currentUser.displayName}&background=0D8ABC&color=fff`
                  }
                  alt="Profile"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs font-bold text-slate-700">
                  {currentUser.displayName?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-red-500 mr-2 flex items-center gap-1"
              >
                <LogOut size={16} />{" "}
                <span className="hidden sm:inline">Logout</span>
              </button>
              <button
                onClick={handleAction}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Preview & posting"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            Buat Dokumen
          </h1>

          <div className="flex flex-col xl:flex-row gap-6 items-start">
            {/* ========================================================= */}
            {/* KOLOM KIRI: FORM BUILDER                                  */}
            {/* ========================================================= */}
            <div
              className={`w-full ${showPreview ? "xl:w-[60%]" : "xl:w-full"} flex flex-col gap-6 transition-all duration-300`}
            >
              <div className="flex justify-between items-center text-sm text-slate-500 pb-2">
                <p>Semua bagian bertanda * harus diisi</p>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-50 font-medium text-slate-700"
                >
                  {showPreview ? "Sembunyikan preview" : "Tampilkan preview"}
                </button>
              </div>

              {/* CARD 1: Pengaturan Dokumen */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  Pengaturan Dokumen{" "}
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    BARU
                  </span>
                </h2>
                <FormRow label="Pilih jenis dokumen">
                  <div className="flex items-center gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input
                        type="radio"
                        checked={docType === "Invoice"}
                        onChange={() => setDocType("Invoice")}
                        className="w-4 h-4 text-blue-600 border-slate-300"
                      />{" "}
                      Invoice Tagihan
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input
                        type="radio"
                        checked={docType === "Penawaran"}
                        onChange={() => setDocType("Penawaran")}
                        className="w-4 h-4 text-blue-600 border-slate-300"
                      />{" "}
                      Penawaran (Quotation)
                    </label>
                  </div>
                </FormRow>
                <div className="my-4 border-t border-slate-100"></div>
                <FormRow label="Tema warna kertas PDF">
                  <div className="flex items-center gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input
                        type="radio"
                        checked={docTheme === "light"}
                        onChange={() => setDocTheme("light")}
                        className="w-4 h-4 text-blue-600 border-slate-300"
                      />{" "}
                      Terang (Putih Bersih)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input
                        type="radio"
                        checked={docTheme === "dark"}
                        onChange={() => setDocTheme("dark")}
                        className="w-4 h-4 text-blue-600 border-slate-300"
                      />{" "}
                      Gelap (Navy Premium)
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Gunakan tema gelap jika logo perusahaan Anda berwarna
                    putih/terang.
                  </p>
                </FormRow>
              </div>

              {/* CARD 1.5: Profil & Branding Perusahaan */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">
                  Profil Perusahaan & Branding
                </h2>
                <div className="space-y-4">
                  <FormRow label="Logo Perusahaan">
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo")}
                        className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt="Logo"
                          className="h-12 w-auto object-contain bg-slate-100 p-1 rounded border border-slate-200 mt-2"
                        />
                      )}
                    </div>
                  </FormRow>
                  <FormRow label="Nama Perusahaan" required>
                    <input
                      type="text"
                      value={company.name}
                      onChange={(e) =>
                        setCompany({ ...company, name: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <FormRow label="Alamat Lengkap" required>
                    <textarea
                      value={company.address}
                      onChange={(e) =>
                        setCompany({ ...company, address: e.target.value })
                      }
                      className={`${inputClass} resize-none h-20`}
                    />
                  </FormRow>
                  <FormRow label="Kontak (Email/Telp)">
                    <textarea
                      value={company.contact}
                      onChange={(e) =>
                        setCompany({ ...company, contact: e.target.value })
                      }
                      className={`${inputClass} resize-none h-16`}
                    />
                  </FormRow>
                  <div className="my-4 border-t border-slate-100"></div>
                  <FormRow label="Tanda Tangan Digital">
                    <div className="flex flex-col gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "signature")}
                        className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      {company.signature && (
                        <img
                          src={company.signature}
                          alt="TTD"
                          className="h-16 w-auto object-contain bg-slate-100 p-1 rounded border border-slate-200"
                          style={{
                            filter: company.invertSignature
                              ? "invert(1) brightness(2)"
                              : "none",
                          }}
                        />
                      )}
                      {company.signature && docTheme === "dark" && (
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 w-fit">
                          <input
                            type="checkbox"
                            checked={company.invertSignature}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                invertSignature: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-blue-600 rounded border-slate-300"
                          />
                          Ubah tinta tanda tangan menjadi putih (Invert Color)
                        </label>
                      )}
                    </div>
                  </FormRow>
                  <FormRow label="Nama Penandatangan" required>
                    <input
                      type="text"
                      value={company.signerName}
                      onChange={(e) =>
                        setCompany({ ...company, signerName: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                </div>
              </div>

              {/* CARD 2: Detail pelanggan */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">
                  Detail pelanggan
                </h2>
                <div className="space-y-4">
                  <FormRow label="ID pelanggan (opsional)">
                    <input
                      type="text"
                      placeholder="Masukkan ID pelanggan jika ada"
                      value={customer.id}
                      onChange={(e) =>
                        setCustomer({ ...customer, id: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <FormRow label="Nama" required>
                    <input
                      type="text"
                      placeholder="Masukkan nama pelanggan"
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <FormRow label="Nomor HP (opsional)">
                    <input
                      type="text"
                      placeholder="812 345 6789"
                      value={customer.phone}
                      onChange={(e) =>
                        setCustomer({ ...customer, phone: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <FormRow label="Email (opsional)">
                    <input
                      type="email"
                      placeholder="Masukkan alamat email pelanggan"
                      value={customer.email}
                      onChange={(e) =>
                        setCustomer({ ...customer, email: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <FormRow label="Alamat Klien (opsional)">
                    <textarea
                      placeholder="Masukkan alamat lengkap klien..."
                      value={customer.notes}
                      onChange={(e) =>
                        setCustomer({ ...customer, notes: e.target.value })
                      }
                      className={`${inputClass} resize-none h-20`}
                    />
                  </FormRow>
                </div>
              </div>

              {/* CARD 3: Detail Dokumen */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">
                  Detail {docType.toLowerCase()}
                </h2>
                <div className="space-y-4">
                  <FormRow label={labelDate} required>
                    <input
                      type="date"
                      value={invoice.date}
                      onChange={(e) =>
                        setInvoice({ ...invoice, date: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <FormRow label={`No. ${docType.toLowerCase()}`} required>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={invoice.number}
                        onChange={(e) =>
                          setInvoice({ ...invoice, number: e.target.value })
                        }
                        className={inputClass}
                      />
                      <button
                        onClick={generateInvoiceNumber}
                        className="px-3 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>
                  </FormRow>
                  <FormRow label="Order ID" required>
                    <input
                      type="text"
                      value={invoice.orderId}
                      onChange={(e) =>
                        setInvoice({ ...invoice, orderId: e.target.value })
                      }
                      className={`${inputClass} bg-slate-50`}
                    />
                  </FormRow>
                  <FormRow label={labelDueDate} required>
                    <input
                      type="date"
                      value={invoice.dueDate}
                      onChange={(e) =>
                        setInvoice({ ...invoice, dueDate: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <FormRow label="Catatan & Instruksi (opsional)">
                    <textarea
                      placeholder="Masukkan instruksi pembayaran, No. Rekening, dsb..."
                      value={invoice.notes}
                      onChange={(e) =>
                        setInvoice({ ...invoice, notes: e.target.value })
                      }
                      className={`${inputClass} resize-none h-24`}
                    />
                  </FormRow>
                </div>
              </div>

              {/* CARD 4: Metode pembayaran */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">
                  Metode pembayaran
                </h2>
                <div className="space-y-4">
                  <FormRow label="Bayar via" required>
                    <input
                      type="text"
                      value={payment.via}
                      onChange={(e) =>
                        setPayment({ ...payment, via: e.target.value })
                      }
                      placeholder="Contoh: Virtual Account BCA"
                      className={inputClass}
                    />
                  </FormRow>
                </div>
              </div>

              {/* CARD 5: Pajak */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">
                  Detail pajak
                </h2>
                <div className="space-y-4">
                  <FormRow label="Pengaturan Pajak">
                    <select
                      value={taxSetting.type}
                      onChange={(e) =>
                        setTaxSetting({ ...taxSetting, type: e.target.value })
                      }
                      className={inputClass}
                    >
                      <option value="Tanpa pajak">Tanpa pajak</option>
                      <option value="Harga tidak termasuk pajak">
                        Harga belum termasuk pajak (Tambah PPN)
                      </option>
                    </select>
                  </FormRow>
                  {taxSetting.type !== "Tanpa pajak" && (
                    <FormRow label="Persentase PPN (%)">
                      <input
                        type="number"
                        value={taxSetting.rate}
                        onChange={(e) =>
                          setTaxSetting({
                            ...taxSetting,
                            rate: Number(e.target.value),
                          })
                        }
                        className={inputClass}
                      />
                    </FormRow>
                  )}
                </div>
              </div>

              {/* CARD 6: Daftar produk */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">
                  Daftar layanan / produk
                </h2>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative"
                    >
                      <h3 className="text-sm font-bold text-slate-600 mb-4">
                        Item {index + 1}
                      </h3>
                      {items.length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="space-y-4">
                        <FormRow label="Deskripsi" required>
                          <input
                            type="text"
                            placeholder="Masukkan deskripsi layanan"
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(item.id, "name", e.target.value)
                            }
                            className={inputClass}
                          />
                        </FormRow>
                        <div className="grid grid-cols-2 gap-4">
                          <FormRow label="Harga Satuan" required>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "price",
                                  Number(e.target.value),
                                )
                              }
                              className={inputClass}
                            />
                          </FormRow>
                          <FormRow label="Jumlah" required>
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "qty",
                                  Number(e.target.value),
                                )
                              }
                              className={inputClass}
                            />
                          </FormRow>
                        </div>
                        <FormRow label="Diskon Item (Rp)">
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "discount",
                                Number(e.target.value),
                              )
                            }
                            className={inputClass}
                          />
                        </FormRow>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddItem}
                  className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 flex items-center gap-2"
                >
                  Tambah item <Plus size={16} />
                </button>
              </div>

              {/* CARD 7: E-Meterai & Diskon Akhir */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">
                  Lainnya
                </h2>
                <div className="space-y-4">
                  <FormRow label="Diskon Total (Rp)">
                    <input
                      type="number"
                      value={discounts.nominal}
                      onChange={(e) =>
                        setDiscounts({
                          ...discounts,
                          nominal: Number(e.target.value),
                        })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <FormRow label="Ongkos Kirim (Rp)">
                    <input
                      type="number"
                      value={discounts.shipping}
                      onChange={(e) =>
                        setDiscounts({
                          ...discounts,
                          shipping: Number(e.target.value),
                        })
                      }
                      className={inputClass}
                    />
                  </FormRow>
                  <div className="border-t border-slate-200 mt-4 pt-4">
                    <FormRow label="E-Meterai (opsional)">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 mt-2">
                        <input
                          type="checkbox"
                          checked={useEMeterai}
                          onChange={(e) => setUseEMeterai(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300"
                        />
                        Gunakan e-Meterai PERURI (Rp13.000)
                      </label>
                      <p className="text-xs text-red-500 mt-2">
                        Anda akan dikenakan biaya tambahan Rp13.000 untuk
                        pembubuhan e-Meterai pada dokumen ini.
                      </p>
                    </FormRow>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* KOLOM KANAN: PREVIEW DOKUMEN (STICKY & DYNAMIC THEME)     */}
            {/* ========================================================= */}
            {showPreview && (
              <div className="hidden xl:block xl:w-[40%] sticky top-24 h-[calc(100vh-120px)] flex-col gap-4 z-10">
                <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs px-4 py-3 rounded-t-xl flex items-start gap-2">
                  <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
                  <p>
                    Hanya referensi. Anda akan melihat preview akhirnya sebelum
                    posting dokumen.
                  </p>
                </div>

                <div className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-md h-full flex flex-col overflow-y-auto custom-scrollbar relative">
                  {/* KERTAS PDF DENGAN TEMA DINAMIS */}
                  <div
                    id="invoice-preview-doc"
                    className={`p-8 pb-16 flex-1 font-sans text-sm ${themeClasses.wrapper} transition-colors duration-300`}
                  >
                    {/* Header Document */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-1/2">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt="Logo"
                            className="h-12 object-contain mb-3"
                          />
                        ) : (
                          <h2
                            className={`text-xl font-black mb-2 ${themeClasses.textMain}`}
                          >
                            {company.name}
                          </h2>
                        )}
                        <p
                          className={`text-[10px] whitespace-pre-wrap ${themeClasses.textMuted}`}
                        >
                          {company.address}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${themeClasses.textMuted}`}
                        >
                          {company.contact}
                        </p>
                      </div>
                      <div className="text-right">
                        <h1
                          className={`text-2xl font-black tracking-wider ${themeClasses.textMain}`}
                        >
                          {labelDocTitle}
                        </h1>
                        <p
                          className={`text-xs font-bold mt-1 ${themeClasses.textMain}`}
                        >
                          {invoice.number}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${themeClasses.textMuted}`}
                        >
                          {invoice.orderId}
                        </p>
                      </div>
                    </div>

                    {/* Info Block */}
                    <div
                      className="grid grid-cols-3 gap-6 mb-8 text-xs border-y py-4"
                      style={{
                        borderColor:
                          docTheme === "dark" ? "#334155" : "#E2E8F0",
                      }}
                    >
                      <div>
                        <p
                          className={`font-bold mb-1 ${themeClasses.textMain}`}
                        >
                          Ditagihkan Kepada:
                        </p>
                        <p className={`font-bold ${themeClasses.textSub}`}>
                          {customer.name || "[Nama Klien]"}
                        </p>
                        <p
                          className={`whitespace-pre-wrap ${themeClasses.textMuted}`}
                        >
                          {customer.notes}
                        </p>
                        <p className={themeClasses.textMuted}>
                          {customer.phone}
                        </p>
                        <p className={themeClasses.textMuted}>
                          {customer.email}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`font-bold mb-1 ${themeClasses.textMain}`}
                        >
                          {labelDate}:
                        </p>
                        <p className={`mb-3 ${themeClasses.textSub}`}>
                          {invoice.date}
                        </p>

                        <p
                          className={`font-bold mb-1 ${themeClasses.textMain}`}
                        >
                          {labelDueDate}:
                        </p>
                        <p className={`font-bold text-red-500`}>
                          {invoice.dueDate}
                        </p>
                      </div>
                      <div>
                        <div
                          className={`p-3 rounded-lg border ${themeClasses.bgCard}`}
                        >
                          <p
                            className={`font-bold mb-1 ${themeClasses.textMain}`}
                          >
                            Metode Pembayaran:
                          </p>
                          <p className={`font-medium ${themeClasses.textSub}`}>
                            {payment.via}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Table Items */}
                    <table className="w-full text-xs mb-8">
                      <thead>
                        <tr
                          className={`border-b-2 ${themeClasses.borderStrong} ${themeClasses.textMain}`}
                        >
                          <th className="py-2 text-left font-bold">
                            Deskripsi Layanan
                          </th>
                          <th className="py-2 text-right font-bold w-12">
                            Qty
                          </th>
                          <th className="py-2 text-right font-bold w-24">
                            Harga (Rp)
                          </th>
                          <th className="py-2 text-right font-bold w-20">
                            Diskon
                          </th>
                          <th className="py-2 text-right font-bold w-24">
                            Jumlah (Rp)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr
                            key={idx}
                            className={`border-b ${themeClasses.borderLight} ${themeClasses.textSub}`}
                          >
                            <td className="py-3 font-medium">
                              {item.name || "-"}
                            </td>
                            <td className="py-3 text-right">{item.qty}</td>
                            <td className="py-3 text-right">
                              {item.price.toLocaleString("id-ID")}
                            </td>
                            <td className="py-3 text-right">
                              {item.discount > 0
                                ? item.discount.toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td className="py-3 text-right font-bold">
                              {(
                                item.qty * item.price -
                                item.discount
                              ).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Calculation Bottom */}
                    <div className="flex justify-between items-start text-xs">
                      <div className={`w-1/2 pr-6`}>
                        <p
                          className={`font-bold mb-2 ${themeClasses.textMain}`}
                        >
                          Catatan / Instruksi Pembayaran:
                        </p>
                        <p
                          className={`whitespace-pre-wrap leading-relaxed ${themeClasses.textMuted}`}
                        >
                          {invoice.notes}
                        </p>
                      </div>

                      <div className="w-64 space-y-2">
                        <div
                          className={`flex justify-between font-bold ${themeClasses.textMain}`}
                        >
                          <span>Subtotal</span>
                          <span>{subtotal.toLocaleString("id-ID")}</span>
                        </div>
                        {discounts.nominal > 0 && (
                          <div
                            className={`flex justify-between ${themeClasses.textSub}`}
                          >
                            <span>Diskon Tambahan</span>
                            <span className="text-red-500">
                              - {discounts.nominal.toLocaleString("id-ID")}
                            </span>
                          </div>
                        )}
                        {taxAmount > 0 && (
                          <div
                            className={`flex justify-between ${themeClasses.textSub}`}
                          >
                            <span>PPN ({taxSetting.rate}%)</span>
                            <span>{taxAmount.toLocaleString("id-ID")}</span>
                          </div>
                        )}
                        {discounts.shipping > 0 && (
                          <div
                            className={`flex justify-between ${themeClasses.textSub}`}
                          >
                            <span>Ongkos Kirim</span>
                            <span>
                              {discounts.shipping.toLocaleString("id-ID")}
                            </span>
                          </div>
                        )}
                        {useEMeterai && (
                          <div
                            className={`flex justify-between ${themeClasses.textSub}`}
                          >
                            <span>Biaya e-Meterai</span>
                            <span>{EMETERAI_FEE.toLocaleString("id-ID")}</span>
                          </div>
                        )}
                        <div
                          className={`flex justify-between font-black border-t-2 ${themeClasses.borderStrong} pt-2 mt-2 text-sm ${themeClasses.textMain}`}
                        >
                          <span>{labelTotal}</span>
                          <span>Rp {totalTagihan.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tanda Tangan & e-Meterai Area */}
                    <div className="mt-12 flex justify-end">
                      <div className="text-center relative w-48">
                        <p
                          className={`text-[10px] mb-2 ${themeClasses.textMuted}`}
                        >
                          Hormat Kami,
                        </p>

                        {useEMeterai && (
                          <div className="absolute top-0 right-16 w-16 h-16 border-2 border-dashed border-rose-400/50 bg-rose-500/10 rounded-lg flex flex-col items-center justify-center opacity-80 transform -rotate-12 z-0">
                            <Stamp size={16} className="text-rose-400 mb-0.5" />
                            <span className="text-[5px] font-bold text-rose-500 text-center leading-tight">
                              METERAI
                              <br />
                              ELEKTRONIK
                            </span>
                          </div>
                        )}

                        <div className="relative z-10 min-h-[60px] flex items-center justify-center">
                          {company.signature && (
                            <img
                              src={company.signature}
                              alt="Signature"
                              className="h-16 object-contain"
                              style={{
                                filter:
                                  company.invertSignature && docTheme === "dark"
                                    ? "invert(1) brightness(2)"
                                    : "none",
                              }}
                            />
                          )}
                        </div>
                        <p
                          className={`text-xs font-bold border-b pb-1 mt-1 ${themeClasses.borderStrong} ${themeClasses.textMain}`}
                        >
                          {company.signerName}
                        </p>
                      </div>
                    </div>

                    {/* Footer Kertas Absolute */}
                    <div
                      className={`absolute bottom-6 left-8 right-8 flex justify-between text-[9px] border-t pt-4 ${themeClasses.borderLight} ${themeClasses.textMuted}`}
                    >
                      <p>
                        Dokumen ini diterbitkan sah oleh{" "}
                        <strong>{company.name}</strong>
                      </p>
                      <p>Halaman 1 dari 1</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
