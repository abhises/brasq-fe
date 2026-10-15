# BrasQ content guide (for humans and Claude)

Every post has an **HTML** field and a **CSS** field. The HTML is the whole page body; the site wraps it in
the header, nav and footer. Style it with the `bq-*` classes from [`public/brasq.css`](public/brasq.css), and use the
post's CSS field only for one-off tweaks (it is injected on that page only).

The easiest way to start a new guide or review is to open an existing one in the admin (e.g. *The best stick vacuum
of 2026*), copy its HTML and replace the content.

## Rules

- **Affiliate links:** every outbound shop link gets `rel="sponsored nofollow" target="_blank"`.
- **Images:** upload in **Admin → Media** (or `POST /api/admin/media`) and use the returned URL. Wrap images in
  `<div class="bq-photo bq-photo--43">…</div>` (`--32`, `--169`, `--1` for other aspect ratios).
- **Anchors:** give each section an `id` so the table of contents can link to it (`<a href="#g-picks">`).
- **No `<script>` tags.** Interactivity comes from the data attributes below.
- Internal links: `/guide/<slug>`, `/review/<slug>`, `/category/<slug>`, `/author/<slug>`, pages at `/<slug>`.
- Fill in the admin fields as well: title, excerpt, category, author, cover image, models tested and top pick feed the
  home page, category pages, search and SEO tags. JSON-LD goes in its own tab.

## Interactive bits (no JS needed in the post)

| Attribute | What it does |
|---|---|
| `<form class="bq-form" data-bq-subscribe data-source="price-alert:my-guide">` with an `input[type=email]` | Newsletter signup, saved to Subscribers |
| `<div class="bq-gallery" data-bq-gallery>` | Thumbnail buttons (`data-src`) swap the main image |
| `<section class="bq-helpful" data-bq-helpful>` with `button[data-vote]` | "Was this helpful?" |
| `<details>` / `<summary>` | FAQ accordions, mobile table of contents |

The **sticky "our pick" bar** and the **newsletter popup** are switched on with fields in the editor sidebar, not in HTML.

## Page skeleton (buying guide)

```html
<article class="bq-article">
  <nav class="bq-crumbs"><a href="/">Home</a><a href="/category/home">Home</a><span>Air purifiers</span></nav>
  <div class="bq-guide-top">
    <header class="bq-guide-head">
      <span class="bq-tag">Buying guide</span>
      <h1 class="bq-h1">The best air purifier of 2026</h1>
      <p class="bq-lead">One-paragraph verdict.</p>
      <div class="bq-meta">
        <div class="bq-meta__author"><div class="bq-avatar"><img src="AVATAR_URL" alt=""></div><div>Tested and written by<br><a href="/author/sarah-miller">Sarah Miller</a></div></div>
        <div>Updated<br><strong>October 15, 2026</strong></div>
        <div>Test period<br><strong>4&nbsp;weeks · 9&nbsp;models</strong></div>
      </div>
      <p class="bq-disclosure">We may earn a commission through links on this page. <a href="/how-we-make-money">Affiliate policy</a></p>
    </header>
    <div class="bq-photo bq-guide-hero"><img src="HERO_URL" alt="…"></div>
  </div>
  <div class="bq-layout">
    <aside class="bq-toc">
      <div class="bq-toc__title">In this guide</div>
      <a href="#g-summary">The short answer</a>
      <a href="#g-picks">Our picks</a>
    </aside>
    <div class="bq-content">
      <details class="bq-toc-mobile"><summary>In this guide</summary><nav><a href="#g-summary">The short answer</a><a href="#g-picks">Our picks</a></nav></details>
      <!-- sections go here -->
    </div>
  </div>
</article>
```

## Components

**Short answer**
```html
<section id="g-summary" class="bq-summary">
  <h2 class="bq-h2 bq-h2--sm">The short answer</h2>
  <ol><li><span>Best for most people: …</span></li><li><span>Best budget pick: …</span></li></ol>
</section>
```

**Pick card**
```html
<div class="bq-pick">
  <a class="bq-photo bq-pick__media" href="/review/product-slug"><img src="IMG" alt="Product"></a>
  <div class="bq-pick__body">
    <div class="bq-pick__top"><span class="bq-tag bq-tag--dark bq-tag--sm">Our pick</span><span class="bq-score">Test score <strong>9.1</strong></span></div>
    <h3 class="bq-pick__name"><a href="/review/product-slug">Product name</a></h3>
    <p class="bq-pick__text">Why we picked it.</p>
    <div class="bq-shops">
      <a class="bq-shop" href="AFFILIATE_URL" rel="sponsored nofollow" target="_blank">Check price on Amazon</a>
      <a class="bq-shop" href="AFFILIATE_URL_2" rel="sponsored nofollow" target="_blank">Check price on Walmart</a>
    </div>
    <a class="bq-link-strong" href="/review/product-slug">Read the full review</a>
  </div>
</div>
```

**Buttons and inline links**
```html
<a class="bq-btn bq-btn--buy" href="AFFILIATE_URL" rel="sponsored nofollow" target="_blank">Check price at Amazon</a>
<a class="bq-btn bq-btn--dark" href="/guide/x">Read the buying guide</a>
<a class="bq-btn bq-btn--outline" href="/review/x">Review</a>
<p class="bq-p">Body text with an <a class="bq-aff" href="AFFILIATE_URL" rel="sponsored nofollow noopener" target="_blank">inline product link</a>.</p>
```

**Section, text, photo, caption**
```html
<section id="g-how" class="bq-section">
  <h2 class="bq-h2">How we tested</h2>
  <p class="bq-p">…</p>
  <div class="bq-photo bq-photo--169"><img src="IMG" alt="…"></div>
  <p class="bq-caption">Caption. Photo: BrasQ</p>
</section>
```

**Trust box**
```html
<section id="g-trust" class="bq-trust"><h2>Why you can trust us</h2><p>…</p>
  <nav><a href="/editorial-guidelines">Editorial guidelines</a><a href="/how-we-make-money">How we make money</a></nav></section>
```

**Data table**
```html
<div class="bq-table-wrap"><table class="bq-table bq-table--mono">
  <thead><tr><th>Model</th><th>Pickup</th><th>Score</th></tr></thead>
  <tbody><tr><td>Vorta S9</td><td>96%</td><td>9.1</td></tr></tbody>
</table></div>
<p class="bq-note">Table note.</p>
```

**Side-by-side comparison** (see the stick vacuum guide for a full example): `table.bq-cmp`, header cells with
`.bq-cmp__label` + `.bq-cmp__head`, group rows `tr.bq-cmp__group`, highlighted column `class="bq-hl"`, cells
`.bq-yes`, `.bq-no`, `.bq-cell-v`, `.bq-minibar`, `.bq-best`.

**Bar chart**
```html
<div class="bq-bars">
  <h3 class="bq-h3">Pickup on carpet</h3>
  <div class="bq-bar bq-bar--hl"><span>Vorta S9</span><span class="bq-bar__track"><span style="width:92%"></span></span><span>92%</span></div>
  <div class="bq-bar"><span>Kleen Air 300</span><span class="bq-bar__track"><span style="width:79%"></span></span><span>79%</span></div>
</div>
```

**Pros / cons**
```html
<div class="bq-proscons">
  <div class="bq-pros"><strong>Pros</strong><ul><li>…</li></ul></div>
  <div class="bq-cons"><strong>Cons</strong><ul><li>…</li></ul></div>
</div>
<p class="bq-choose"><strong>Choose this if</strong> …</p>
```

**Spec box and score breakdown** (sidebar of "picks in depth")
```html
<div class="bq-box"><div class="bq-box__head">Measured</div>
  <div class="bq-kv"><span>Weight</span><strong>2.4 kg</strong></div></div>
<div class="bq-box bq-scorebox"><strong>Score breakdown</strong>
  <div class="bq-meter"><div><span>Suction</span><strong>9.3</strong></div><div class="bq-meter__track"><span style="width:93%"></span></div></div></div>
```

**Cards, tips, numbered lists, definitions**
```html
<div class="bq-grid bq-grid--3"><div class="bq-card"><strong class="bq-card__title">Up to $200</strong><p>…</p></div></div>
<p class="bq-tip"><strong>Our tip:</strong> …</p>
<ol class="bq-numbered"><li><div><strong>Empty the bin</strong><p>…</p></div></li></ol>   <!-- add bq-numbered--boxed for boxed numbers -->
<div class="bq-rows bq-defs"><div><strong>HEPA</strong><span>Definition…</span></div></div>
<div class="bq-verdict"><h2 class="bq-h2">Our final verdict</h2><p class="bq-p">…</p></div>
```

**Price alert / newsletter band**
```html
<section class="bq-alert">
  <div><span class="bq-eyebrow">Price alert</span><h2>Get a heads-up when our picks drop in price</h2><p>…</p></div>
  <form class="bq-form" data-bq-subscribe data-source="price-alert:air-purifiers">
    <input type="email" name="email" placeholder="you@email.com" required><button type="submit">Turn on price alert</button>
  </form>
</section>
```

**FAQ**
```html
<section id="g-faq" class="bq-faq"><h2 class="bq-h2">Frequently asked questions</h2>
  <details><summary>Question?</summary><p>Answer.</p></details></section>
```

**Sources, changelog, author box**
```html
<section class="bq-sources">
  <div><strong class="bq-eyebrow bq-eyebrow--ink">Sources</strong><ul><li>…</li></ul></div>
  <div><strong class="bq-eyebrow bq-eyebrow--ink">Changelog</strong><ul class="bq-changelog"><li><time>Oct 15, 2026</time><span>Published.</span></li></ul></div>
</section>
<section class="bq-authorbox"><div class="bq-avatar"><img src="AVATAR" alt=""></div>
  <div><strong>Sarah Miller</strong><p>Bio…</p><a class="bq-link-strong" href="/author/sarah-miller">Profile and all articles</a></div></section>
```

**Review page** pieces (see any `/review/...` post): `.bq-review-top`, `.bq-gallery[data-bq-gallery]`, `.bq-scoreline`
with `.bq-bigscore` and `.bq-subscore`, `.bq-pricehist`, `.bq-review-meta`, `.bq-quote` (verdict), `.bq-pc2` (pros/cons),
`.bq-fit` (good for / less suited), `.bq-result` (bar vs average), `.bq-timeline`, `.bq-specs`, `.bq-qa`, `.bq-helpful`,
`.bq-person`, and `.bq-mobile-buy` (fixed buy bar on phones; add `bq-has-mobile-buy` to the article).
