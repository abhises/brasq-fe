import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'BrasQ admin', robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/admin.css" />
      {children}
    </>
  );
}
