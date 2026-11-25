import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface LiveChatSettings {
  enabled?: boolean;
  aiProvider?: "deepseek" | "openai" | "gemini" | "anthropic" | "custom";
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  maxContextMessages?: number;
  responseTimeout?: number;
}

// Knowledge Base Responder untuk fallback cerdas ketika AI provider offline/unauthorized
function getKnowledgeBaseResponse(userText: string): string {
  const query = userText.toLowerCase();

  // 1. Sapaan / Greeting
  if (
    /^(halo|hai|hey|hi|hello|pagi|siang|sore|malam|assalam|tes|test|p\b|menu)/i.test(
      query.trim()
    )
  ) {
    return (
      "Halo! Selamat datang di **PT Guwigo Teknologi Indonesia** 👋\n\n" +
      "Saya **Guwigo Assistant**, siap membantu Anda merancang dan mengembangkan solusi teknologi untuk bisnis Anda.\n\n" +
      "Apakah Anda sedang merencanakan pembuatan **Website**, **Aplikasi Mobile**, atau **Sistem Enterprise**? Silakan beri tahu kami kebutuhan Anda!"
    );
  }

  // 2. Kontak / Hubungi / WhatsApp / Telepon
  if (
    /(kontak|hubungi|whatsapp|wa|telepon|nomor|call|sales|konsultan|bicara|engineer|admin|cs|callcenter)/i.test(
      query
    )
  ) {
    return (
      "Tentu! Anda dapat langsung berkonsultasi secara mendalam dengan tim engineer & konsultan kami melalui:\n\n" +
      "📱 **WhatsApp Official**: [+62 851-7959-4146](https://wa.me/6285179594146)\n" +
      "📧 **Email**: info@guwigo.com\n" +
      "🏢 **PT Guwigo Teknologi Indonesia**\n\n" +
      "Kami siap menjadwalkan sesi konsultasi gratis (online meeting via Google Meet/Zoom) untuk membahas arsitektur dan kebutuhan spesifik sistem Anda."
    );
  }

  // 3. Biaya / Harga / Tarif / Budget
  if (
    /(harga|biaya|ongkos|tarif|budget|pricelist|berapa|price|cost|bayar|investasi)/i.test(
      query
    )
  ) {
    return (
      "Estimasi investasi proyek di **Guwigo** sangat transparan dan disesuaikan dengan kebutuhan bisnis:\n\n" +
      "• **Landing Page / Company Profile**: Mulai dari **Rp 5.000.000**\n" +
      "• **Custom Web Application (Next.js/React)**: Mulai dari **Rp 15.000.000**\n" +
      "• **Mobile App (Android & iOS Flutter)**: Mulai dari **Rp 15.000.000 - Rp 35.000.000**\n" +
      "• **Sistem Enterprise / ERP / POS Custom**: Mulai dari **Rp 25.000.000**\n" +
      "• **UI/UX Design & Prototyping**: Mulai dari **Rp 3.500.000**\n\n" +
      "✨ *Konsultasi teknis awal gratis.* Ingin kami buatkan proposal dan estimasi kalkulasi untuk kebutuhan Anda? Hubungi kami via WhatsApp di [+62 851-7959-4146](https://wa.me/6285179594146)."
    );
  }

  // 4. Layanan Web / Website
  if (
    /(web|website|landing page|company profile|compro|e-commerce|ecommerce|toko online|portal)/i.test(
      query
    )
  ) {
    return (
      "Guwigo mengembangkan website modern berstandar enterprise:\n\n" +
      "• **Landing Page & Company Profile**: Desain eksklusif, cepat, SEO-friendly, dan responsif di semua perangkat.\n" +
      "• **Custom Web Application**: Menggunakan arsitektur modern **Next.js & React** yang scalable dan mudah dirawat.\n" +
      "• **E-Commerce & Portal**: Terintegrasi payment gateway (Midtrans, Xendit, QRIS) dan sistem manajemen otomatis.\n\n" +
      "💡 *Estimasi investasi mulai dari Rp 5 Juta (Landing Page) hingga Rp 15 Juta+ (Custom Web App).* Boleh ceritakan fitur utama website yang Anda inginkan?"
    );
  }

  // 5. Layanan Mobile Apps
  if (
    /(mobile|aplikasi|android|ios|flutter|react native|apk|playstore|appstore)/i.test(
      query
    )
  ) {
    return (
      "Untuk aplikasi mobile, kami membangun produk tangguh untuk Android & iOS:\n\n" +
      "• **Teknologi**: **Flutter** dan **React Native** dengan performa native yang mulus.\n" +
      "• **Fitur**: Push notifications, maps/GPS, payment gateway, offline caching, dan sistem autentikasi aman.\n" +
      "• **Full Service**: Mulai dari riset UI/UX, coding, testing, hingga publikasi ke Google Play Store & Apple App Store.\n\n" +
      "💡 *Estimasi biaya mulai dari Rp 15.000.000 - Rp 35.000.000+*. Apakah aplikasi ini ditujukan untuk pelanggan (B2C) atau operasional internal (B2B)?"
    );
  }

  // 6. Enterprise / ERP / POS / Kasir / Dashboard
  if (
    /(erp|crm|pos|kasir|sistem|enterprise|inventori|inventory|gudang|manajemen|dashboard|software)/i.test(
      query
    )
  ) {
    return (
      "Guwigo berpengalaman merancang sistem otomasi bisnis & enterprise:\n\n" +
      "• **ERP & CRM Custom**: Sinkronisasi data operasional, inventori, dan relasi pelanggan terpadu.\n" +
      "• **Sistem POS & Kasir**: Transaksi multi-cabang, barcode scanning, dan laporan keuangan real-time.\n" +
      "• **Admin Dashboard & Analytics**: Visualisasi metrik bisnis untuk memudahkan pengambilan keputusan manajemen.\n\n" +
      "💡 *Estimasi mulai dari Rp 25.000.000 sudah termasuk garansi pemeliharaan dan sesi training staff.*"
    );
  }

  // 7. Waktu / Durasi / Timeline
  if (
    /(lama|waktu|durasi|timeline|berapa hari|berapa bulan|kapan selesai|proses)/i.test(
      query
    )
  ) {
    return (
      "Waktu pengerjaan proyek bergantung pada ruang lingkup:\n\n" +
      "• **Landing Page / Company Profile**: 1 - 2 minggu\n" +
      "• **Web Application / MVP**: 3 - 6 minggu\n" +
      "• **Mobile App / Enterprise System**: 2 - 3 bulan\n\n" +
      "Kami menerapkan alur kerja Agile dengan progress report mingguan dan testing berkala agar hasil tepat waktu dan teruji dengan baik."
    );
  }

  // 8. Igovent / Event Management
  if (/(igovent|event|tiket|ticketing|seminar|konser|peserta)/i.test(query)) {
    return (
      "**Igovent** adalah produk ekosistem dari Guwigo untuk manajemen event modern:\n\n" +
      "• Registrasi peserta online dan e-ticketing instan.\n" +
      "• Pembayaran otomatis dengan QRIS & Virtual Account.\n" +
      "• Validasi tiket onsite dengan QR Code scanner cepat untuk meminimalisir antrean."
    );
  }

  // 9. UI/UX Design
  if (/(ui|ux|desain|design|figma|tampilan|prototype|mockup)/i.test(query)) {
    return (
      "Layanan UI/UX Design di Guwigo dirancang untuk memaksimalkan estetika dan kenyamanan pengguna:\n\n" +
      "• Riset alur pengguna (User Journey & Wireframing)\n" +
      "• High-Fidelity UI Design modern di Figma\n" +
      "• Interactive Prototype yang dapat diuji coba langsung sebelum coding\n" +
      "• Standarisasi Design System (Typography, Color Palette, Reusable Components)."
    );
  }

  // 10. Teknologi / Tech Stack
  if (/(teknologi|tech|stack|coding|bahasa|framework)/i.test(query)) {
    return (
      "Standar teknologi yang kami gunakan di Guwigo:\n\n" +
      "• **Frontend**: Next.js, React, TypeScript, Tailwind CSS\n" +
      "• **Mobile**: Flutter, React Native (iOS & Android)\n" +
      "• **Backend & DB**: Node.js, Express, Go, PostgreSQL, Firebase, Redis\n" +
      "• **Cloud & DevOps**: Google Cloud Platform (GCP), AWS, Docker, Vercel."
    );
  }

  // Default Fallback
  return (
    "Terima kasih atas pesan Anda! Di **PT Guwigo Teknologi Indonesia**, kami membantu bisnis dan institusi mewujudkan transformasi digital melalui pembuatan **Website modern**, **Aplikasi Mobile (Android/iOS)**, dan **Sistem Enterprise Custom**.\n\n" +
    "Untuk mendiskusikan kebutuhan sistem Anda secara spesifik atau mendapatkan estimasi proposal, silakan hubungi tim engineer kami langsung melalui WhatsApp di **[+62 851-7959-4146](https://wa.me/6285179594146)**.\n\n" +
    "Ada kebutuhan fitur khusus yang sedang Anda rencanakan?"
  );
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Format pesan tidak valid." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    // 1. Ambil Pengaturan dari Firestore dengan timeout 2.5s agar tidak pernah blocking
    let liveChatSettings: LiveChatSettings = {
      enabled: true,
      aiProvider: "deepseek",
      model: "deepseek-chat",
    };

    try {
      const docRef = doc(db, "systemSettings", "liveChat");
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 2500)
      );
      const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]);
      if (docSnap && "exists" in docSnap && docSnap.exists()) {
        liveChatSettings = { ...liveChatSettings, ...docSnap.data() };
      }
    } catch (e) {
      console.warn("⚠️ Gagal memuat systemSettings/liveChat dari Firestore, menggunakan fallback.", e);
    }

    // Jika live chat dinonaktifkan oleh admin
    if (liveChatSettings.enabled === false) {
      return NextResponse.json({
        result:
          "Layanan live chat sedang dinonaktifkan sementara. Untuk bantuan langsung, silakan hubungi tim Guwigo via WhatsApp di +62 851-7959-4146.",
      });
    }

    const provider = liveChatSettings.aiProvider || "deepseek";
    const configuredApiKey =
      liveChatSettings.apiKey ||
      process.env.DEEPSEEK_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      "";

    const systemPrompt =
      liveChatSettings.systemPrompt ||
      `Anda adalah 'Guwigo Assistant', representasi AI cerdas dari PT Guwigo Teknologi Indonesia (Software House & Konsultan IT).
Tugas Utama Anda:
1. Menyapa pengunjung website dengan ramah, profesional, dan sedikit hangat.
2. Menjawab pertanyaan seputar layanan IT (Pembuatan Web, Aplikasi Mobile Next.js/Flutter, Sistem Enterprise, UI/UX, Igovent).
3. JANGAN memberikan janji harga mati. Selalu gunakan istilah "mulai dari" (misal: "Web custom mulai dari Rp 15 Juta").
4. Jika klien terlihat tertarik atau butuh diskusi mendalam, arahkan mereka untuk menghubungi tim secara langsung via WhatsApp: +62 851-7959-4146.
5. Jawaban HARUS singkat, padat, dan tidak bertele-tele (maksimal 2-3 paragraf pendek). Jangan gunakan format Markdown berlebihan, gunakan teks biasa/bold yang mudah dibaca di layar chat kecil.`;

    // 2. Jika ada API Key, coba panggil AI Provider dengan timeout 8s
    if (configuredApiKey && configuredApiKey.trim().length > 10) {
      try {
        let aiResult: string | null = null;
        const fetchTimeoutSignal = AbortSignal.timeout(8000);

        if (provider === "deepseek") {
          const res = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${configuredApiKey}`,
            },
            body: JSON.stringify({
              model: liveChatSettings.model || "deepseek-chat",
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.slice(-6),
              ],
              temperature: 0.7,
            }),
            signal: fetchTimeoutSignal,
          });

          if (res.ok) {
            const data = await res.json();
            aiResult = data?.choices?.[0]?.message?.content || null;
          } else {
            console.warn(
              `⚠️ DeepSeek API responded with status ${res.status}. Falling back to Guwigo Knowledge Engine.`
            );
          }
        } else if (provider === "openai") {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${configuredApiKey}`,
            },
            body: JSON.stringify({
              model: liveChatSettings.model || "gpt-4o-mini",
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.slice(-6),
              ],
              temperature: 0.7,
            }),
            signal: fetchTimeoutSignal,
          });

          if (res.ok) {
            const data = await res.json();
            aiResult = data?.choices?.[0]?.message?.content || null;
          } else {
            console.warn(
              `⚠️ OpenAI API responded with status ${res.status}. Falling back to Guwigo Knowledge Engine.`
            );
          }
        } else if (provider === "gemini") {
          const modelName = liveChatSettings.model || "gemini-1.5-flash";
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${configuredApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents: messages.slice(-6).map((m: ChatMessage) => ({
                  role: m.role === "assistant" ? "model" : "user",
                  parts: [{ text: m.content }],
                })),
              }),
              signal: fetchTimeoutSignal,
            }
          );

          if (res.ok) {
            const data = await res.json();
            aiResult =
              data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
          } else {
            console.warn(
              `⚠️ Gemini API responded with status ${res.status}. Falling back to Guwigo Knowledge Engine.`
            );
          }
        }

        if (aiResult) {
          return NextResponse.json({ result: aiResult });
        }
      } catch (aiErr) {
        console.warn("⚠️ Exception saat menghubungi AI provider:", aiErr);
      }
    }

    // 3. Fallback Cerdas (Guwigo Knowledge Base Engine)
    // Berjalan jika API key tidak valid, habis kuota, belum disetel, atau server AI timeout
    const fallbackAnswer = getKnowledgeBaseResponse(lastMessage);
    return NextResponse.json({ result: fallbackAnswer });
  } catch (error) {
    console.error("❌ Error di /api/chat:", error);
    return NextResponse.json({
      result:
        "Halo! Terima kasih telah menghubungi Guwigo Assistant. Ada kendala teknis singkat, namun tim kami siap membantu Anda secara langsung via WhatsApp di [+62 851-7959-4146](https://wa.me/6285179594146).",
    });
  }
}
