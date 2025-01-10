/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
          bodySizeLimit: '10mb', // ขยายขนาด body เป็น 10 MB
        },
      },
    };

module.exports = nextConfig;
