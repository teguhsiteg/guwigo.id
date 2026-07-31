"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { MessageSquare, Save } from "lucide-react";
import { toast } from "sonner";

interface LiveChatSettings {
  enabled: boolean;
  aiProvider: "openai" | "anthropic" | "custom";
  apiKey?: string;
  model: string;
  systemPrompt: string;
  maxContextMessages: number;
  responseTimeout: number;
  enableEmailNotification: boolean;
  adminEmail: string;
}

export default function LiveChatSettingsPage() {
  const [settings, setSettings] = useState<LiveChatSettings>({
    enabled: true,
    aiProvider: "openai",
    model: "gpt-3.5-turbo",
    systemPrompt: `Anda adalah CS profesional dari Guwigo Indonesia. Anda membantu customer dengan pertanyaan mereka tentang layanan, produk, dan general inquiries.

INSTRUKSI PENTING:
- Selalu ramah dan profesional
- Jika customer ingin berbicara dengan admin, kasih tahu bahwa admin akan segera menghubungi
- Jangan memberikan informasi sensitif atau rahasia perusahaan
- Untuk masalah teknis yang kompleks, instruksikan customer untuk menghubungi admin
- Gunakan Bahasa Indonesia yang baik
- Respon harus singkat dan clear (max 2-3 kalimat)
- Jika customer memberikan telepon atau email untuk dikontak, save di database

Ketika customer mengatakan "hubungi cs" atau ingin berbicara dengan admin LANGSUNG:
- Reply: "Baik! Admin saya akan segera menghubungi Anda. Berapa nomor telepon atau email Anda yang bisa kami gunakan untuk menghubungi Anda?"
- Collect contact info dan tandai chat sebagai ESCALATED_TO_ADMIN`,
    maxContextMessages: 10,
    responseTimeout: 30,
    enableEmailNotification: true,
    adminEmail: "admin@guwigo.com",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, "systemSettings", "liveChat");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as LiveChatSettings);
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
      const docRef = doc(db, "systemSettings", "liveChat");
      await setDoc(docRef, settings, { merge: true });
      toast.success("Pengaturan live chat berhasil disimpan");
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
          <MessageSquare size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            Live Chat AI
          </h1>
        </div>
        <p className="text-gray-600 font-poppins">
          Configure AI-powered customer support chat
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
        {/* Enable/Disable */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) =>
                setSettings({ ...settings, enabled: e.target.checked })
              }
              className="w-5 h-5"
            />
            <span className="text-lg font-semibold text-gray-900 font-poppins">
              Enable Live Chat
            </span>
          </label>
        </div>

        {settings.enabled && (
          <>
            {/* AI Provider Settings */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                AI Provider
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Provider
                  </label>
                  <select
                    value={settings.aiProvider}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        aiProvider: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white"
                  >
                    <option value="openai">OpenAI (GPT-4 / GPT-3.5)</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="custom">Custom API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Model
                  </label>
                  <input
                    type="text"
                    value={settings.model}
                    onChange={(e) =>
                      setSettings({ ...settings, model: e.target.value })
                    }
                    placeholder="gpt-3.5-turbo, gpt-4, claude-instant, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={settings.apiKey || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, apiKey: e.target.value })
                    }
                    placeholder="Enter your API key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                AI Behavior
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  System Prompt
                </label>
                <textarea
                  value={settings.systemPrompt}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      systemPrompt: e.target.value,
                    })
                  }
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm text-gray-900 bg-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2 font-poppins">
                  Instruksi yang diberikan kepada AI tentang bagaimana
                  berperilaku. Anda bisa customize sesuai kebutuhan.
                </p>
              </div>
            </div>

            {/* Chat Behavior */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                Chat Behavior
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Max Context Messages
                  </label>
                  <input
                    type="number"
                    value={settings.maxContextMessages}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxContextMessages: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    min="1"
                    max="50"
                  />
                  <p className="text-xs text-gray-500 mt-1 font-poppins">
                    Jumlah pesan sebelumnya yang AI gunakan sebagai konteks
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Response Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.responseTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        responseTimeout: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    min="5"
                    max="120"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                Notifications
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableEmailNotification}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableEmailNotification: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700 font-poppins">
                    Enable Email Notifications for Escalated Chats
                  </span>
                </label>

                {settings.enableEmailNotification && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          adminEmail: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors font-poppins"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Live Chat Settings"}
        </button>
      </div>
    </div>
  );
}
