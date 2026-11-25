"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { MessageSquare, Save, Zap, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LiveChatSettings {
  enabled: boolean;
  aiProvider: "deepseek" | "gemini" | "openai" | "anthropic" | "custom";
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
    aiProvider: "deepseek",
    model: "deepseek-chat",
    systemPrompt: `Anda adalah 'Guwigo Assistant', representasi AI cerdas dari PT Guwigo Teknologi Indonesia (Software House & Konsultan IT).
Tugas Utama Anda:
1. Menyapa pengunjung website dengan ramah, profesional, dan sedikit hangat.
2. Menjawab pertanyaan seputar layanan IT (Pembuatan Web, Aplikasi Mobile Next.js/Flutter, Sistem Enterprise, UI/UX, Igovent).
3. JANGAN memberikan janji harga mati. Selalu gunakan istilah "mulai dari" (misal: "Web custom mulai dari Rp 15 Juta").
4. Jika klien terlihat tertarik atau butuh diskusi mendalam, arahkan mereka untuk menghubungi tim secara langsung via WhatsApp: +62 851-7959-4146.
5. Jawaban HARUS singkat, padat, dan tidak bertele-tele (maksimal 2-3 paragraf pendek). Jangan gunakan format Markdown berlebihan, gunakan teks biasa/bold yang mudah dibaca di layar chat kecil.`,
    maxContextMessages: 6,
    responseTimeout: 30,
    enableEmailNotification: true,
    adminEmail: "admin@guwigo.com",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, "systemSettings", "liveChat");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<LiveChatSettings>;
        setSettings((prev) => ({
          ...prev,
          ...data,
          aiProvider: (data.aiProvider || "deepseek") as any,
          model: data.model || (data.aiProvider === "gemini" ? "gemini-1.5-flash" : "deepseek-chat"),
        }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (newProvider: LiveChatSettings["aiProvider"]) => {
    let defaultModel = "deepseek-chat";
    if (newProvider === "gemini") defaultModel = "gemini-1.5-flash";
    else if (newProvider === "openai") defaultModel = "gpt-4o-mini";
    else if (newProvider === "anthropic") defaultModel = "claude-3-5-sonnet-20241022";
    else if (newProvider === "custom") defaultModel = "custom-model";

    setSettings({
      ...settings,
      aiProvider: newProvider,
      model: defaultModel,
    });
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

  const handleTestChat = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Halo, apa saja layanan Guwigo?" }],
        }),
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setTestResult({
          success: true,
          message: data.result,
        });
        toast.success("Guwigo Assistant merespon dengan sukses!");
      } else {
        setTestResult({
          success: false,
          message: data.error || "Gagal mendapatkan respon dari asisten.",
        });
        toast.error("Gagal mendapatkan balasan.");
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Gagal menghubungi server chat.",
      });
      toast.error("Terjadi kesalahan saat menguji asisten.");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare size={30} className="text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins">
            Live Chat AI (Guwigo Assistant)
          </h1>
        </div>
        <p className="text-gray-600 text-sm font-poppins">
          Konfigurasi asisten virtual otomatis 24/7 untuk konsultasi dan konversi klien di website Guwigo.
        </p>
      </div>

      {/* Info Banner Fallback System */}
      <div className="mb-6 p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3">
        <Zap size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed font-sans">
          <p className="font-semibold text-blue-950 mb-1">
            Sistem Ban Serep (Intelligent Resilience):
          </p>
          Guwigo Assistant kini dilengkapi dengan <strong>Built-in Knowledge Engine</strong>. Jika API Key eksternal kosong, belum diisi, kuota habis, atau server AI mengalami downtime, asisten <strong>tetap aktif menjawab pertanyaan klien secara cerdas</strong> seputar produk, estimasi biaya, alur kerja, dan kontak WhatsApp tanpa mengalami error koneksi.
        </div>
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
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-base font-semibold text-gray-900 font-poppins">
              Aktifkan Guwigo Assistant di Website
            </span>
          </label>
        </div>

        {settings.enabled && (
          <>
            {/* AI Provider Settings */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4 font-poppins">
                Penyedia AI & Model (AI Provider)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 font-poppins">
                    Provider
                  </label>
                  <select
                    value={settings.aiProvider}
                    onChange={(e) => handleProviderChange(e.target.value as any)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm text-gray-900 bg-white"
                  >
                    <option value="deepseek">DeepSeek (Rekomendasi - Cepat & Ekonomis)</option>
                    <option value="gemini">Google Gemini (Gemini 1.5 Flash / 2.0)</option>
                    <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                    <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                    <option value="custom">Custom API Endpoint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 font-poppins">
                    Nama Model
                  </label>
                  <input
                    type="text"
                    value={settings.model}
                    onChange={(e) =>
                      setSettings({ ...settings, model: e.target.value })
                    }
                    placeholder="deepseek-chat, gemini-1.5-flash, gpt-4o-mini..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm text-gray-900 bg-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider font-poppins">
                      API Key
                    </label>
                    <span className="text-[11px] text-gray-500">
                      {settings.aiProvider === "deepseek" && "Dapatkan di platform.deepseek.com"}
                      {settings.aiProvider === "gemini" && "Dapatkan gratis di aistudio.google.com"}
                      {settings.aiProvider === "openai" && "Dapatkan di platform.openai.com"}
                    </span>
                  </div>
                  <input
                    type="password"
                    value={settings.apiKey || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, apiKey: e.target.value })
                    }
                    placeholder="Masukkan API Key (sk-... / AIza...)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm text-gray-900 bg-white placeholder-gray-400"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Jika dikosongkan, sistem akan mencoba membaca variable di <code>.env.local</code> atau beralih ke <strong>Built-in Knowledge Engine</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4 font-poppins">
                Instruksi Perilaku AI (System Prompt)
              </h2>
              <div>
                <textarea
                  value={settings.systemPrompt}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      systemPrompt: e.target.value,
                    })
                  }
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs text-gray-900 bg-slate-50 placeholder-gray-400 leading-relaxed"
                />
                <p className="text-xs text-gray-500 mt-1.5 font-poppins">
                  Panduan persona dan aturan bisnis bagi Guwigo Assistant saat berinteraksi dengan calon klien.
                </p>
              </div>
            </div>

            {/* Test Connection Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 font-poppins">
                    Uji Respon Guwigo Assistant
                  </h3>
                  <p className="text-xs text-gray-500">
                    Kirim pesan simulasi ke server chat untuk memastikan asisten aktif.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestChat}
                  disabled={testing}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg text-xs font-medium transition-colors shadow-sm disabled:opacity-60"
                >
                  {testing ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-blue-600" />
                      Menguji...
                    </>
                  ) : (
                    <>
                      <Zap size={14} className="text-amber-500" />
                      Uji Sekarang
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs border ${
                    testResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold mb-1">
                    {testResult.success ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Asisten Berhasil Merespon:
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={14} className="text-amber-600" />
                        Status:
                      </>
                    )}
                  </div>
                  <p className="whitespace-pre-line text-slate-700 bg-white/70 p-2.5 rounded border border-black/5 mt-1">
                    {testResult.message}
                  </p>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4 font-poppins">
                Notifikasi Admin
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
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 font-poppins">
                    Aktifkan notifikasi email saat ada klien butuh eskalasi ke manusia
                  </span>
                </label>

                {settings.enableEmailNotification && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 font-poppins">
                      Email Tujuan Admin
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm text-gray-900 bg-white placeholder-gray-400"
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
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors font-poppins shadow-md shadow-blue-500/20"
        >
          <Save size={18} />
          {saving ? "Menyimpan..." : "Simpan Pengaturan Live Chat"}
        </button>
      </div>
    </div>
  );
}
