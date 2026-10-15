import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterForm } from '@/components/site/NewsletterForm';

export const metadata: Metadata = { title: 'Newsletter | BrasQ' };

export default function NewsletterPage() {
  return (
    <div className="bq-page bq-page--slim">
      <span className="bq-tag">Newsletter</span>
      <h1 className="bq-h1" style={{ fontSize: 'clamp(36px,5.6vw,60px)' }}>One email a week with what we really liked</h1>
      <p className="bq-lead" style={{ fontSize: 18 }}>Every Friday: new test results, updated buying guides and deals we&apos;ve compared against the price over the past 90 days.</p>
      <NewsletterForm source="newsletter-page" variant="boxed" doneClass="bq-tag bq-tag--yellow" />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>Unsubscribe with one click at the bottom of every email. We never share your email address. <Link href="/privacy" style={{ color: 'var(--muted)' }}>Privacy policy</Link></p>
    </div>
  );
}
