import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@ant-design/nextjs-registry',
    '@ant-design/colors',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    'antd',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-tree',
    'rc-table',
  ],
  experimental: {
    optimizePackageImports: ['antd'],
  },
};

export default nextConfig;
