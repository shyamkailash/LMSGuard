import "./globals.css";

export const metadata = {
  title: "LMSGuard AI — Examination Monitoring System",
  description: "AI Powered Online Examination Monitoring System",
  icons: {
    icon: "data:image/svg+xml," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="8" fill="#2563EB"/>
        <text x="16" y="22" font-size="15" font-family="Inter,sans-serif" font-weight="700"
          fill="#fff" text-anchor="middle">LG</text>
      </svg>`
    ),
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
