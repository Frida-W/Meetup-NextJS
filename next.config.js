/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{ //nextjs对静态资源有限制，这里是放使用Image的白名单
    domains:[""]
  }

}

const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
