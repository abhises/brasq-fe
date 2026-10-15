import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { Photo } from '@/components/site/Cards';
import { getPublic } from '@/lib/api';
import type { Author } from '@/lib/types';

export const metadata: Metadata = { title: 'The editorial team | BrasQ' };

export default async function TeamPage() {
  await connection();
  const { authors } = (await getPublic<{ authors: Author[] }>('/authors'))!;
  return (
    <div className="bq-page" style={{ paddingTop: 36, gap: 36 }}>
      <div className="bq-stack" style={{ gap: 14, maxWidth: 760 }}>
        <h1 className="bq-h1 bq-h1--xl">The editorial team</h1>
        <p className="bq-lead" style={{ fontSize: 18 }}>{authors.length} people test, write and fact-check everything you read on BrasQ. Each of them has hands-on experience in the field they write about.</p>
      </div>
      <div className="bq-team">
        {authors.map((a) => (
          <Link key={a.slug} href={`/author/${a.slug}`}>
            <Photo src={a.avatarUrl} alt={a.name} className="bq-photo--1" />
            <strong>{a.name}</strong>
            <span className="bq-role">{a.role}</span>
            <span>{a.short}</span>
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px 24px', flexWrap: 'wrap', fontSize: 15, fontWeight: 700, borderTop: '3px solid var(--ink)', paddingTop: 20 }}>
        <Link href="/how-we-test">How we test</Link><Link href="/editorial-guidelines">Editorial guidelines</Link><Link href="/contact">Contact</Link>
      </div>
    </div>
  );
}
