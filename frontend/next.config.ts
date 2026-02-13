import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: { typescript: true, dimensions: false }
      }]
    });
    return config;
  },
};

// 이 코드는 내가 접수한다

export default nextConfig;
