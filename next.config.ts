/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // <--- SUDAH DIMATIKAN: Agar API AI Chat bisa menyala di server

  images: {
    unoptimized: true, // Ini boleh dibiarkan menyala agar gambar tidak error
  },
};

export default nextConfig;
