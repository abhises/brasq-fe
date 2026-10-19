import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  title: 'BrasQ – Independently tested for the home',
  description: 'BrasQ tests household products in a real home. Independent buying guides and reviews for kitchen, cleaning, sleep and home.',
  icons: {
    icon: "/favicon.png", // Path relative to the public folder
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/brasq.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
