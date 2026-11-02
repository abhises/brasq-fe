import type { PostType } from '@/lib/types';

/**
 * Starting HTML for a new post, per type. Same structure as the seeded posts; replace the placeholder text,
 * links and images. Components are documented in CONTENT_GUIDE.md.
 */

const disclosure = '<p class="bq-disclosure">We choose products independently. We may earn a commission through links on this page; your price stays the same. <a href="/how-we-make-money">Affiliate policy</a></p>';

const GUIDE = `<article class="bq-article">
<nav class="bq-crumbs"><a href="/">Home</a><span>New guide</span></nav>
<div class="bq-guide-top">
  <header class="bq-guide-head">
    <span class="bq-tag">Buying guide</span>
    <h1 class="bq-h1">The best … of 2026</h1>
    <p class="bq-lead">One-paragraph summary of the verdict.</p>
    ${disclosure}
  </header>
  <div class="bq-photo bq-guide-hero"><!-- <img src="…" alt="…"> --></div>
</div>
<div class="bq-content" style="margin:0 auto">
  <section id="picks" class="bq-section">
    <h2 class="bq-h2">Our picks at a glance</h2>
    <!-- copy a .bq-pick block from CONTENT_GUIDE.md -->
  </section>
</div>
</article>`;

const LETTERS = ['A', 'B', 'C', 'D'];
const NUM_WORD: Record<number, string> = { 2: 'two', 3: 'three', 4: 'four' };

export function comparisonStarter(n: 2 | 3 | 4) {
  const ps = LETTERS.slice(0, n).map((l) => `Product ${l}`);
  const card = (name: string, i: number) => `    <div class="bq-prod">
      <div class="bq-prod__tag${i === 0 ? ' bq-prod__tag--hl' : ''}">${i === 0 ? 'Our pick' : 'Label'}</div>
      <a class="bq-photo bq-photo--1" href="/review/product-slug"><!-- <img src="…" alt="${name}"> --></a>
      <div class="bq-prod__body">
        <a class="bq-prod__name" href="/review/product-slug">${name}</a>
        <div class="bq-prod__score"><span class="bq-score">Test score <strong>0.0</strong></span><span>Best in 0 of 0 tests</span></div>
        <p class="bq-prod__text">One line on what it does best.</p>
        <a class="bq-btn bq-btn--black" href="AFFILIATE_URL" rel="sponsored nofollow" target="_blank">$000 at Amazon</a>
        <a class="bq-link-strong" href="/review/product-slug">Read the full review</a>
      </div>
    </div>`;
  const row = (label: string, unit: string, winner = 0) =>
    `      <tr><th>${label}<span>${unit}</span></th>${ps.map((_, i) => (i === winner ? '<td class="bq-win">— <span class="bq-win__mark">✓ Best</span></td>' : '<td>—</td>')).join('')}</tr>`;
  const which = (name: string, i: number) => `  <div class="bq-which">
    <div class="bq-which__head"><a class="bq-prod__name" href="/review/product-slug">${name}</a><span class="bq-tag bq-tag--sm${i === 0 ? '' : ' bq-tag--dark'}">${i === 0 ? 'Our pick' : 'Label'}</span></div>
    <div class="bq-buyskip">
      <div class="bq-buyskip__yes"><strong>Buy it if</strong><ul><li>…</li><li>…</li></ul></div>
      <div class="bq-buyskip__no"><strong>Skip it if</strong><ul><li>…</li><li>…</li></ul></div>
    </div>
    <a class="bq-btn bq-btn--black" href="AFFILIATE_URL" rel="sponsored nofollow" target="_blank">$000 at Amazon</a>
  </div>`;

  return `<article class="bq-article bq-compare">
<nav class="bq-crumbs"><a href="/">Home</a><a href="/category/category-slug">Category</a><span>Comparison</span></nav>
<div class="bq-guide-top">
  <header class="bq-guide-head">
    <span class="bq-tag">Comparison · ${n}&nbsp;products</span>
    <h1 class="bq-h1">${ps.join(' vs ')}: which should you buy?</h1>
    <p class="bq-lead">Two sentences: how you tested them and the headline difference.</p>
    <div class="bq-meta">
      <div class="bq-meta__author"><div class="bq-avatar"><!-- <img src="…" alt=""> --></div><div>Tested and written by<br><a href="/author/author-slug">Author name</a></div></div>
      <div>Updated<br><strong>Month D, 2026</strong></div>
      <div>Test period<br><strong>0&nbsp;weeks · ${n}&nbsp;models</strong></div>
    </div>
    ${disclosure}
  </header>
  <div class="bq-photo bq-guide-hero"><!-- <img src="…" alt="The products side by side"> --></div>
</div>

<section id="c-lineup" class="bq-section">
  <div class="bq-lineup-head"><h2 class="bq-h2">The ${NUM_WORD[n]} products</h2><span class="bq-note">Prices checked Month D, 2026</span></div>
  <div class="bq-lineup bq-lineup--${n}">
${ps.map(card).join('\n')}
${n === 2 ? '    <div class="bq-vs" aria-hidden="true">vs</div>\n' : ''}  </div>
</section>

<div class="bq-compare__body">
<section id="c-summary" class="bq-summary">
  <h2 class="bq-h2 bq-h2--sm">The short answer</h2>
  <ol><li><span>Who should buy ${ps[0]}.</span></li><li><span>Who should buy ${ps[1]}.</span></li><li><span>The biggest difference.</span></li></ol>
</section>

<section id="c-how" class="bq-section">
  <h2 class="bq-h2">How we compared them</h2>
  <p class="bq-p">Where and how long you tested, and what you measured.</p>
</section>
</div>

<section id="c-h2h" class="bq-section">
  <div class="bq-compare__body"><h2 class="bq-h2">Head to head</h2><p class="bq-p">The better result in each row is marked.</p></div>
  <div class="bq-table-wrap"><table class="bq-h2h">
    <thead><tr><th>Test</th>${ps.map((p) => `<th><a href="/review/product-slug">${p}</a></th>`).join('')}</tr></thead>
    <tbody>
${row('Price', 'lowest at time of writing')}
${row('Test score', 'out of 10')}
${row('Test 1', 'unit')}
${row('Test 2', 'unit', 1)}
      <tr class="bq-h2h__tally"><th>Rows won</th>${ps.map(() => '<td>0</td>').join('')}</tr>
    </tbody>
  </table></div>
</section>

<div class="bq-compare__body">
<section id="c-which" class="bq-section">
  <h2 class="bq-h2">Which one should you buy?</h2>
${ps.map(which).join('\n')}
</section>

<section id="c-verdict" class="bq-verdict bq-verdict--dark">
  <span class="bq-eyebrow">Our verdict</span>
  <p>One or two sentences: which to buy, and when the other one is worth it.</p>
  <div class="bq-verdict__actions"><a class="bq-btn bq-btn--buy" href="AFFILIATE_URL" rel="sponsored nofollow" target="_blank">${ps[0]}: $000 at Amazon</a><a href="/guide/guide-slug">See all products we tested</a></div>
</section>

<section id="c-faq" class="bq-faq">
  <h2 class="bq-h2">Frequently asked questions</h2>
  <details><summary>Question?</summary><p>Answer.</p></details>
</section>
</div>
</article>`;
}

const INFORMATIONAL = `<article class="bq-article bq-explainer">
<nav class="bq-crumbs"><a href="/">Home</a><a href="/category/category-slug">Category</a><span>Explained</span></nav>
<div class="bq-guide-top">
  <header class="bq-guide-head">
    <span class="bq-tag bq-tag--dark">Explained</span>
    <h1 class="bq-h1">How does … work?</h1>
    <p class="bq-lead">What the reader will understand after reading this.</p>
    <div class="bq-meta">
      <div class="bq-meta__author"><div class="bq-avatar"><!-- <img src="…" alt=""> --></div><div>Written by<br><a href="/author/author-slug">Author name</a></div></div>
      <div>Updated<br><strong>Month D, 2026</strong></div>
      <div>Reading time<br><strong>0&nbsp;minutes</strong></div>
    </div>
    <p class="bq-disclosure">This article explains a topic and doesn’t rank products. It links to our tests, and we may earn a commission through those links. <a href="/how-we-make-money">Affiliate policy</a></p>
  </header>
  <div class="bq-photo bq-guide-hero"><!-- <img src="…" alt="…"> --></div>
</div>
<div class="bq-layout">
  <aside class="bq-toc">
    <div class="bq-toc__title">In this article</div>
    <a href="#i-takeaways">Key takeaways</a>
    <a href="#i-section-1">First section</a>
    <a href="#i-next">Ready to choose one?</a>
    <a href="#i-faq">FAQ</a>
  </aside>
  <div class="bq-content">
<details class="bq-toc-mobile"><summary>In this article</summary><nav><a href="#i-takeaways">Key takeaways</a><a href="#i-section-1">First section</a><a href="#i-next">Ready to choose one?</a><a href="#i-faq">FAQ</a></nav></details>

<section id="i-takeaways" class="bq-summary">
  <h2 class="bq-h2 bq-h2--sm">Key takeaways</h2>
  <ol><li><span>Takeaway one.</span></li><li><span>Takeaway two.</span></li><li><span>Takeaway three.</span></li></ol>
</section>

<section id="i-section-1" class="bq-section">
  <h2 class="bq-h2">First section</h2>
  <p class="bq-p">Body text.</p>
  <ol class="bq-numbered bq-numbered--boxed"><li><div><strong>Step one</strong><p>…</p></div></li><li><div><strong>Step two</strong><p>…</p></div></li></ol>
  <aside class="bq-callout"><span class="bq-eyebrow">From our tests</span><strong>A finding worth highlighting</strong><p>…</p></aside>
</section>

<section id="i-myths" class="bq-section">
  <h2 class="bq-h2">Myths we hear most</h2>
  <div class="bq-myths"><div class="bq-myth"><span class="bq-myth__k">Myth</span><strong>The claim.</strong><span class="bq-myth__k bq-myth__k--ok">What we found</span><p>What the tests showed.</p></div></div>
</section>

<section id="i-next" class="bq-next">
  <span class="bq-eyebrow">Ready to choose one?</span>
  <p>One line pointing readers to the tested picks.</p>
  <div class="bq-next__links">
    <a href="/guide/guide-slug"><span class="bq-eyebrow">Buying guide</span><strong>The best … of 2026</strong><span>Short description.</span></a>
    <a href="/compare/comparison-slug"><span class="bq-eyebrow">Comparison</span><strong>Product A vs Product B</strong><span>Short description.</span></a>
  </div>
</section>

<section id="i-faq" class="bq-faq">
  <h2 class="bq-h2">Frequently asked questions</h2>
  <details><summary>Question?</summary><p>Answer.</p></details>
</section>
  </div>
</div>
</article>`;

const PAGE = `<div class="bq-page bq-page--narrow">
  <h1 class="bq-h1">Page title</h1>
  <p class="bq-lead">Intro.</p>
</div>`;

export function starterHtml(type: PostType, products: 2 | 3 | 4 = 2) {
  if (type === 'comparison') return comparisonStarter(products);
  if (type === 'informational') return INFORMATIONAL;
  if (type === 'page') return PAGE;
  return GUIDE; // guide and review start from the guide skeleton; copy a review from the admin for the review layout
}
