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

  // --- FUNGSI AKSI DOKUMEN ---

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    // Mengambil elemen HTML dari proposal
    const content =
      document.getElementById("proposal-content")?.innerHTML || "";
    // Menambahkan header khusus agar dikenali oleh MS Word
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Proposal Solusi IT</title></head><body style='font-family: Arial, sans-serif;'>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;

    // Convert ke Blob DOC
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

    // Import dinamis html2pdf hanya saat tombol diklik (menghindari error SSR Next.js)
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

  // --- PARSER TAMPILAN ---

  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#0B1324",
              marginTop: "24px",
              marginBottom: "12px",
              borderBottom: "2px solid #f1f5f9",
              paddingBottom: "8px",
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
              marginLeft: "20px",
              marginBottom: "8px",
              color: "#334155",
            }}
          >
            {parts.map((part, i) =>
              part.startsWith("**") ? (
                <strong key={i} style={{ color: "#0f172a" }}>
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              ),
            )}
          </li>
        );
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p
          key={index}
          style={{ marginBottom: "12px", color: "#334155", lineHeight: "1.6" }}
        >
          {parts.map((part, i) =>
            part.startsWith("**") ? (
              <strong key={i} style={{ color: "#0f172a" }}>
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
    <div className="min-h-screen bg-[#09090B] font-sans py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00D4FF]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-4 border border-[#00D4FF]/20">
            Guwigo Enterprise Tools
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            AI Proposal Architect
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Sistem analisis cerdas untuk merumuskan arsitektur IT. Isi detail
            parameter di bawah, dan AI Guwigo akan menyusun draf proposal solusi
            teknis secara instan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CONTROL PANEL FORM */}
          <div className="lg:col-span-5 bg-[#18181B] border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#00D4FF]">
                <Building size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Parameter Bisnis
                </h2>
                <p className="text-xs text-slate-400">
                  Deskripsikan profil & kendala klien
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                  Bidang Industri / Bisnis{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="Contoh: Klinik Kesehatan, Logistik..."
                  className="w-full bg-[#09090B] border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                  Kondisi Sistem Saat Ini
                </label>
                <input
                  type="text"
                  name="currentSystem"
                  value={formData.currentSystem}
                  onChange={handleInputChange}
                  placeholder="Contoh: Masih pakai kertas & Excel manual..."
                  className="w-full bg-[#09090B] border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                  Masalah Utama (Pain Points){" "}
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="painPoints"
                  value={formData.painPoints}
                  onChange={handleInputChange}
                  placeholder="Contoh: Data sering hilang, laporan lambat..."
                  className="w-full h-24 bg-[#09090B] border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00D4FF] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                  Ekspektasi / Target Solusi
                </label>
                <textarea
                  name="expectation"
                  value={formData.expectation}
                  onChange={handleInputChange}
                  placeholder="Contoh: Aplikasi mobile & dashboard web..."
                  className="w-full h-24 bg-[#09090B] border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00D4FF] resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle
                    className="text-red-400 shrink-0 mt-0.5"
                    size={16}
                  />
                  <p className="text-xs text-red-400 leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isLoading || !formData.industry || !formData.painPoints
                }
                className={`w-full py-4 mt-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                  ${
                    isLoading || !formData.industry || !formData.painPoints
                      ? "bg-white/5 text-slate-500 cursor-not-allowed"
                      : "bg-[#00D4FF] hover:bg-white text-[#0B1324] shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Meracik Arsitektur Solusi...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Generate AI Proposal
                  </>
                )}
              </button>
            </form>
          </div>

          {/* KERTAS PROPOSAL */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-2xl min-h-[700px] flex flex-col overflow-hidden relative border border-slate-200">
            {/* Header Dokumen & Tombol Aksi */}
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={24} />
                <div>
                  <h2 className="text-lg font-black text-[#0B1324] leading-tight">
                    Draf Dokumen Solusi
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    CONFIDENTIAL • GUWIGO INDONESIA
                  </p>
                </div>
              </div>

              {proposalResult && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    {copied ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}{" "}
                    {copied ? "Disalin" : "Salin"}
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <FileDown size={14} /> DOCX
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <Download size={14} /> PDF
                  </button>
                </div>
              )}
            </div>

            {/* Area Konten Dokumen */}
            <div className="flex-1 p-8 overflow-y-auto bg-white custom-scrollbar relative">
              {!proposalResult && !isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <FileText size={48} className="mb-4 text-slate-400" />
                  <p className="text-sm font-bold text-slate-500 max-w-xs">
                    Ruang kerja proposal. Isi parameter bisnis di samping untuk
                    melihat hasil analisis.
                  </p>
                </div>
              ) : isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <Building
                      className="text-blue-500 animate-pulse"
                      size={20}
                    />
                  </div>
                  <p className="text-sm text-blue-600 font-bold animate-pulse">
                    Guwigo Assistant sedang menyusun strategi...
                  </p>
                </div>
              ) : (
                // id="proposal-content" sangat penting! Ini yang akan ditangkap oleh tombol PDF & Word
                <div id="proposal-content" className="relative z-10 px-2">
                  {/* Kop Surat Sederhana (Hanya muncul saat didownload / print) */}
                  <div
                    style={{
                      borderBottom: "2px solid #00D4FF",
                      paddingBottom: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: "900",
                        color: "#0B1324",
                        margin: 0,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                      }}
                    >
                      GUWIGO
                    </h1>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        margin: "4px 0 0 0",
                      }}
                    >
                      IT Consultant & Software Development
                    </p>
                  </div>

                  {/* Konten Utama dari AI */}
                  {formatMarkdown(proposalResult)}

                  {/* Signature Penutup */}
                  <div
                    style={{
                      marginTop: "48px",
                      paddingTop: "24px",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#0B1324",
                        margin: 0,
                      }}
                    >
                      Tim Engineering Guwigo
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Dibuat otomatis menggunakan Sistem Analisis AI Guwigo.
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
