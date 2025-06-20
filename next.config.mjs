// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // This rule applies to all pages of your Vercel app
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://www.samuelholley.com/', // Allow iFraming from your Wix domain
            // A more modern approach would be to remove X-Frame-Options
            // and use Content-Security-Policy instead, but let's try this first for simplicity.
          },
          // If you want to be more modern and secure (RECOMMENDED LATER, but more complex to get right initially):
          // {
          //   key: 'Content-Security-Policy',
          //   value: "frame-ancestors 'self' https://www.samuelholley.com https://*.wix.com;",
          // }
        ],
      },
    ];
  },
};

export default nextConfig;
