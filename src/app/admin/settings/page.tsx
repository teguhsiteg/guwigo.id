"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Settings, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  supportPhone: string;
  businessHours: string;
  maintenanceMode: boolean;
  autoBackup: boolean;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings>({
    siteName: "Guwigo Indonesia",
    siteDescription: "Building Digital Civilizations",
    supportEmail: "support@guwigo.com",
    supportPhone: "+62 812 3456 7890",
    businessHours: "Monday - Friday, 09:00 - 18:00 WIB",
    maintenanceMode: false,
    autoBackup: true,
    socialLinks: {
      instagram: "https://instagram.com/guwigo",
      facebook: "",
      twitter: "",
      linkedin: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, "systemSettings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as GeneralSettings);
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
      const docRef = doc(db, "systemSettings", "general");
      await setDoc(docRef, settings, { merge: true });
      toast.success("Pengaturan umum berhasil disimpan");
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
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            General Settings
          </h1>
        </div>
        <p className="text-gray-600 font-poppins">
          Configure general website and business settings
        </p>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Site Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 font-poppins">
            Site Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
              Site Description / Tagline
            </label>
            <input
              type="text"
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  siteDescription: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 font-poppins">
            Contact Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
              Support Email
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
              Support Phone
            </label>
            <input
              type="tel"
              value={settings.supportPhone}
              onChange={(e) =>
                setSettings({ ...settings, supportPhone: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
              Business Hours
            </label>
            <input
              type="text"
              value={settings.businessHours}
              onChange={(e) =>
                setSettings({ ...settings, businessHours: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 font-poppins">
            Social Media Links
          </h2>

          {Object.keys(settings.socialLinks).map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize font-poppins">
                {platform}
              </label>
              <input
                type="url"
                value={
                  settings.socialLinks[
                    platform as keyof typeof settings.socialLinks
                  ] || ""
                }
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      [platform]: e.target.value,
                    },
                  })
                }
                placeholder={`https://${platform}.com/yourusername`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
          ))}
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 font-poppins">
            System Settings
          </h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenanceMode: e.target.checked,
                })
              }
              className="w-4 h-4"
            />
            <div>
              <p className="text-sm font-medium text-gray-700 font-poppins">
                Maintenance Mode
              </p>
              <p className="text-xs text-gray-500 font-poppins">
                Disable access for all users
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) =>
                setSettings({ ...settings, autoBackup: e.target.checked })
              }
              className="w-4 h-4"
            />
            <div>
              <p className="text-sm font-medium text-gray-700 font-poppins">
                Auto Backup
              </p>
              <p className="text-xs text-gray-500 font-poppins">
                Automatic daily backups
              </p>
            </div>
          </label>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle
            size={20}
            className="text-blue-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-medium text-blue-900 font-poppins">
              System Tip
            </p>
            <p className="text-sm text-blue-800 mt-1 font-poppins">
              Changes are automatically saved to the database. All system
              settings are stored securely.
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
          {saving ? "Saving..." : "Save General Settings"}
        </button>
      </div>
    </div>
  );
}
