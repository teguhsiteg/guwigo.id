"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CreditCard, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentSettings {
  stripeKey?: string;
  midtransKey?: string;
  tripayKey?: string;
  enableStripe: boolean;
  enableMidtrans: boolean;
  enableTripay: boolean;
  currency: string;
  taxPercentage: number;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({
    stripeKey: "",
    midtransKey: "",
    tripayKey: "",
    enableStripe: true,
    enableMidtrans: true,
    enableTripay: true,
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
        setSettings(docSnap.data() as PaymentSettings);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            Payment System
          </h1>
        </div>
        <p className="text-gray-600 font-poppins">
          Configure payment gateway settings and currencies
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
        {/* Currency Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
            Currency Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Default Currency
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
                Tax Percentage (%)
              </label>
              <input
                type="number"
                value={settings.taxPercentage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxPercentage: parseFloat(e.target.value),
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
            Payment Gateways
          </h2>
          <div className="space-y-4">
            {/* Stripe */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 font-poppins">
                    Stripe
                  </h3>
                  <p className="text-sm text-gray-500 font-poppins">
                    International credit card payments
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableStripe}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableStripe: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                </label>
              </div>
              {settings.enableStripe && (
                <input
                  type="password"
                  placeholder="Enter Stripe Secret Key"
                  value={settings.stripeKey || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, stripeKey: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm text-gray-900 bg-white placeholder-gray-500"
                />
              )}
            </div>

            {/* Midtrans */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 font-poppins">
                    Midtrans
                  </h3>
                  <p className="text-sm text-gray-500 font-poppins">
                    Indonesian payment aggregator
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableMidtrans}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableMidtrans: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                </label>
              </div>
              {settings.enableMidtrans && (
                <input
                  type="password"
                  placeholder="Enter Midtrans Server Key"
                  value={settings.midtransKey || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, midtransKey: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm text-gray-900 bg-white placeholder-gray-500"
                />
              )}
            </div>

            {/* Tripay */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 font-poppins">
                    Tripay
                  </h3>
                  <p className="text-sm text-gray-500 font-poppins">
                    Bank transfers & e-wallets
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableTripay}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableTripay: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                </label>
              </div>
              {settings.enableTripay && (
                <input
                  type="password"
                  placeholder="Enter Tripay API Key"
                  value={settings.tripayKey || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, tripayKey: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm text-gray-900 bg-white placeholder-gray-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle
            size={20}
            className="text-blue-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-medium text-blue-900 font-poppins">
              Security Notice
            </p>
            <p className="text-sm text-blue-800 mt-1 font-poppins">
              API keys are encrypted. Never share your secret keys with anyone.
              Always use environment variables in production.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors font-poppins"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Payment Settings"}
        </button>
      </div>
    </div>
  );
}
