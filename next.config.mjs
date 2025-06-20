// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // UPDATED: Added *.wixstudio.com to be safe
            value: "frame-ancestors 'self' https://www.samuelholley.com https://*.wix.com https://*.wixstudio.com;",
          }
        ],
      },
    ];
  },
};

export default nextConfig;
