/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静的ファイルとしてエクスポート
  assetPrefix: './', // リソースパスを相対パスに変更
  trailingSlash: true, // フォルダ構造に適したスラッシュを付加
};

module.exports = nextConfig;
