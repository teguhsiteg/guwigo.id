import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, customerName, invoiceNumber, documentUrl } = body;

    // TODO: Nanti kita ganti dengan Token & Phone ID asli dari Meta setelah di-approve
    const META_ACCESS_TOKEN =
      process.env.META_WA_ACCESS_TOKEN || "TOKEN_SEMENTARA_DARI_META";
    const PHONE_NUMBER_ID =
      process.env.META_WA_PHONE_NUMBER_ID || "ID_NOMOR_BAPAK";

    // Pastikan nomor diawali kode negara (misal: 62812...) tanpa '+' atau '0'
    const formattedPhone = phoneNumber.startsWith("0")
      ? `62${phoneNumber.slice(1)}`
      : phoneNumber.replace("+", "");

    // Payload (Isi Pesan) untuk Meta Cloud API
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: "text",
      text: {
        preview_url: true,
        body: `Halo Bapak/Ibu *${customerName}*,\n\nBerikut adalah tagihan (Invoice) dengan nomor *${invoiceNumber}* dari Guwigo Indonesia.\n\nSilakan unduh atau lihat detail tagihan Anda melalui tautan aman berikut:\n${documentUrl}\n\nTerima kasih atas kepercayaannya!\n\nSalam Hangat,\n*Guwigo Finance*`,
      },
    };

    // Tembak ke Server Meta
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gagal mengirim WA:", data);
      return NextResponse.json(
        { success: false, error: data },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pesan WhatsApp berhasil dikirim!",
      data,
    });
  } catch (error: any) {
    console.error("Internal Server Error (WA API):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
