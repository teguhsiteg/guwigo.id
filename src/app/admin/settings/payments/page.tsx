"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CreditCard, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentSettings {
  // Xendit
  xenditSecretKey?: string;
  xenditPublicKey?: string;
  xenditWebhookToken?: string;
  isXenditProduction?: boolean;
  enableXendit: boolean;

  // General
  currency: string;
  taxPercentage: number;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({
    xenditSecretKey: "",
    xenditPublicKey: "",
    xenditWebhookToken: "",
    isXenditProduction: false,
    enableXendit: true,

    currency: "IDR",
    taxPercentage: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, "systemSettings", "payments");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings({ ...settings, ...(docSnap.data() as PaymentSettings) });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, "systemSettings", "payments");
      await setDoc(docRef, settings, { merge: true });
      toast.success("Pengaturan pembayaran berhasil disimpan");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  const [testingXendit, setTestingXendit] = useState(false);
  const handleTestXendit = async () => {
    try {
      setTestingXendit(true);
      // Panggil API /api/xendit dengan data dummy
      const payload = {
        amount: 10000,
        customerName: "Test User",
        customerEmail: "test@guwigo.com",
        description: "Test Koneksi Xendit",
      };

      const res = await fetch("/api/xendit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.invoiceUrl) {
        toast.success(
          <div>
            Berhasil! <a href={data.invoiceUrl} target="_blank" className="underline font-bold text-blue-600">Buka Invoice Test</a>
          </div>,
          { duration: 10000 }
        );
      } else {
        toast.error(`Gagal: ${data.error || "Cek kredensial Anda"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memanggil API");
    } finally {
      setTestingXendit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            Sistem Pembayaran
          </h1>
        </div>
        <p className="text-gray-600 font-poppins">
          Konfigurasi payment gateway, mata uang, dan pajak sistem.
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-10">
        {/* Currency Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins border-b pb-2">
            Pengaturan Umum
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Mata Uang Default
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white"
              >
                <option value="IDR">IDR - Indonesian Rupiah</option>
                <option value="USD">USD - US Dollar</option>
                <option value="SGD">SGD - Singapore Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Persentase Pajak (%)
              </label>
              <input
                type="number"
                value={settings.taxPercentage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxPercentage: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div>
          <div className="border-b pb-2 mb-4">
            <h2 className="text-lg font-bold text-gray-900 font-poppins">
              Integrasi Payment Gateway
            </h2>
            <p className="text-xs text-gray-500 font-poppins mt-0.5">
              Aktifkan dan konfigurasi gateway pembayaran yang ingin digunakan di website.
            </p>
          </div>
          <div className="space-y-6">


            {/* Xendit */}
            <div className={`p-5 border rounded-xl transition-colors ${settings.enableXendit ? "border-blue-200 bg-blue-50/30" : "border-gray-200"}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-poppins">
                    Xendit
                  </h3>
                  <p className="text-sm text-gray-500 font-poppins">
                    Payment gateway Indonesia (QRIS, Virtual Account, E-Wallet, Retail, PayLater).
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableXendit}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableXendit: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Aktifkan</span>
                </label>
              </div>

              {settings.enableXendit && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-white p-4 rounded-lg border border-gray-100">
                  <div className="sm:col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Mode Environment</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <select
                        value={settings.isXenditProduction ? "production" : "sandbox"}
                        onChange={(e) => setSettings({ ...settings, isXenditProduction: e.target.value === "production" })}
                        className="text-sm border-gray-300 rounded-md font-medium text-gray-700 focus:ring-blue-500"
                      >
                        <option value="sandbox">Sandbox (Development / Test)</option>
                        <option value="production">Production (Live)</option>
                      </select>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Secret Key (xnd_development_... / xnd_production_...)</label>
                    <input
                      type="password"
                      placeholder="xnd_development_..."
                      value={settings.xenditSecretKey || ""}
                      onChange={(e) => setSettings({ ...settings, xenditSecretKey: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Public Key (Opsional)</label>
                    <input
                      type="text"
                      placeholder="xnd_public_..."
                      value={settings.xenditPublicKey || ""}
                      onChange={(e) => setSettings({ ...settings, xenditPublicKey: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Webhook Verification Token</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={settings.xenditWebhookToken || ""}
                      onChange={(e) => setSettings({ ...settings, xenditWebhookToken: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2 mt-2 flex justify-end">
                    <button
                      onClick={handleTestXendit}
                      disabled={testingXendit || !settings.xenditSecretKey}
                      className="text-xs px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {testingXendit ? (
                        <>
                          <div className="w-3 h-3 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                          Mengetes...
                        </>
                      ) : (
                        "Test Koneksi Xendit"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>


          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900 font-poppins">
              Catatan Keamanan (Security Notice)
            </p>
            <p className="text-sm text-blue-800 mt-1 font-poppins leading-relaxed">
              API keys ini disimpan dengan aman di database. Pastikan Anda tidak membagikan <strong>Secret Key / Server Key / Private Key</strong> kepada siapapun.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors font-poppins shadow-sm"
        >
          <Save size={18} />
          {saving ? "Menyimpan Pengaturan..." : "Simpan Pengaturan Pembayaran"}
        </button>
      </div>
    </div>
  );
}
