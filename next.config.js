/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // để tạo thư mục out với index.html
    typescript: {
        ignoreBuildErrors: true // bỏ qua lỗi TS khi build
    },
    eslint: {
        ignoreDuringBuilds: true // bỏ qua ESLint khi build
    }
};

module.exports = nextConfig;
