import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 配置（用于 next dev --turbo），保持不变
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },

  // images 配置，保持不变
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'media.steampowered.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shared.akamai.steamstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'store.akamai.steamstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 重点：修正 Webpack 配置
  webpack(config) {
    // 1. 找到 Next.js 内置的 SVG 处理规则
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // 2. 修改内置规则，让它在特定情况下（如 ?url）仍然生效
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // 3. 添加 @svgr/webpack 规则，用于将 SVG 作为 React 组件导入
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: /url/ }, //
        use: ['@svgr/webpack'],
      },
    )

    // 4. 告诉旧的规则忽略所有其他的 .svg 文件
    fileLoaderRule.exclude = /\.svg$/i

    return config;
  },
};

export default nextConfig;