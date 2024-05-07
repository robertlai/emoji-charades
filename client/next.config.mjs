/** @type {import('next').NextConfig} */

const API_URL = "http://localhost:3001";
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/socket.io",
        destination: `${API_URL}/socket.io/`,
      },
    ];
  },
  reactStrictMode: false,
};

export default nextConfig;
