// app/layout.js

import './globals.css' // This imports your global styles

// This metadata will appear in the browser tab
export const metadata = {
  title: 'Reclaim by Design - AI Readiness Assessment',
  description: 'A guided reflection to provide clarity on your relationship with AI.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* The {children} prop here is where your page.js content will be rendered */}
        {children}
      </body>
    </html>
  )
}