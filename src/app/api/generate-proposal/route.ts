import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

function generateFallbackProposal(problem: string): string {
  const p = problem.toLowerCase();
  let solutionType = "Platform Digital & Arsitektur Cloud Terintegrasi";
  let techStack = "Next.js 15, TypeScript, Node.js Microservices, PostgreSQL, dan Google Cloud Platform";
  let investment = "Rp 25.000.000 - Rp 45.000.000";
  let duration = "4 - 8 Minggu";

  if (p.includes("mobile") || p.includes("aplikasi") || p.includes("android") || p.includes("ios")) {
    solutionType = "Aplikasi Mobile Multiplatform Berperforma Native";
    techStack = "Flutter / React Native, GraphQL/REST API, Node.js Backend, dan Firebase Cloud Messaging";
    investment = "Rp 35.000.000 - Rp 65.000.000";
    duration = "8 - 12 Minggu";
  } else if (p.includes("erp") || p.includes("kasir") || p.includes("pos") || p.includes("inventori") || p.includes("gudang")) {
    solutionType = "Sistem ERP & Manajemen Operasional Terpadu";
    techStack = "Next.js Enterprise Dashboard, PostgreSQL High-Availability, Redis Caching, dan Docker Containers";
    investment = "Rp 45.000.000 - Rp 85.000.000";
    duration = "10 - 16 Minggu";
  } else if (p.includes("toko") || p.includes("ecommerce") || p.includes("e-commerce") || p.includes("jual")) {
    solutionType = "E-Commerce Enterprise dengan Omnichannel Payment Gateway";
    techStack = "Next.js App Router, Tailwind CSS, Midtrans/Xendit Payment Engine, dan Automated Inventory Sync";
    investment = "Rp 20.000.000 - Rp 40.000.000";
    duration = "4 - 6 Minggu";
  }

  return `## 1. Analisis Akar Masalah (Pain Points)
Berdasarkan deskripsi kebutuhan yang disampaikan: **"${problem}"**, kami mengidentifikasi beberapa titik kritis yang menjadi hambatan efisiensi bisnis:
- **Bottleneck Operasional**: Proses pengelolaan yang masih manual atau terfragmentasi menimbulkan latensi tinggi dan risiko human-error yang signifikan.
- **Keterbatasan Skalabilitas**: Ketiadaan infrastruktur perangkat lunak tersentralisasi menghambat pertumbuhan volume transaksi serta visibilitas data secara *real-time*.
- **Kerugian Finansial & Reputasi**: Tanpa sistem otomatisasi modern, biaya operasional jangka panjang meningkat dan pengalaman pengguna akhir (*user satisfaction*) berpotensi terdegradasi.

## 2. Blueprint Solusi Guwigo
PT Guwigo Teknologi Indonesia merancang solusi komprehensif: **${solutionType}**.
- **Modern Architecture**: Menggunakan fondasi teknologi terdepan **${techStack}** untuk menjamin responsivitas ultra-cepat, keamanan data berlapis, dan kemudahan skalabilitas di masa depan.
- **Enterprise Security**: Penerapan enkripsi data end-to-end (SSL/TLS, JWT Auth, Role-Based Access Control) yang memenuhi standar kepatuhan regulasi industri.
- **Seamless Integration**: Integrasi antarmuka intuitif dengan arsitektur RESTful API / Webhooks untuk menyinkronkan seluruh aliran data bisnis secara otomatis.

## 3. Eksekusi & Timeline (Fase)
Implementasi dilakukan dengan metodologi **Agile Scrum** terukur dengan estimasi durasi **${duration}**:
- **Fase 1 (Discovery & Architecture Design)**: Analisis spesifikasi sistem, pemodelan database, dan penyusunan UI/UX High-Fidelity di Figma.
- **Fase 2 (Core Development & Integration)**: Pembangunan backend microservices, integrasi antarmuka Next.js/Mobile, dan koneksi third-party API.
- **Fase 3 (Quality Assurance & Security Audit)**: Stress testing, penetration testing, serta user acceptance testing (UAT).
- **Fase 4 (Deployment & Hypercare)**: Peluncuran ke production server, pelatihan staf operasional, dan pendampingan pasca-rilis.

## 4. Estimasi Investasi
- **Total Nilai Investasi**: Mulai dari **${investment}**
- **Termasuk Dalam Paket**:
  - Lisensi source code kepemilikan penuh klien.
  - Garansi pemeliharaan & *bug-free assurance* selama 3 bulan.
  - Dokumentasi teknis sistem & panduan admin komprehensif.

## 5. ROI (Return on Investment)
- **Efisiensi Waktu Kerja hingga 65%**: Otomasi alur kerja memangkas waktu administratif tim secara masif.
- **Zero-Error Data Redundancy**: Menghilangkan duplikasi data transaksi dan meningkatkan akurasi laporan hingga 99,8%.
- **Keunggulan Kompetitif Jangka Panjang**: Memberikan keunggulan pasar melalui layanan digital yang cepat, tangguh, dan siap mendukung ekspansi bisnis 3-5 tahun ke depan.`;
}

export async function POST(req: Request) {
  try {
    const { problemDescription } = await req.json();

    if (!problemDescription || typeof problemDescription !== "string") {
      return NextResponse.json(
        { error: "Deskripsi masalah tidak boleh kosong." },
        { status: 400 }
      );
    }

    // 1. Ambil Pengaturan dari Firestore jika ada dengan timeout 2.5s
    let apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "";
    try {
      const docRef = doc(db, "systemSettings", "liveChat");
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 2500)
      );
      const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]);
      if (docSnap && "exists" in docSnap && docSnap.exists()) {
        const data = docSnap.data();
        if (data?.apiKey) apiKey = data.apiKey;
      }
    } catch (e) {
      console.warn("Could not load API key from Firestore, using env:", e);
    }

    // 2. Jika ada API Key, coba kirim ke provider AI dengan timeout 8s
    if (apiKey && apiKey.length > 10) {
      try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: `Anda adalah Konsultan Arsitektur IT Eksekutif di PT Guwigo Teknologi Indonesia.
Tugas Anda: Membuat proposal solusi digital tingkat Enterprise (B2B) berdasarkan masalah klien.

ATURAN FORMAT WAJIB (Gunakan Markdown tebal ** dan list -):
## 1. Analisis Akar Masalah (Pain Points)
(Jelaskan secara tajam masalah klien dan dampak kerugian bisnisnya jika dibiarkan)
## 2. Blueprint Solusi Guwigo
(Tawarkan solusi spesifik. Wajib rekomendasikan teknologi modern: Next.js, React, Node.js, atau Flutter)
## 3. Eksekusi & Timeline (Fase)
(Beri estimasi pengerjaan dalam minggu/bulan)
## 4. Estimasi Investasi
(Berikan angka Rupiah yang realistis untuk proyek B2B, mulai dari Rp 15.000.000 hingga Rp 150.000.000 tergantung kerumitan)
## 5. ROI (Return on Investment)
(Jelaskan keuntungan jangka panjang klien jika memakai sistem ini)

Gaya bahasa: Elegan, solutif, percaya diri, dan berwibawa layaknya konsultan firma top. Jangan ada basa-basi di awal/akhir.`,
              },
              {
                role: "user",
                content: `Masalah klien: ${problemDescription}`,
              },
            ],
            temperature: 0.6,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            return NextResponse.json({ result: content });
          }
        }
      } catch (aiErr) {
        console.warn("⚠️ AI request failed, falling back to blueprint generator:", aiErr);
      }
    }

    // 3. Fallback Blueprint Generator
    const proposal = generateFallbackProposal(problemDescription);
    return NextResponse.json({ result: proposal });
  } catch (error) {
    console.error("❌ Error in generate-proposal:", error);
    return NextResponse.json(
      { error: "Gagal menghasilkan proposal." },
      { status: 500 }
    );
  }
}
