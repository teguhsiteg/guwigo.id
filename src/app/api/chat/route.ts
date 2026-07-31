import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Format pesan tidak valid." },
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
            content: `Anda adalah 'Guwigo Assistant', representasi AI cerdas dari PT Guwigo Teknologi Indonesia (Software House & Konsultan IT).
            Tugas Utama Anda:
            1. Menyapa pengunjung website dengan ramah, profesional, dan sedikit hangat.
            2. Menjawab pertanyaan seputar layanan IT (Pembuatan Web, Aplikasi Mobile Next.js/Flutter, Sistem Enterprise, UI/UX, Igovent).
            3. JANGAN memberikan janji harga mati. Selalu gunakan istilah "mulai dari" (misal: "Web custom mulai dari Rp 15 Juta").
            4. Jika klien terlihat tertarik atau butuh diskusi mendalam, arahkan mereka untuk menghubungi tim secara langsung via WhatsApp.
            5. Jawaban HARUS singkat, padat, dan tidak bertele-tele (maksimal 2-3 paragraf pendek). Jangan gunakan format Markdown berlebihan, gunakan teks biasa yang mudah dibaca di layar chat kecil.`,
          },
          ...messages, // Memasukkan seluruh riwayat chat klien
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error("Terjadi kesalahan di server AI");

    const data = await response.json();
    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membalas pesan." },
      { status: 500 },
    );
  }
}
