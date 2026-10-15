import Link from 'next/link';
import { connection } from 'next/server';
import { Avatar, GuideCard, Photo, TesterCard } from '@/components/site/Cards';
import { NewsletterForm } from '@/components/site/NewsletterForm';
import { getPublic } from '@/lib/api';
import { longDate, postUrl, slugify } from '@/lib/format';
import type { AuthorCard, Category, PostCard } from '@/lib/types';

const TRUST = [['1,240', 'products tested since 2019'], ['5', 'staff testers and editors, all named'], ['0', 'paid placements in our guides'], ['4× a year', 'we re-check every buying guide']];
const STEPS = [['01', 'We buy it ourselves', 'We buy most products in stores, just like you.'], ['02', 'We use it for weeks', 'Every product becomes part of daily life in our test house.'], ['03', 'We measure', 'Fixed test protocols per category, so results are comparable.'], ['04', 'We keep testing', 'We keep using our picks longer to spot wear and failures.']];

type Home = { hero: PostCard | null; guides: PostCard[]; categories: Category[]; testers: AuthorCard[] };

export default async function HomePage() {
  await connection();
  const { hero, guides, categories, testers } = (await getPublic<Home>('/home'))!;
  return (
    <div>
      {hero && (
        <section className="bq-container bq-hero">
          <div className="bq-hero__text">
            {hero.category && <Link href={`/category/${hero.category.slug}`} className="bq-tag">Buying guide ·&nbsp;{hero.category.name}</Link>}
            <h1 className="bq-h1 bq-hero__title"><Link href={postUrl(hero)}>{hero.title}</Link></h1>
            <p className="bq-lead" style={{ fontSize: 18 }}>{hero.excerpt}</p>
            {hero.author && (
              <div className="bq-hero__byline">
                <Avatar author={hero.author} />
                <div><Link href={`/author/${hero.author.slug}`}>{hero.author.name}</Link>,&nbsp;{hero.author.role.toLowerCase()}<br />Updated&nbsp;{longDate(hero.updatedAt)}</div>
              </div>
            )}
            <div className="bq-row">
              <Link href={postUrl(hero)} className="bq-btn bq-btn--dark">Read the buying guide</Link>
              {hero.topPick && <Link href={`/review/${slugify(hero.topPick)}`} className="bq-btn bq-btn--outline">{hero.topPick} review</Link>}
            </div>
          </div>
          <Link href={postUrl(hero)} style={{ display: 'block' }}>
            <Photo src={hero.coverImage} alt={hero.title} className="bq-photo--43">
              {hero.testedCount ? <div className="bq-hero__count"><span>Tested</span><strong>{hero.testedCount}</strong></div> : null}
            </Photo>
          </Link>
        </section>
      )}

      <section className="bq-band-dark">
        <div className="bq-container bq-facts">
          {TRUST.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}
        </div>
      </section>

      <section className="bq-container bq-block">
        <div className="bq-section-head"><h2 className="bq-h2">Latest buying guides</h2><Link href="/search" className="bq-link-strong">All buying guides →</Link></div>
        <div className="bq-cards">{guides.map((g) => <GuideCard key={g.id} post={g} />)}</div>
      </section>

      <section className="bq-container" style={{ paddingBottom: 52, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 className="bq-h2 bq-h2--rule">Categories</h2>
        <div className="bq-catgrid">
          {categories.map((c) => <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}<span>{c.guideCount} {c.guideCount === 1 ? 'guide' : 'guides'}</span></Link>)}
        </div>
      </section>

      <section className="bq-band-yellow">
        <div className="bq-container bq-block" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span className="bq-eyebrow bq-eyebrow--ink">How we test</span>
            <h2 className="bq-h2" style={{ fontSize: 'clamp(30px,4vw,40px)', lineHeight: 1, letterSpacing: '-0.035em' }}>Tested in an ordinary American home</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>No lab, just a house in Columbus, Ohio, with hardwood floors, shag carpet, a staircase and a cat. We buy most products ourselves, use them for weeks and publish our measurements.</p>
            <Link href="/how-we-test" className="bq-btn bq-btn--dark" style={{ alignSelf: 'flex-start' }}>Read our test method</Link>
          </div>
          <ol className="bq-steps">
            {STEPS.map(([n, t, d]) => <li key={n}><span>{n}</span><span><strong>{t}</strong>{d}</span></li>)}
          </ol>
        </div>
      </section>

      <section className="bq-container bq-block" style={{ gap: 24 }}>
        <div className="bq-section-head"><h2 className="bq-h2">Our testers</h2><Link href="/team" className="bq-link-strong">Full editorial team →</Link></div>
        <div className="bq-testers">{testers.map((a) => <TesterCard key={a.slug} author={a} />)}</div>
      </section>

      <section className="bq-container" style={{ paddingBottom: 60 }}>
        <div className="bq-newsband">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 520 }}>
            <h2>One email a week with our latest test results</h2>
            <p>Plus deals we&apos;ve checked ourselves. Unsubscribe anytime.</p>
          </div>
          <NewsletterForm source="home" />
        </div>
      </section>
    </div>
  );
}
