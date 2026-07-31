import { Lock, Database, Eye, Server } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="container mx-auto px-4 sm:px-6 mb-12 text-center max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-slate-500">
          Komitmen kami untuk melindungi data pribadi dan privasi digital Anda.
        </p>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-4">
          Last Updated: Januari 2026
        </p>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed mb-8 border-l-4 border-blue-500 pl-4 bg-slate-50 py-4 pr-4 rounded-r-lg">
            Di PT Guwigo Teknologi Indonesia, privasi Anda adalah prioritas.
            Kebijakan ini menjelaskan bagaimana kami mengelola data pada
            ekosistem aplikasi kami (EduPass, DSN Connect, Guwigo Tasbih, dll).
          </p>

          {/* Section 1 */}
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <Database className="text-blue-600" size={24} />
              1. Data yang Kami Kumpulkan
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>Informasi Akun:</strong> Nama, Email, dan Nomor Telepon
                saat Anda mendaftar di layanan Guwigo ID.
              </li>
              <li>
                <strong>Data Akademik (Khusus EduPass):</strong> Data presensi
                dan peminjaman barang hanya digunakan untuk keperluan internal
                kampus FMIPA UII.
              </li>
              <li>
                <strong>Data Perangkat:</strong> Model perangkat dan versi OS
                untuk keperluan <i>debugging</i> dan optimasi aplikasi.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <Eye className="text-blue-600" size={24} />
              2. Penggunaan Data
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Kami menggunakan data Anda hanya untuk tujuan berikut:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Memproses pesanan di Guwigo Store.</li>
              <li>Memberikan akses ke sistem EduPass dan DSN Connect.</li>
              <li>Menghubungi Anda terkait update status servis perangkat.</li>
              <li>
                Kami <strong>TIDAK AKAN</strong> menjual data Anda ke pihak
                ketiga untuk tujuan pemasaran.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <Lock className="text-blue-600" size={24} />
              3. Keamanan Data
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Kami menerapkan standar keamanan industri (Enkripsi SSL/TLS) untuk
              melindungi data saat transmisi. Password akun Anda disimpan dalam
              bentuk <i>hash</i> (terenkripsi satu arah) dan tidak dapat dibaca
              oleh staf kami sekalipun.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <Server className="text-blue-600" size={24} />
              4. Server & Penyimpanan
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Data aplikasi kami disimpan di server cloud yang aman (Google
              Cloud Platform & Vercel) yang memiliki standar keamanan ISO 27001.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
