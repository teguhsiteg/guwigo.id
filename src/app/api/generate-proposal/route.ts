import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { problemDescription } = await req.json();

    if (!problemDescription) {
      return NextResponse.json(
        { error: "Deskripsi masalah tidak boleh kosong." },
        { status: 400 },
      );
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
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
        temperature: 0.6, // Dibuat lebih rendah agar AI sangat logis dan tidak berhalusinasi
      }),
    });

    if (!response.ok) throw new Error("Terjadi kesalahan di server AI");

    const data = await response.json();
    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghasilkan proposal." },
      { status: 500 },
    );
  }
}
