"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  FileSpreadsheet,
  Save,
  Building2,
  CreditCard,
  Stamp,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Type,
  Palette,
  Maximize2,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input, Textarea } from "@/components/ui/Input";
import Card, { CardHeader } from "@/components/ui/Card";
import { toast } from "sonner";
import Image from "next/image";

export interface InvoiceSettings {
  companyName: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logoUrl: string;
  stampUrl: string;
  signatureUrl: string;
  signerName: string;
  signerTitle: string;
  bankAccounts: string;
  invoiceFooterNote: string;
  // Typography & Styling Options
  fontFamily?: string;
  fontSize?: "compact" | "normal" | "large";
  primaryColor?: string;
  // Image sizing & positioning
  logoWidth?: number;
  logoHeight?: number;
  stampSize?: number;
  stampRotation?: number;
  signatureWidth?: number;
  signatureHeight?: number;
}

export const defaultInvoiceSettings: InvoiceSettings = {
  companyName: "PT GUWIGO TEKNOLOGI INDONESIA",
  tagline: "Software House & Enterprise Digital Solutions",
  address: "Yogyakarta, D.I. Yogyakarta, Indonesia",
  email: "billing@guwigo.com",
  phone: "+62 812-0000-0000",
  website: "https://guwigo.com",
  logoUrl: "/images/branding/logo-guwigo-new.png",
  stampUrl: "/images/branding/stempel.png",
  signatureUrl: "/images/branding/ttd-finance.png",
  signerName: "PT Guwigo Teknologi Indonesia",
  signerTitle: "Bagian Keuangan / Finance",
  bankAccounts: "Bank Mandiri / Bank BCA\na.n. PT Guwigo Teknologi Indonesia\n(Rekening Perusahaan)",
  invoiceFooterNote: "Invoice ini sah dan diproses otomatis oleh Guwigo Billing System.",
  // Default Typography & Styling
  fontFamily: "font-sans",
  fontSize: "normal",
  primaryColor: "#2563eb",
  logoWidth: 144,
  logoHeight: 36,
  stampSize: 144,
  stampRotation: -14,
  signatureWidth: 128,
  signatureHeight: 72,
};

export default function InvoiceSettingsPage() {
  const [settings, setSettings] = useState<InvoiceSettings>(defaultInvoiceSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const docRef = doc(db, "admin", "invoice-settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings({ ...defaultInvoiceSettings, ...docSnap.data() });
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat pengaturan invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const docRef = doc(db, "admin", "invoice-settings");
      await setDoc(docRef, settings, { merge: true });
      toast.success("Pengaturan invoice & kuitansi berhasil disimpan!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Memuat Pengaturan Invoice...
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileSpreadsheet size={22} />
            </div>
            Pengaturan Invoice & Kuitansi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kustomisasi profil perusahaan, rekening pembayaran, logo, stempel, dan tanda tangan
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Perusahaan */}
        <Card>
          <CardHeader
            title="Identitas Perusahaan (Kop Dokumen)"
            subtitle="Informasi yang tampil di bagian atas invoice dan kuitansi"
            icon={<Building2 size={20} />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Perusahaan / Bisnis *"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              required
            />
            <Input
              label="Tagline / Bidang Usaha"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
            <Input
              label="Email Billing / Keuangan"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
            <Input
              label="Nomor Telepon / WhatsApp"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Alamat Lengkap"
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Rekening Pembayaran */}
        <Card>
          <CardHeader
            title="Rekening Pembayaran Bank"
            subtitle="Instruksi transfer yang tercantum di lembar invoice"
            icon={<CreditCard size={20} />}
          />
          <Textarea
            label="Daftar Rekening Bank (Bisa beberapa baris)"
            placeholder="Contoh:&#10;Bank BCA: 1234567890 a.n. PT Guwigo Teknologi&#10;Bank Mandiri: 9876543210 a.n. PT Guwigo Teknologi"
            rows={4}
            value={settings.bankAccounts}
            onChange={(e) => setSettings({ ...settings, bankAccounts: e.target.value })}
          />
          <p className="text-xs text-slate-400 mt-2">
            Teks ini akan otomatis dicetak pada kotak informasi rekening di lembar invoice.
          </p>
        </Card>

        {/* Logo, Stempel & Tanda Tangan */}
        <Card>
          <CardHeader
            title="Logo, Stempel & Tanda Tangan"
            subtitle="Kelola gambar legalitas yang dicetak pada dokumen"
            icon={<Stamp size={20} />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Logo */}
            <div className="space-y-3">
              <Input
                label="Path Logo"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              />
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center h-28 relative">
                {settings.logoUrl ? (
                  <Image
                    src={settings.logoUrl}
                    alt="Preview Logo"
                    width={settings.logoWidth || 144}
                    height={settings.logoHeight || 36}
                    style={{
                      width: `${settings.logoWidth || 144}px`,
                      height: `${settings.logoHeight || 36}px`,
                    }}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Belum ada logo</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Lebar (px)</label>
                  <Input
                    type="number"
                    value={settings.logoWidth ?? 144}
                    onChange={(e) => setSettings({ ...settings, logoWidth: Number(e.target.value) || 144 })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Tinggi (px)</label>
                  <Input
                    type="number"
                    value={settings.logoHeight ?? 36}
                    onChange={(e) => setSettings({ ...settings, logoHeight: Number(e.target.value) || 36 })}
                  />
                </div>
              </div>
            </div>

            {/* Stempel */}
            <div className="space-y-3">
              <Input
                label="Path Stempel"
                value={settings.stampUrl}
                onChange={(e) => setSettings({ ...settings, stampUrl: e.target.value })}
              />
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center h-28 relative overflow-hidden">
                {settings.stampUrl ? (
                  <Image
                    src={settings.stampUrl}
                    alt="Preview Stempel"
                    width={settings.stampSize || 144}
                    height={settings.stampSize || 144}
                    style={{
                      transform: `rotate(${settings.stampRotation ?? -14}deg)`,
                      width: `${(settings.stampSize || 144) * 0.6}px`,
                      height: `${(settings.stampSize || 144) * 0.6}px`,
                    }}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Belum ada stempel</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Ukuran (px)</label>
                  <Input
                    type="number"
                    value={settings.stampSize ?? 144}
                    onChange={(e) => setSettings({ ...settings, stampSize: Number(e.target.value) || 144 })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Derajat Miring (°)</label>
                  <Input
                    type="number"
                    value={settings.stampRotation ?? -14}
                    onChange={(e) => setSettings({ ...settings, stampRotation: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Tanda Tangan */}
            <div className="space-y-3">
              <Input
                label="Path Tanda Tangan (Opsional)"
                placeholder="/images/ttd.png"
                value={settings.signatureUrl}
                onChange={(e) => setSettings({ ...settings, signatureUrl: e.target.value })}
              />
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center h-28 relative">
                {settings.signatureUrl ? (
                  <Image
                    src={settings.signatureUrl}
                    alt="Preview Tanda Tangan"
                    width={settings.signatureWidth || 128}
                    height={settings.signatureHeight || 72}
                    style={{
                      width: `${settings.signatureWidth || 128}px`,
                      height: `${settings.signatureHeight || 72}px`,
                    }}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Tanda Tangan Teks/Manual</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Lebar (px)</label>
                  <Input
                    type="number"
                    value={settings.signatureWidth ?? 128}
                    onChange={(e) => setSettings({ ...settings, signatureWidth: Number(e.target.value) || 128 })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Tinggi (px)</label>
                  <Input
                    type="number"
                    value={settings.signatureHeight ?? 72}
                    onChange={(e) => setSettings({ ...settings, signatureHeight: Number(e.target.value) || 72 })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
            <Input
              label="Jabatan Penandatangan"
              placeholder="Hormat Kami / Bendahara"
              value={settings.signerTitle}
              onChange={(e) => setSettings({ ...settings, signerTitle: e.target.value })}
            />
            <Input
              label="Nama Tertera di Bawah TTD"
              placeholder="PT Guwigo Teknologi Indonesia / Nama Anda"
              value={settings.signerName}
              onChange={(e) => setSettings({ ...settings, signerName: e.target.value })}
            />
          </div>
        </Card>

        {/* Tipografi & Gaya Dokumen Cetak */}
        <Card>
          <CardHeader
            title="Tipografi & Tampilan Dokumen Cetak"
            subtitle="Atur jenis font, skala teks, dan warna aksen utama yang dicetak"
            icon={<Type size={20} />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block">
                Jenis Font (Font Family)
              </label>
              <select
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={settings.fontFamily || "font-sans"}
                onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
              >
                <option value="font-sans">Default Sans-Serif (Modern & Bersih)</option>
                <option value="font-serif">Serif (Formal & Tradisional)</option>
                <option value="font-mono">Monospace (Teknis & Presisi)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Berlaku untuk seluruh teks pada lembar cetak invoice & kuitansi.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block">
                Skala Ukuran Teks
              </label>
              <select
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={settings.fontSize || "normal"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    fontSize: e.target.value as "compact" | "normal" | "large",
                  })
                }
              >
                <option value="compact">Compact (Lebih padat, aman untuk item banyak)</option>
                <option value="normal">Standar / Proporsional (Rekomendasi 1 Lembar)</option>
                <option value="large">Besar / Luwes</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Gunakan Compact jika item layanan panjang agar tetap 1 lembar A4.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block">
                Warna Aksen Dokumen
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                  value={settings.primaryColor || "#2563eb"}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                />
                <Input
                  value={settings.primaryColor || "#2563eb"}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  placeholder="#2563eb"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Warna judul INVOICE dan nominal total tagihan.
              </p>
            </div>
          </div>
        </Card>

        {/* Catatan Kaki */}
        <Card>
          <CardHeader
            title="Catatan Kaki Dokumen"
            subtitle="Teks penutup di bagian bawah lembar cetak"
          />
          <Input
            label="Catatan Kaki (Footer Note)"
            value={settings.invoiceFooterNote}
            onChange={(e) => setSettings({ ...settings, invoiceFooterNote: e.target.value })}
          />
        </Card>

        {/* Tombol Simpan */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" isLoading={isSaving} icon={<Save size={16} />}>
            Simpan Pengaturan Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
