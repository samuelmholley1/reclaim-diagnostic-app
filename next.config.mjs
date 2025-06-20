// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // This applies to all pages in your Vercel app
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // This is the crucial line. It tells browsers to ONLY allow framing 
            // from your Wix site and any *.wix.com domain (for the editor).
            value: "frame-ancestors 'self' https://www.samuelholley.com https://*.wix.com;",
          }
        ],
      },
    ];
  },
};

export default nextConfig;
