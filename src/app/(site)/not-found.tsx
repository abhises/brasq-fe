import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bq-page bq-page--slim" style={{ padding: '72px 20px', gap: 18 }}>
      <span className="bq-mono" style={{ fontSize: 14 }}>404</span>
      <h1 className="bq-h1" style={{ fontSize: 'clamp(36px,5vw,56px)', lineHeight: 1 }}>This page doesn&apos;t exist (anymore)</h1>
      <div className="bq-row"><Link href="/" className="bq-btn bq-btn--dark">Go to the homepage</Link><Link href="/search" className="bq-btn bq-btn--outline">Search</Link></div>
    </div>
  );
}
