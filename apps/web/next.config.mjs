/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  async redirects() {
    return [{ source: '/customizer', destination: '/personalizador', permanent: true }];
  },
};

export default nextConfig;
