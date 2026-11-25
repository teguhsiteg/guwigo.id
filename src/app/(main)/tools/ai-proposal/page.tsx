"use client";

import { useState } from "react";
import {
  Wand2,
  Loader2,
  FileText,
  Building,
  AlertCircle,
  Copy,
  CheckCircle2,
  FileDown,
  Download,
} from "lucide-react";

export default function AIProposalGeneratorPage() {
  const [formData, setFormData] = useState({
    industry: "",
    currentSystem: "",
    painPoints: "",
    expectation: "",
  });

  const [proposalResult, setProposalResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.industry || !formData.painPoints) {
      setError("Mohon isi minimal bidang industri dan masalah utama Anda.");
      return;
    }

    setIsLoading(true);
    setError("");
    setProposalResult("");
    setCopied(false);

    const combinedPrompt = `
      Detail Profil Klien:
      - Bidang Industri/Bisnis: ${formData.industry}
      - Kondisi Sistem Saat Ini: ${formData.currentSystem || "Belum ada sistem terkomputerisasi/Masih sangat manual."}
      - Masalah Utama (Pain Points): ${formData.painPoints}
      - Ekspektasi/Harapan Solusi: ${formData.expectation || "Menginginkan sistem yang otomatis, aman, dan dapat diskalakan."}
    `;

    try {
      const res = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemDescription: combinedPrompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghasilkan proposal");
      setProposalResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    const content =
      document.getElementById("proposal-content")?.innerHTML || "";
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Proposal Solusi IT - Guwigo</title></head><body style='font-family: Arial, sans-serif;'>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;

    const source =
      "data:application/vnd.ms-word;charset=utf-8," +
      encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = "Proposal_Solusi_Guwigo.doc";
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById("proposal-content");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;
    const opt: any = {
      margin: 15,
      filename: "Proposal_Solusi_Guwigo.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            style={{
              fontSize: "17px",
              fontWeight: "600",
              color: "#0F172A",
              marginTop: "24px",
              marginBottom: "10px",
              borderBottom: "1.5px solid #E2E8F0",
              paddingBottom: "6px",
            }}
          >
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("- ")) {
        const parts = line.replace("- ", "").split(/(\*\*.*?\*\*)/g);
        return (
          <li
            key={index}
            style={{
              marginLeft: "18px",
              marginBottom: "6px",
              color: "#334155",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i} style={{ color: "#0F172A", fontWeight: "600" }}>
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              ),
            )}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={index} style={{ height: "8px" }} />;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p
          key={index}
          style={{
            color: "#475569",
            fontSize: "13px",
            lineHeight: "1.6",
            marginBottom: "8px",
          }}
        >
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} style={{ color: "#0F172A", fontWeight: "600" }}>
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            ),
          )}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pt-36 md:pt-44 pb-24 px-4 sm:px-6 relative overflow-hidden selection:bg-[#2563EB]/15 selection:text-[#0F172A]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#2563EB]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-medium text-[#1D4ED8] mb-6 shadow-sm">
            <Wand2 size={13} className="text-[#2563EB]" /> AI Enterprise Architecture Tool
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0F172A] mb-5 tracking-tight leading-[1.1] font-normal">
            AI Proposal <br />
            <span className="italic text-[#2563EB]">Architect.</span>
          </h1>
          <p className="text-base md:text-lg text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Sistem analisis arsitektur cerdas untuk menyusun draf proposal solusi digital tingkat enterprise secara instan, lengkap dengan estimasi investasi dan proyeksi ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CONTROL PANEL FORM */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Building size={18} />
              </div>
              <div>
                <h2 className="text-base font-serif font-normal text-[#0F172A] tracking-tight">
                  Parameter Bisnis
                </h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Deskripsikan profil & tantangan operasional klien
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Bidang Industri / Bisnis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="Contoh: Klinik Kesehatan, Logistik, Retail..."
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Kondisi Sistem Saat Ini
                </label>
                <input
                  type="text"
                  name="currentSystem"
                  value={formData.currentSystem}
                  onChange={handleInputChange}
                  placeholder="Contoh: Masih pakai kertas & spreadsheet manual..."
                  className="w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Masalah Utama (Pain Points) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="painPoints"
                  value={formData.painPoints}
                  onChange={handleInputChange}
                  placeholder="Contoh: Data sering redundan, antrean membeludak, rekonsiliasi kasir lambat..."
                  className="w-full h-24 bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all resize-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Ekspektasi / Target Solusi
                </label>
                <textarea
                  name="expectation"
                  value={formData.expectation}
                  onChange={handleInputChange}
                  placeholder="Contoh: Aplikasi mobile pasien & dashboard integrasi kasir otomatis..."
                  className="w-full h-20 bg-[#FAF9F6] border border-[#E2E8F0] rounded-lg p-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5">
                  <AlertCircle
                    className="text-red-500 shrink-0 mt-0.5"
                    size={15}
                  />
                  <p className="text-xs text-red-700 leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isLoading || !formData.industry || !formData.painPoints
                }
                className="w-full py-3.5 mt-2 rounded-lg font-medium text-xs tracking-wide transition-all flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Merumuskan Solusi Arsitektur...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    Rancang AI Proposal
                  </>
                )}
              </button>
            </form>
          </div>

          {/* KERTAS PROPOSAL */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm min-h-[650px] flex flex-col overflow-hidden border border-[#E2E8F0]">
            {/* Header Dokumen & Tombol Aksi */}
            <div className="bg-[#FAF9F6] border-b border-[#E2E8F0] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <FileText className="text-[#2563EB]" size={20} />
                <div>
                  <h2 className="text-sm font-semibold text-[#0F172A] leading-tight">
                    Draf Dokumen Solusi
                  </h2>
                  <p className="text-[10px] text-[#64748B] font-mono mt-0.5">
                    CONFIDENTIAL • PT GUWIGO TEKNOLOGI INDONESIA
                  </p>
                </div>
              </div>

              {proposalResult && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
                  >
                    {copied ? (
                      <CheckCircle2 size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} />
                    )}{" "}
                    {copied ? "Tersalin" : "Salin"}
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-blue-100 text-[#1D4ED8] px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
                  >
                    <FileDown size={13} /> DOCX
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
                  >
                    <Download size={13} /> PDF
                  </button>
                </div>
              )}
            </div>

            {/* Area Konten Dokumen */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white relative">
              {!proposalResult && !isLoading ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center text-[#94A3B8]">
                  <FileText size={40} className="mb-3 text-[#CBD5E1]" />
                  <p className="text-xs text-[#64748B] max-w-xs font-medium">
                    Ruang kerja proposal. Isi parameter bisnis di panel samping untuk menyusun cetak biru arsitektur.
                  </p>
                </div>
              ) : isLoading ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="relative w-12 h-12 flex items-center justify-center mb-4">
                    <Loader2 size={36} className="text-[#2563EB] animate-spin" />
                  </div>
                  <p className="text-xs text-[#2563EB] font-medium animate-pulse">
                    Guwigo Assistant sedang menyusun strategi arsitektur...
                  </p>
                </div>
              ) : (
                <div id="proposal-content" className="relative z-10 px-1">
                  {/* Kop Surat Dokumen */}
                  <div
                    style={{
                      borderBottom: "2px solid #2563EB",
                      paddingBottom: "14px",
                      marginBottom: "20px",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#0F172A",
                        margin: 0,
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                      }}
                    >
                      PT GUWIGO TEKNOLOGI INDONESIA
                    </h1>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#64748B",
                        margin: "3px 0 0 0",
                      }}
                    >
                      Enterprise IT Architecture & Digital Ecosystem Consultant
                    </p>
                  </div>

                  {/* Konten Utama */}
                  {formatMarkdown(proposalResult)}

                  {/* Signature Penutup */}
                  <div
                    style={{
                      marginTop: "40px",
                      paddingTop: "20px",
                      borderTop: "1px solid #E2E8F0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#0F172A",
                        margin: 0,
                      }}
                    >
                      Tim Engineering & Arsitektur Solusi
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#64748B",
                        margin: "3px 0 0 0",
                      }}
                    >
                      Diverifikasi otomatis melalui Guwigo Proposal Engine • Yogyakarta, Indonesia.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
