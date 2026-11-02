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

const INFORMATIONAL = `<article class="bq-article bq-infopost">
<nav class="bq-crumbs"><a href="/">Home</a><a href="/category/category-slug">Category</a><a href="/guide/guide-slug">Guide</a><span>Topic</span></nav>
<div class="bq-guide-top">
  <header class="bq-guide-head">
    <div class="bq-tagline"><span class="bq-tag bq-tag--dark">Explained</span><span>0 min read</span></div>
    <h1 class="bq-h1">How long does … last?</h1>
    <p class="bq-lead">The answer in one sentence, then what you tested to find out.</p>
    <div class="bq-meta">
      <div class="bq-meta__author"><div class="bq-avatar"><!-- <img src="…" alt=""> --></div><div>Written by<br><a href="/author/author-slug">Author name</a></div></div>
      <div>Reviewed by<br><a href="/author/ryan-mitchell">Ryan Mitchell</a>, editor-in-chief</div>
      <div>Updated<br><strong>Month D, 2026</strong></div>
      <div>Based on<br><strong>… of testing</strong></div>
    </div>
    <div class="bq-disclosure-row">
      ${disclosure}
      <button type="button" class="bq-btn-outline-sm" data-bq-copy>Copy link</button>
    </div>
  </header>
  <figure class="bq-hero-fig"><div class="bq-photo"><!-- <img src="…" alt="…"> --></div><figcaption>Caption for the lead photo.</figcaption></figure>
</div>
<div class="bq-layout">
  <aside class="bq-toc" data-bq-spy>
    <div class="bq-toc__title">In this article</div>
    <a href="#i-summary">The short answer</a>
    <a href="#i-section-1">First section</a>
    <a href="#i-steps">How to …</a>
    <a href="#i-myths">Myths</a>
    <a href="#i-faq">FAQ</a>
    <a class="bq-toc__top" href="#">Back to top ↑</a>
  </aside>
  <div class="bq-content">
<details class="bq-toc-mobile"><summary>In this article</summary><nav><a href="#i-summary">The short answer</a><a href="#i-section-1">First section</a><a href="#i-steps">How to …</a><a href="#i-myths">Myths</a><a href="#i-faq">FAQ</a></nav></details>

<section id="i-summary" class="bq-summary">
  <h2 class="bq-h2 bq-h2--sm">The short answer</h2>
  <ol><li><span>Point one.</span></li><li><span>Point two.</span></li><li><span>Point three.</span></li></ol>
</section>

<div class="bq-stats">
  <div><strong>000</strong><span>what this number means</span></div>
  <div><strong>00&nbsp;mo</strong><span>…</span></div>
  <div><strong>00%</strong><span>…</span></div>
  <div><strong>$00</strong><span>…</span></div>
</div>

<section id="i-section-1" class="bq-section">
  <h2 class="bq-h2">First section</h2>
  <p class="bq-p">Body text. Link products in red: <a class="bq-plink" href="/review/product-slug">Product name</a>.</p>
  <div class="bq-def"><span class="bq-eyebrow">Definition</span><p><strong>Term:</strong> what it means.</p></div>
  <h3 class="bq-h3">Subheading</h3>
  <p class="bq-p">…</p>
  <figure class="bq-chart">
    <div class="bq-chart__head"><strong>Chart title</strong><span>unit</span></div>
    <div class="bq-bars">
      <div class="bq-bar"><span>Label</span><span class="bq-bar__track"><span style="width:100%"></span></span><span>48 min</span></div>
      <div class="bq-bar bq-bar--hl"><span>Label</span><span class="bq-bar__track"><span style="width:65%"></span></span><span>31 min</span></div>
    </div>
    <figcaption>What the orange bar means.</figcaption>
  </figure>
  <blockquote class="bq-pull"><p>“A quote from the tester.”</p><cite>Name, role at BrasQ</cite></blockquote>
  <ul class="bq-arrows"><li><span><strong>Sign one.</strong> Explanation.</span></li><li><span><strong>Sign two.</strong> Explanation.</span></li></ul>
  <div class="bq-warn"><span class="bq-eyebrow">Safety warning</span><p>…</p></div>
</section>

<section id="i-steps" class="bq-section">
  <h2 class="bq-h2">How to …</h2>
  <div class="bq-howto-meta"><span><strong>Time:</strong> …</span><span><strong>Difficulty:</strong> …</span><span><strong>Tools:</strong> …</span></div>
  <ol class="bq-nsteps bq-nsteps--titled">
    <li><div><strong>Step title</strong><p>What to do.</p></div></li>
    <li><div><strong>Step title</strong><p>What to do.</p></div></li>
  </ol>
  <p class="bq-tip"><strong>Our tip:</strong> …</p>
  <div class="bq-twobox">
    <div><span class="bq-eyebrow bq-eyebrow--yes">Do this if</span><ul><li class="bq-plus">…</li></ul></div>
    <div><span class="bq-eyebrow bq-eyebrow--no">Do that if</span><ul><li class="bq-minus">…</li></ul></div>
  </div>
</section>

<section id="i-myths" class="bq-section">
  <h2 class="bq-h2">Myths, checked</h2>
  <div class="bq-claims">
    <div class="bq-claim"><div><span class="bq-verdict-tag">Myth</span><strong>The claim.</strong></div><p>What we found.</p></div>
    <div class="bq-claim"><div><span class="bq-verdict-tag bq-verdict-tag--true">True</span><strong>The claim.</strong></div><p>…</p></div>
    <div class="bq-claim"><div><span class="bq-verdict-tag bq-verdict-tag--partly">Partly true</span><strong>The claim.</strong></div><p>…</p></div>
  </div>
</section>

<section id="i-faq" class="bq-faq">
  <h2 class="bq-h2">Frequently asked questions</h2>
  <details><summary>Question?</summary><p>Answer.</p></details>
</section>

<section class="bq-helpful" data-bq-helpful><strong>Was this article helpful?</strong><div><button type="button" data-vote="yes">Yes</button><button type="button" data-vote="no">No</button></div></section>

<section class="bq-about">
  <div class="bq-avatar"><!-- <img src="…" alt=""> --></div>
  <div><span class="bq-eyebrow">About the author</span><a class="bq-about__name" href="/author/author-slug">Author name</a><p>Short bio.</p></div>
</section>
<div class="bq-history bq-history--dated"><strong>Update history</strong><ul><li><time>Mon D, 2026</time><span>First published.</span></li></ul></div>
<div class="bq-history"><strong>Sources</strong><ul><li>…</li></ul></div>
  </div>
</div>

<section class="bq-keep">
  <h2 class="bq-h2 bq-h2--rule" style="font-size:36px">Keep reading</h2>
  <div class="bq-keep__grid">
    <a href="/guide/guide-slug"><div class="bq-photo"><!-- <img src="…" alt=""> --></div><span class="bq-eyebrow">Buying guide</span><strong>Title</strong></a>
  </div>
</section>
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
