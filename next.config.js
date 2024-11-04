/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pro-age.ru', 'via.placeholder.com'],
    unoptimized: true,
  }
}

module.exports = nextConfig
