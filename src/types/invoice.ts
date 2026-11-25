import { Timestamp } from "firebase/firestore";

/* ─── Invoice Types ─── */

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;       // pcs, jam, paket, dll
  unitPrice: number;
  amount: number;     // quantity * unitPrice
}

export interface InvoiceClient {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;   // INV-2026-0001
  client: InvoiceClient;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;          // e.g., 11 for 11% PPN
  taxAmount: number;
  pphRate?: number;         // e.g., 2 for 2% PPh 21/23
  pphAmount?: number;       // pemotongan pph
  discount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  useEmeterai?: boolean;    // Pembubuhan E-Meterai Rp 10.000
  emeteraiUrl?: string;     // URL gambar QR e-meterai jika diunggah
  dueDate: Timestamp;
  issuedDate: Timestamp;
  paidDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/* ─── Receipt (Kuitansi) Types ─── */

export type ReceiptStatus = "issued" | "void";

export interface Receipt {
  id: string;
  receiptNumber: string;    // KWT-2026-0001
  invoiceId?: string;        // link ke invoice terkait
  invoiceNumber?: string;
  receivedFrom: string;      // Terima dari
  amount: number;            // Jumlah uang
  amountInWords: string;     // Terbilang
  purpose: string;           // Untuk pembayaran
  paymentMethod: string;     // Transfer / Cash / dll
  status: ReceiptStatus;
  notes?: string;
  useEmeterai?: boolean;    // Pembubuhan E-Meterai Rp 10.000
  emeteraiUrl?: string;     // URL gambar QR e-meterai jika diunggah
  issuedDate: Timestamp;
  createdAt: Timestamp;
}

/* ─── Invoice Settings Types ─── */

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
  documentPrefix?: string;
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
  fontFamily: "font-sans",
  fontSize: "normal",
  primaryColor: "#2563eb",
  logoWidth: 144,
  logoHeight: 36,
  stampSize: 144,
  stampRotation: -14,
  signatureWidth: 128,
  signatureHeight: 72,
  documentPrefix: "GWG",
};

/* ─── Helpers ─── */

const ROMAN_MONTHS = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"
];

export function generateInvoiceNumber(count: number, prefix: string = "GWG"): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = ROMAN_MONTHS[now.getMonth()];
  const padded = String(count + 1).padStart(3, "0");
  return `INV/${prefix}/${padded}/${month}/${year}`;
}

export function generateReceiptNumber(count: number, prefix: string = "GWG"): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = ROMAN_MONTHS[now.getMonth()];
  const padded = String(count + 1).padStart(3, "0");
  return `KWT/${prefix}/${padded}/${month}/${year}`;
}

export function formatCurrency(amount: number): string {
  return "Rp " + (amount || 0).toLocaleString("id-ID");
}

export function amountToWords(num: number): string {
  if (num === 0) return "Nol Rupiah";

  const ones = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];
  const teens = ["Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas",
    "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas"];
  const tens = ["", "", "Dua Puluh", "Tiga Puluh", "Empat Puluh", "Lima Puluh",
    "Enam Puluh", "Tujuh Puluh", "Delapan Puluh", "Sembilan Puluh"];

  function convert(n: number): string {
    if (n === 0) return "";
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 200) return "Seratus" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Ratus" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 2000) return "Seribu" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 1000000) return convert(Math.floor(n / 1000)) + " Ribu" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + " Juta" + (n % 1000000 ? " " + convert(n % 1000000) : "");
    if (n < 1000000000000) return convert(Math.floor(n / 1000000000)) + " Miliar" + (n % 1000000000 ? " " + convert(n % 1000000000) : "");
    return convert(Math.floor(n / 1000000000000)) + " Triliun" + (n % 1000000000000 ? " " + convert(n % 1000000000000) : "");
  }

  return convert(Math.round(num)) + " Rupiah";
}

export const INVOICE_STATUS_MAP: Record<InvoiceStatus, { label: string; variant: "default" | "success" | "warning" | "error" | "info" | "purple" }> = {
  draft: { label: "Draft", variant: "default" },
  sent: { label: "Terkirim", variant: "info" },
  paid: { label: "Lunas", variant: "success" },
  overdue: { label: "Jatuh Tempo", variant: "error" },
  cancelled: { label: "Dibatalkan", variant: "default" },
};
