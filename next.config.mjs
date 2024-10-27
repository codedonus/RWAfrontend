/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tomato-tired-rattlesnake-260.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      }
    ]
  },
  reactStrictMode: true,
};

export default nextConfig;
