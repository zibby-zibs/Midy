/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io', 'accountabilitylab.org']
  }
}

module.exports = nextConfig
