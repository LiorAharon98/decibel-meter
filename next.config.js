/** @type {import('next').NextConfig} */

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}
if (process.env.NODE_ENV === "production") {
  require("dotenv").config();
}

const nextConfig = {
  reactStrictMode: true,

  env: {
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
