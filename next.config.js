/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'offlineCache',
                expiration: {
                    maxEntries: 200
                }
            }
        }
    ]
});

const nextConfig = {
    output: 'export', // để tạo thư mục out với index.html
    typescript: {
        ignoreBuildErrors: true // bỏ qua lỗi TS khi build
    },
    eslint: {
        ignoreDuringBuilds: true // bỏ qua ESLint khi build
    }
};

module.exports = withPWA(nextConfig);
