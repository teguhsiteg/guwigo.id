import { ScrollText, ShieldCheck, Scale, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="container mx-auto px-4 sm:px-6 mb-12 text-center max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-slate-500">
          Syarat dan ketentuan penggunaan layanan PT Guwigo Teknologi Indonesia.
        </p>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-4">
          Last Updated: Januari 2026
        </p>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="prose prose-slate max-w-none">
          {/* Section 1 */}
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <ScrollText className="text-blue-600" size={24} />
              1. Pendahuluan
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Selamat datang di Guwigo Indonesia. Dengan mengakses website
              (guwigo.id), menggunakan aplikasi kami (EduPass, DSN Connect,
              Tasbih), atau membeli produk di Store kami, Anda dianggap telah
              membaca, memahami, dan menyetujui Syarat & Ketentuan ini.
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <Scale className="text-blue-600" size={24} />
              2. Layanan Software House
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>Hak Kekayaan Intelektual:</strong> Source code final
                akan menjadi milik Klien sepenuhnya setelah pelunasan
                pembayaran, kecuali dinyatakan lain dalam kontrak terpisah.
              </li>
              <li>
                <strong>Garansi:</strong> Kami memberikan garansi{" "}
                <i>bug-fixing</i> selama masa <i>maintenance</i> yang disepakati
                (biasanya 3-6 bulan pasca rilis).
              </li>
              <li>
                <strong>Revisi:</strong> Batas revisi diatur dalam{" "}
                <i>Scope of Work</i> (SOW). Revisi di luar lingkup akan
                dikenakan biaya tambahan.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <ShieldCheck className="text-blue-600" size={24} />
              3. Layanan Store & Service
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>Garansi Hardware:</strong> Produk gadget bekas (second)
                memiliki garansi toko 7 hari. Produk baru mengikuti garansi
                resmi distributor.
              </li>
              <li>
                <strong>Retur:</strong> Pengembalian barang hanya diterima jika
                ada video <i>unboxing</i> tanpa jeda dan kerusakan bukan akibat
                kesalahan pengguna (jatuh/terkena air).
              </li>
              <li>
                <strong>Service Data:</strong> Klien wajib melakukan backup data
                sebelum menyerahkan perangkat untuk servis. Guwigo tidak
                bertanggung jawab atas kehilangan data selama proses perbaikan
                hardware.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <AlertCircle className="text-blue-600" size={24} />
              4. Batasan Tanggung Jawab
            </h3>
            <p className="text-slate-600 leading-relaxed">
              PT Guwigo Teknologi Indonesia tidak bertanggung jawab atas
              kerugian tidak langsung (<i>consequential loss</i>) yang timbul
              akibat penggunaan layanan kami, termasuk namun tidak terbatas pada
              kehilangan keuntungan bisnis atau gangguan operasional pihak
              ketiga.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
