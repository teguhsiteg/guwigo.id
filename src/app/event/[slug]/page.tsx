"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getEventBySlug, EventConfig } from "@/lib/event-config";
import { getEventData } from "@/lib/event-service";
import {
  Flag,
  ArrowRight,
  ArrowLeft,
  Upload,
  Download,
  Share2,
  Trophy,
  Activity,
  User,
  Clock,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EventRaceCardPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [eventConfig, setEventConfig] = useState<EventConfig>(getEventBySlug(resolvedParams.slug));

  useEffect(() => {
    getEventData(resolvedParams.slug).then((data) => {
      if (data) {
        setEventConfig(data);
        if (data.defaultCategory) {
          setSelectedCategory(data.defaultCategory);
        }
      }
    });
  }, [resolvedParams.slug]);

  // State
  const [runnerName, setRunnerName] = useState("TEGUH SITEG");
  const [selectedCategory, setSelectedCategory] = useState(eventConfig.defaultCategory || "21K");
  const [bibNumber, setBibNumber] = useState("21088");
  const [runningClub, setRunningClub] = useState("GUWIGO RUN CLUB");

  const [hour, setHour] = useState("01");
  const [min, setMin] = useState("48");
  const [sec, setSec] = useState("25");
  const [pace, setPace] = useState("05:08");
  const [heartRate, setHeartRate] = useState("158");
  const [isPersonalBest, setIsPersonalBest] = useState(true);

  const [photoImage, setPhotoImage] = useState<HTMLImageElement | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoLayerRef = useRef<HTMLDivElement | null>(null);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Auto calculate pace
  const calculatePace = (hStr: string, mStr: string, sStr: string, cat: string) => {
    const h = parseInt(hStr, 10) || 0;
    const m = parseInt(mStr, 10) || 0;
    const s = parseInt(sStr, 10) || 0;
    const totalSec = h * 3600 + m * 60 + s;

    let km = 21.0975;
    if (cat === "5K") km = 5.0;
    else if (cat === "10K") km = 10.0;
    else if (cat === "42K") km = 42.195;
    else {
      const match = cat.match(/(\d+(\.\d+)?)/);
      if (match) km = parseFloat(match[1]);
    }

    if (totalSec <= 0 || km <= 0) return "05:00";
    const paceSecPerKm = Math.round(totalSec / km);
    const pMin = Math.floor(paceSecPerKm / 60);
    const pSec = paceSecPerKm % 60;
    return `${String(pMin).padStart(2, "0")}:${String(pSec).padStart(2, "0")}`;
  };

  // Handle Photo Upload
  const handlePhotoUpload = (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      showToast("Harap pilih file gambar (JPG, PNG, atau WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        setPhotoImage(img);
        setPhotoUrl(e.target?.result as string);
        setPhotoFileName(file.name);
        setZoom(1.0);
        setPanX(0);
        setPanY(0);
        showToast("Foto berhasil dimuat!");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Dragging gesture on preview
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!photoImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handlePointerUp = () => setIsDragging(false);

  // High-Res Canvas 1080x1920 Export
  const renderCanvas1080 = (isTemplateOnly = false): HTMLCanvasElement => {
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d")!;
    const W = 1080;
    const H = 1920;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw User Photo
    if (!isTemplateOnly && photoImage) {
      const natW = photoImage.naturalWidth || 1000;
      const natH = photoImage.naturalHeight || 1000;
      const scale = Math.max(W / natW, H / natH) * zoom;
      const drawW = natW * scale;
      const drawH = natH * scale;

      const previewRect = photoLayerRef.current?.getBoundingClientRect();
      const ratio = previewRect ? W / previewRect.width : 2.5;

      const drawX = (W - drawW) / 2 + panX * ratio;
      const drawY = (H - drawH) / 2 + panY * ratio;

      ctx.drawImage(photoImage, drawX, drawY, drawW, drawH);
    } else if (!isTemplateOnly) {
      ctx.fillStyle = "#0a111c";
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Gradients Vignette
    const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.35);
    topGrad.addColorStop(0, "rgba(0, 0, 0, 0.88)");
    topGrad.addColorStop(0.6, "rgba(0, 0, 0, 0.4)");
    topGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, H * 0.35);

    const botGrad = ctx.createLinearGradient(0, H * 0.45, 0, H);
    botGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    botGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.7)");
    botGrad.addColorStop(1, "rgba(0, 0, 0, 0.96)");
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, H * 0.45, W, H * 0.55);

    // Colors
    let primaryColor = "#0056b3";
    let accentColor = "#00c3ff";
    if (eventConfig.theme === "theme-maybank") {
      primaryColor = "#f59e0b";
      accentColor = "#fbbf24";
    } else if (eventConfig.theme === "theme-borobudur") {
      primaryColor = "#dc2626";
      accentColor = "#f59e0b";
    } else if (eventConfig.theme === "theme-sunset") {
      primaryColor = "#ea580c";
      accentColor = "#f43f5e";
    } else if (eventConfig.theme === "theme-cyber") {
      primaryColor = "#84cc16";
      accentColor = "#a3e635";
    }

    // 3. Header: Event Title
    ctx.fillStyle = "#ffffff";
    ctx.font = '700 76px "Teko", "Arial Black", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(eventConfig.title.toUpperCase(), 60, 60);

    ctx.fillStyle = accentColor;
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(eventConfig.subtitle.toUpperCase(), 62, 142);

    // 4. Category Badge
    ctx.font = '700 56px "Teko", "Arial Black", sans-serif';
    const catText = selectedCategory;
    const catWidth = ctx.measureText(catText).width + 48;
    const catHeight = 72;
    const catX = W - 60 - catWidth;
    const catY = 60;

    ctx.fillStyle = primaryColor;
    roundRect(ctx, catX, catY, catWidth, catHeight, 14);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(catText, catX + catWidth / 2, catY + catHeight / 2 + 2);

    // 5. Personal Best Badge
    if (isPersonalBest) {
      ctx.fillStyle = "#f59e0b";
      const pbX = 60;
      const pbY = 210;
      const pbW = 260;
      const pbH = 48;
      roundRect(ctx, pbX, pbY, pbW, pbH, 8);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.font = '900 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏆 PERSONAL BEST", pbX + pbW / 2, pbY + pbH / 2);
    }

    // 6. Runner Name & BIB
    const bottomClusterY = H - 520;
    ctx.fillStyle = "#ffffff";
    ctx.font = '700 110px "Teko", "Arial Black", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText((runnerName || "RUNNER NAME").toUpperCase(), 60, bottomClusterY);

    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = "#cbd5e1";
    let metaText = bibNumber ? `BIB ${bibNumber}` : "FINISHER";
    if (runningClub) metaText += `  ·  ${runningClub.toUpperCase()}`;
    ctx.fillText(metaText, 60, bottomClusterY + 45);

    // 7. Metrics Container
    const metricsBoxY = bottomClusterY + 80;
    const metricsBoxH = 220;
    const metricsBoxW = W - 120;

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    roundRect(ctx, 60, metricsBoxY, metricsBoxW, metricsBoxH, 20);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 3;
    roundRect(ctx, 60, metricsBoxY, metricsBoxW, metricsBoxH, 20);
    ctx.stroke();

    const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

    // Finish Time
    ctx.fillStyle = accentColor;
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("FINISH TIME", 95, metricsBoxY + 50);

    ctx.fillStyle = "#ffffff";
    ctx.font = '700 92px "Teko", "Arial Black", sans-serif';
    ctx.fillText(timeStr, 95, metricsBoxY + 160);

    // Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.moveTo(500, metricsBoxY + 30);
    ctx.lineTo(500, metricsBoxY + metricsBoxH - 30);
    ctx.stroke();

    // Pace
    ctx.fillStyle = accentColor;
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("AVG PACE", 535, metricsBoxY + 50);

    ctx.fillStyle = "#ffffff";
    ctx.font = '700 92px "Teko", "Arial Black", sans-serif';
    ctx.fillText(pace, 535, metricsBoxY + 160);

    ctx.font = '600 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("/KM", 535 + ctx.measureText(pace).width + 10, metricsBoxY + 155);

    // Heart Rate
    if (heartRate) {
      ctx.beginPath();
      ctx.moveTo(810, metricsBoxY + 30);
      ctx.lineTo(810, metricsBoxY + metricsBoxH - 30);
      ctx.stroke();

      ctx.fillStyle = accentColor;
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("AVG HR", 840, metricsBoxY + 50);

      ctx.fillStyle = "#ffffff";
      ctx.font = '700 92px "Teko", "Arial Black", sans-serif';
      ctx.fillText(heartRate, 840, metricsBoxY + 160);

      ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("BPM", 840 + ctx.measureText(heartRate).width + 8, metricsBoxY + 155);
    }

    // 8. Footer
    ctx.fillStyle = "#94a3b8";
    ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(eventConfig.hashtag, 60, H - 90);

    ctx.fillStyle = accentColor;
    ctx.textAlign = "right";
    ctx.fillText("GUWIGO.COM/EVENT", W - 60, H - 90);

    return canvas;
  };

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Download Action
  const handleDownload = (isTemplate = false) => {
    showToast("Memproses gambar resolusi tinggi (1080 × 1920 px)...");
    const canvas = renderCanvas1080(isTemplate);
    const link = document.createElement("a");
    const safeName = (runnerName || "finisher").toLowerCase().replace(/[^a-z0-9]/g, "_");
    link.download = `${eventConfig.slug}_${safeName}_${selectedCategory}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Race Card berhasil diunduh!");
  };

  // Share Action
  const handleShare = async () => {
    if (!navigator.share) {
      handleDownload(false);
      return;
    }
    const canvas = renderCanvas1080(false);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "race_card.png", { type: "image/png" });
      await navigator.share({
        title: `${eventConfig.title} - Race Card`,
        text: `Finisher ${selectedCategory} pada ${eventConfig.title}! Catatan waktu: ${hour}:${min}:${sec}`,
        files: [file],
      });
    }, "image/png");
  };

  return (
    <div className={`min-h-screen bg-[#070d18] text-slate-100 font-sans ${eventConfig.theme}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#070d18]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
              <Flag size={18} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Guwigo<span className="text-cyan-400">Race</span>
              </span>
              <span className="block text-[11px] text-slate-400 font-medium">Official Event Service</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-semibold uppercase tracking-wider hidden sm:inline-block">
              {eventConfig.organizer}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Step Wizard (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Progress Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["1. Pelari & Jarak", "2. Catatan Waktu", "3. Foto Race", "4. Simpan / Bagikan"].map((lbl, idx) => (
              <button
                key={lbl}
                onClick={() => setCurrentStep(idx)}
                className={`flex-1 min-w-[130px] py-3 px-4 rounded-md text-xs font-bold transition-all border ${
                  currentStep === idx
                    ? "bg-slate-800 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                    : currentStep > idx
                    ? "bg-slate-900/60 border-emerald-500/50 text-emerald-400"
                    : "bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          {/* Step 1: Runner Info */}
          {currentStep === 0 && (
            <div className="bg-slate-900/80 border border-white/10 rounded-lg p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Data Pelari & Jarak</h2>
                <p className="text-sm text-slate-400">Pilih kategori lomba dan masukkan nama lengkap Anda.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nama Pelari *</label>
                <input
                  type="text"
                  value={runnerName}
                  onChange={(e) => setRunnerName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full bg-slate-950 border border-white/10 rounded-md px-4 py-3.5 text-white font-bold text-lg focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Kategori Jarak *</label>
                <div className="flex flex-wrap gap-2">
                  {eventConfig.categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setPace(calculatePace(hour, min, sec, cat));
                      }}
                      className={`px-5 py-2.5 rounded-md text-sm font-extrabold transition-all border ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white border-cyan-400 shadow-md shadow-blue-600/30"
                          : "bg-slate-950 text-slate-400 border-white/10 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nomor BIB / Dada</label>
                  <input
                    type="text"
                    value={bibNumber}
                    onChange={(e) => setBibNumber(e.target.value)}
                    placeholder="21088"
                    className="w-full bg-slate-950 border border-white/10 rounded-md px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Running Club / Komunitas</label>
                  <input
                    type="text"
                    value={runningClub}
                    onChange={(e) => setRunningClub(e.target.value)}
                    placeholder="Nama Komunitas"
                    className="w-full bg-slate-950 border border-white/10 rounded-md px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Time & Metrics */}
          {currentStep === 1 && (
            <div className="bg-slate-900/80 border border-white/10 rounded-lg p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Catatan Waktu & Statistik</h2>
                <p className="text-sm text-slate-400">Masukkan catatan finish time resmi Anda.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Finish Time (Jam : Menit : Detik) *</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={hour}
                      onChange={(e) => {
                        setHour(e.target.value);
                        setPace(calculatePace(e.target.value, min, sec, selectedCategory));
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-md py-3 text-center text-2xl font-black text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="block text-center text-[10px] text-slate-500 font-bold mt-1">JAM</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={min}
                      onChange={(e) => {
                        setMin(e.target.value);
                        setPace(calculatePace(hour, e.target.value, sec, selectedCategory));
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-md py-3 text-center text-2xl font-black text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="block text-center text-[10px] text-slate-500 font-bold mt-1">MENIT</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={sec}
                      onChange={(e) => {
                        setSec(e.target.value);
                        setPace(calculatePace(hour, min, e.target.value, selectedCategory));
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-md py-3 text-center text-2xl font-black text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="block text-center text-[10px] text-slate-500 font-bold mt-1">DETIK</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Average Pace (/KM)</label>
                  <input
                    type="text"
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-md px-4 py-3 text-white font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Avg Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-md px-4 py-3 text-white font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 bg-slate-950/60 border border-white/10 p-4 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPersonalBest}
                  onChange={(e) => setIsPersonalBest(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded"
                />
                <div>
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Trophy size={16} className="text-amber-400" /> Tampilkan Badge Personal Best (PB)!
                  </span>
                  <span className="text-xs text-slate-400">Beri tanda rekor pencapaian waktu lari terbaik Anda.</span>
                </div>
              </label>
            </div>
          )}

          {/* Step 3: Photo Upload */}
          {currentStep === 2 && (
            <div className="bg-slate-900/80 border border-white/10 rounded-lg p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Upload Foto Race</h2>
                <p className="text-sm text-slate-400">Pilih foto terbaik saat berlari atau saat memegang medali.</p>
              </div>

              <label className="border-2 border-dashed border-white/15 hover:border-cyan-400 bg-slate-950/50 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => e.target.files && handlePhotoUpload(e.target.files[0])}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <span className="font-bold text-sm text-white">Klik atau Tarik Foto ke Sini</span>
                <span className="text-xs text-slate-400 mt-1">Format JPG, PNG, WEBP (Otomatis diproses lokal)</span>
              </label>

              {photoImage && (
                <div className="bg-slate-950 p-4 rounded-lg border border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{photoFileName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoImage(null);
                        setPhotoUrl("");
                      }}
                      className="text-red-400 font-bold hover:underline"
                    >
                      Hapus Foto
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Zoom Foto</span>
                      <span>{zoom.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="2.8"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPanX(0);
                        setPanY(0);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-bold border border-white/10 hover:border-cyan-400"
                    >
                      Reset Posisi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1.0);
                        setPanX(0);
                        setPanY(0);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-bold border border-white/10 hover:border-cyan-400"
                    >
                      Fit Layar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Export Actions */}
          {currentStep === 3 && (
            <div className="bg-slate-900/80 border border-white/10 rounded-lg p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Kartu Finisher Siap!</h2>
                <p className="text-sm text-slate-400">Unduh dengan resolusi tajam 1080 × 1920 px.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-white/10 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Event:</span>
                  <span className="font-bold text-white">{eventConfig.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pelari:</span>
                  <span className="font-bold text-white">{runnerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Finish Time:</span>
                  <span className="font-bold text-white">
                    {selectedCategory} · {hour}:{min}:{sec} (Pace {pace})
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleDownload(false)}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-base shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download Race Card (PNG)
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full py-3.5 rounded-lg bg-slate-800 text-white font-bold text-sm border border-white/10 hover:border-cyan-400 flex items-center justify-center gap-2"
                >
                  <Share2 size={18} /> Share ke Instagram Story / WA
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(true)}
                  className="w-full py-3 rounded-lg bg-transparent text-slate-400 text-xs font-bold border border-white/5 hover:text-white"
                >
                  Export Template Transparan (Overlay Only)
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`px-5 py-2.5 rounded-md border text-xs font-bold flex items-center gap-1.5 ${
                currentStep === 0
                  ? "opacity-0 pointer-events-none"
                  : "bg-slate-900 border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <ArrowLeft size={14} /> Kembali
            </button>

            {currentStep < 3 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
                className="px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
              >
                Lanjut <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right Preview: 9:16 Interactive Race Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-20 w-full max-w-[380px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> Live 9:16 Preview
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">1080 × 1920 px</span>
            </div>

            {/* 9:16 Aspect Box */}
            <div
              className="relative w-full aspect-[9/16] rounded-lg overflow-hidden shadow-2xl bg-slate-950 border border-white/10 select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Photo Layer */}
              <div ref={photoLayerRef} className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Runner"
                    style={{
                      transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                      maxWidth: "none",
                    }}
                    className="absolute h-full w-full object-cover pointer-events-none transition-transform duration-75"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-600 text-xs text-center p-6 gap-2">
                    <Upload size={32} />
                    <span>Upload foto di Step 3<br />atau geser langsung di sini</span>
                  </div>
                )}
              </div>

              {/* Vignette Gradients */}
              <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none" />

              {/* UI Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none">
                {/* Top Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-2xl text-white tracking-wide leading-tight uppercase font-sans">
                      {eventConfig.title}
                    </h3>
                    <span className="text-[10px] font-black text-cyan-400 tracking-widest uppercase block mt-0.5">
                      {eventConfig.subtitle}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-blue-600 border border-white/20 rounded-lg text-white font-black text-sm tracking-wider shadow-md">
                    {selectedCategory}
                  </div>
                </div>

                {/* PB Badge */}
                {isPersonalBest && (
                  <div className="self-start -mt-8">
                    <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-black tracking-wider rounded uppercase shadow-md">
                      🏆 PERSONAL BEST
                    </span>
                  </div>
                )}

                {/* Bottom Cluster */}
                <div className="space-y-3">
                  {/* Runner Name */}
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
                      {runnerName || "RUNNER NAME"}
                    </h2>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 mt-1 uppercase">
                      <span>{bibNumber ? `BIB ${bibNumber}` : "FINISHER"}</span>
                      {runningClub && (
                        <>
                          <span className="text-cyan-400">·</span>
                          <span>{runningClub}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-md border border-white/10 text-center">
                    <div className="border-r border-white/10 pr-1">
                      <span className="block text-[8px] font-extrabold text-cyan-400 uppercase tracking-wider">FINISH TIME</span>
                      <span className="font-black text-lg text-white tracking-tight leading-none mt-0.5 block">
                        {hour}:{min}:{sec}
                      </span>
                    </div>
                    <div className="border-r border-white/10 pr-1">
                      <span className="block text-[8px] font-extrabold text-cyan-400 uppercase tracking-wider">AVG PACE</span>
                      <span className="font-black text-lg text-white tracking-tight leading-none mt-0.5 block">
                        {pace} <small className="text-[10px] text-slate-400 font-semibold">/KM</small>
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-extrabold text-cyan-400 uppercase tracking-wider">AVG HR</span>
                      <span className="font-black text-lg text-white tracking-tight leading-none mt-0.5 block">
                        {heartRate || "—"} <small className="text-[10px] text-slate-400 font-semibold">BPM</small>
                      </span>
                    </div>
                  </div>

                  {/* Footer Strip */}
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 border-t border-white/10 pt-2">
                    <span>{eventConfig.hashtag}</span>
                    <span className="text-cyan-400">GUWIGO.COM/EVENT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden Export Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-cyan-400 text-white px-5 py-3 rounded-md text-sm font-bold shadow-2xl z-50 animate-bounce">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
