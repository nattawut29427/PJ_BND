/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
          bodySizeLimit: '10mb', // ขยายขนาด body เป็น 10 MB
        },
      },
      images: {
        domains: ["lh3.googleusercontent.com"], // อนุญาตให้ใช้ภาพจากโฮสต์นี้
      },
    };

module.exports = nextConfig;
