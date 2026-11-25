import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiveChatWidget from "@/components/features/LiveChatWidget";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

// Metadata SEO & Social Media Share (Open Graph)
export const metadata: Metadata = {
  metadataBase: new URL("https://guwigo.com"),
  title: {
    default: "PT Guwigo Teknologi Indonesia | Enterprise Software Solutions",
    template: "%s | PT Guwigo Teknologi Indonesia",
  },
  description:
    "Building Smarter Digital Future. Ekosistem teknologi terdepan dari Yogyakarta untuk Indonesia. Solusi IT, Web Development, dan SaaS skala Enterprise.",
  keywords: [
    "Software House Yogyakarta",
    "IT Consultant",
    "Web Development",
    "SaaS Indonesia",
    "Aplikasi Bisnis",
    "Guwigo Teknologi Indonesia",
  ],
  authors: [{ name: "Teguh Dwi Prayogo" }],
  creator: "PT Guwigo Teknologi Indonesia",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://guwigo.com",
    title: "PT Guwigo Teknologi Indonesia",
    description:
      "Building Smarter Digital Future. Ekosistem teknologi terdepan dari Yogyakarta untuk Indonesia.",
    siteName: "Guwigo Indonesia",
    images: [
      {
        url: "/images/branding/og-image.jpg", // Pastikan file ini ada di folder public
        width: 1200,
        height: 630,
        alt: "PT Guwigo Teknologi Indonesia Ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Guwigo Teknologi Indonesia",
    description:
      "Building Smarter Digital Future. Ekosistem teknologi terdepan dari Yogyakarta untuk Indonesia.",
    images: ["/images/branding/og-image.jpg"],
  },
  icons: {
    icon: "/images/branding/loader.png", // Menggunakan logo monogram
    shortcut: "/images/branding/loader.png",
    apple: "/images/branding/loader.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="facebook-domain-verification" content="4y1otfhgq0nwyd56ro4pexr9xt0wv7" />
        {/* === GOOGLE ADSENSE SCRIPT === */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1681916260628500"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${newsreader.variable} ${plusJakartaSans.variable} font-sans bg-[#FAF9F6] text-[#0F172A]`}
      >
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              {/* GlobalLoader membungkus seluruh UI agar transisi mulus */}
              <GlobalLoader>
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <LiveChatWidget />
                <Toaster position="top-center" richColors />
              </GlobalLoader>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
