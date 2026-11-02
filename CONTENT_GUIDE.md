# BrasQ content guide (for humans and Claude)

> **New: Sections.** Posts and the front page can now be built from *sections* in the admin (Admin → Sections, the
> Sections tab in the post editor, Admin → Front page). Each section is a form; the site renders the HTML. Everything
> below still applies to hand-written HTML and to the templates of section types. See "Sections" at the end.

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
- Internal links: `/guide/<slug>`, `/review/<slug>`, `/compare/<slug>`, `/explained/<slug>`, `/category/<slug>`, `/author/<slug>`, pages at `/<slug>`.
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

## Comparison posts (type `comparison`, URL `/compare/<slug>`)

Two to four products side by side ("Product X vs Product Y"). In **Admin → New post** choose *Comparison* and the number of
products; the editor fills in the layout below. Set **Models tested** to the number of products (shown on category cards)
and **Top pick** to the winner. Order of sections: header, lineup, short answer, how we compared, head to head, which to
buy, verdict, FAQ.

```html
<article class="bq-article bq-compare">
  <!-- header: same .bq-guide-top as a guide, with <span class="bq-tag">Comparison · 2&nbsp;products</span> -->
  <section id="c-lineup" class="bq-section">
    <div class="bq-lineup-head"><h2 class="bq-h2">The two robots</h2><span class="bq-note">Prices checked …</span></div>
    <div class="bq-lineup bq-lineup--2">          <!-- --2, --3 or --4 -->
      <div class="bq-prod">
        <div class="bq-prod__tag bq-prod__tag--hl">Our pick</div>   <!-- --hl only on the first product -->
        <a class="bq-photo bq-photo--1" href="/review/x"><img src="…" alt="…"></a>
        <div class="bq-prod__body">
          <a class="bq-prod__name" href="/review/x">Product X</a>
          <div class="bq-prod__score"><span class="bq-score">Test score <strong>8.9</strong></span><span>Best in 5 of 9 tests</span></div>
          <p class="bq-prod__text">One line.</p>
          <a class="bq-btn bq-btn--black" href="AFFILIATE_URL" rel="sponsored nofollow" target="_blank">$499 at Amazon</a>
          <a class="bq-link-strong" href="/review/x">Read the full review</a>
        </div>
      </div>
      <!-- … more .bq-prod … -->
      <div class="bq-vs" aria-hidden="true">vs</div>   <!-- two products only -->
    </div>
  </section>
  <div class="bq-compare__body"> <!-- 820px text column: .bq-summary, "How we compared them" --> </div>
  <section id="c-h2h" class="bq-section">
    <div class="bq-compare__body"><h2 class="bq-h2">Head to head</h2><p class="bq-p">…</p></div>
    <div class="bq-table-wrap"><table class="bq-h2h">
      <thead><tr><th>Test</th><th><a href="/review/x">Product X</a></th><th><a href="/review/y">Product Y</a></th></tr></thead>
      <tbody>
        <tr><th>Pet hair<span>% collected</span></th><td class="bq-win">94% <span class="bq-win__mark">✓ Best</span></td><td>92%</td></tr>
        <tr class="bq-h2h__tally"><th>Rows won</th><td>5</td><td>4</td></tr>
      </tbody>
    </table></div>
  </section>
  <div class="bq-compare__body">
    <section id="c-which" class="bq-section"><h2 class="bq-h2">Which one should you buy?</h2>
      <div class="bq-which">
        <div class="bq-which__head"><a class="bq-prod__name" href="/review/x">Product X</a><span class="bq-tag bq-tag--sm">Our pick</span></div>
        <div class="bq-buyskip">
          <div class="bq-buyskip__yes"><strong>Buy it if</strong><ul><li>…</li></ul></div>
          <div class="bq-buyskip__no"><strong>Skip it if</strong><ul><li>…</li></ul></div>
        </div>
        <a class="bq-btn bq-btn--black" href="AFFILIATE_URL" rel="sponsored nofollow" target="_blank">$499 at Amazon</a>
      </div>
    </section>
    <section id="c-verdict" class="bq-verdict bq-verdict--dark"><span class="bq-eyebrow">Our verdict</span><p>…</p>
      <div class="bq-verdict__actions"><a class="bq-btn bq-btn--buy" href="AFFILIATE_URL" rel="sponsored nofollow" target="_blank">Product X: $499 at Amazon</a><a href="/guide/x">See all … we tested</a></div>
    </section>
    <!-- .bq-faq, .bq-sources, .bq-authorbox as in a guide -->
  </div>
</article>
```

## Info posts (type `informational`, URL `/explained/<slug>`)

Explainers and how-tos that answer a question rather than rank products. The reference post is
*How long does a cordless vacuum battery last?*: open it in the admin and copy any block. **Admin → New post → Info post**
starts from a skeleton with every component below. Wrap the page in `<article class="bq-article bq-infopost">`
(wider text column, scroll-spy table of contents).

| Block | Markup |
|---|---|
| Tag + read time | `<div class="bq-tagline"><span class="bq-tag bq-tag--dark">Explained</span><span>19 min read</span></div>` |
| Copy-link button | `<button type="button" class="bq-btn-outline-sm" data-bq-copy>Copy link</button>` (inside `.bq-disclosure-row`) |
| Hero with caption | `<figure class="bq-hero-fig"><div class="bq-photo"><img …></div><figcaption>…</figcaption></figure>` |
| TOC that highlights the current section | `<aside class="bq-toc" data-bq-spy>…<a class="bq-toc__top" href="#">Back to top ↑</a></aside>` |
| Stats strip | `<div class="bq-stats"><div><strong>800</strong><span>label</span></div>…</div>` |
| Definition | `<div class="bq-def"><span class="bq-eyebrow">Definition</span><p><strong>Term:</strong> …</p></div>` |
| Red product link | `<a class="bq-plink" href="/review/x">Product</a>` |
| Boxed bar chart | `<figure class="bq-chart"><div class="bq-chart__head"><strong>Title</strong><span>unit</span></div><div class="bq-bars">…</div><figcaption>…</figcaption></figure>` (`.bq-bar--hl` = orange bar) |
| Pull quote | `<blockquote class="bq-pull"><p>“…”</p><cite>Name, role</cite></blockquote>` |
| Arrow list | `<ul class="bq-arrows"><li><span><strong>Lead.</strong> Text.</span></li></ul>` |
| Safety warning | `<div class="bq-warn"><span class="bq-eyebrow">Safety warning</span><p>…</p></div>` |
| Numbered steps | `<ol class="bq-nsteps"><li><span>Text</span></li></ol>`, or titled: `<ol class="bq-nsteps bq-nsteps--titled"><li><div><strong>Title</strong><p>Text</p></div></li></ol>` |
| How-to strip | `<div class="bq-howto-meta"><span><strong>Time:</strong> …</span>…</div>` |
| Myth / true / partly true | `<div class="bq-claims"><div class="bq-claim"><div><span class="bq-verdict-tag">Myth</span><strong>Claim</strong></div><p>Finding</p></div></div>` (`--true`, `--partly` variants) |
| Two boxes with + / – | `<div class="bq-twobox"><div><span class="bq-eyebrow bq-eyebrow--yes">…</span><ul><li class="bq-plus">…</li><li class="bq-minus">…</li></ul></div>…</div>` |
| Product rows | `<div class="bq-prows"><div class="bq-prow"><a class="bq-photo" …><img></a><div class="bq-prow__body"><span class="bq-eyebrow">Our top pick</span><a class="bq-prow__name" …>Name</a><p>…</p></div><a class="bq-btn bq-btn--black" … rel="sponsored nofollow" target="_blank">$339 from Amazon</a></div></div>` |
| Author, history, sources | `.bq-about`, `<div class="bq-history bq-history--dated">` with `<time>`, `<div class="bq-history">` |
| Keep reading (after `.bq-layout`) | `<section class="bq-keep"><h2 class="bq-h2 bq-h2--rule">Keep reading</h2><div class="bq-keep__grid"><a href="…"><div class="bq-photo"><img></div><span class="bq-eyebrow">Buying guide</span><strong>Title</strong></a></div></section>` |

**Interactive estimator** (no script needed). The result is `budget ÷ (slider value × each selected factor × 52)`, capped:

```html
<div class="bq-estimator" data-bq-estimator data-budget="650" data-cap="7">
  <div class="bq-estimator__head">Battery life estimate</div>
  <div class="bq-estimator__body">
    <div class="bq-estimator__field"><strong>Home size</strong>
      <div data-factor-group><button type="button" data-factor="0.4" aria-pressed="false">Apartment</button><button type="button" data-factor="0.7" aria-pressed="true">Up to 1,800 sq ft</button></div></div>
    <label class="bq-estimator__field"><strong>Cleans per week: <span data-out="range">4</span></strong><input type="range" min="1" max="14" value="4" data-range></label>
    <div class="bq-estimator__result"><div><span>Estimated battery life</span><strong data-out="result">4.5 years</strong></div><div><span>Full cycles per year</span><strong class="bq-mono" data-out="perYear">146</strong></div></div>
  </div>
</div>
```

Older generated explainers also use `.bq-callout`, `.bq-myths` and the dark `.bq-next` "Ready to choose one?" band.

## Sections

**Building a post from sections.** New posts open on the *Sections* tab with a starting set of sections for the post type.
Select a section in the outline to edit its form; the preview on the right follows. *+ Add section* inserts after the selected
one; sections can be moved, duplicated, hidden and removed. The page layout is *With table of contents* (built from the
section headings), *Full width*, or *No page frame*. Saving renders the HTML; the *HTML* tab shows it, and *Edit HTML by
hand* turns the post back into a plain HTML post. An HTML post can switch with *Use sections*: its HTML becomes one
*Custom HTML* section, so it looks the same.

**Section types** (Admin → Sections). Built-in types are locked; *Duplicate* makes an editable copy. *+ New section type*:
name, fields, template, CSS and sample data, with a live preview. Saving a type rebuilds every page that uses it.

Field types: Text, Long text, Rich text (bold, italic, links; an empty line starts a paragraph), Number, Image, Link, Choice,
Toggle, List (repeatable group of fields), Post, Product, Table cells (`a | b | c`, end a value with `*` to mark it best),
HTML code.

Template syntax (logic-free):

| Write | Gives |
|---|---|
| `{{heading}}` | the value, HTML-escaped |
| `{{{body}}}` | rich text / HTML as is |
| `{{#picks}} … {{/picks}}` | repeat for each item of a list; for a filled-in value, show once |
| `{{^image}} … {{/image}}` | show only when empty |
| `{{product.name}}` `{{product.priceText}}` `{{product.url}}` `{{product.shopUrl}}` | product catalog values |
| `{{post.title}}` `{{post.author.name}}` `{{post.updated}}` | the post the section is on |
| `{{@number}}` `{{@n}}` `{{@first}}` `{{@last}}` | inside a list: 1, 01, first/last item |

CSS of a custom type is limited to its own sections automatically (`.card` becomes `.bq-sec--<key> .card`; `:scope` styles
the section itself) and is served at `/sections.css`. Use the site variables such as `var(--orange)`. No scripts: use the
`data-bq-*` attributes above for interactive parts.

**Products** (Admin → Products): name, score, price, photo, summary, review slug and shop links. A *Product* field fills
empty fields of a pick card (name, score, photo, text, shop link, review link) from the catalog; saving a product rebuilds
every page that uses it.

**Front page** (Admin → Front page): the same editor with the front-page section types (hero, facts bar, post grid,
categories, how we test, testers, newsletter). Changes are saved as a draft; *Preview on site* opens `/?preview=1` (signed
in only), and *Publish* makes them live. Until the first publish, visitors see the original front page.

**Automation API:** send `sections` instead of `html` when creating or updating a post:
`{ "sections": { "layout": "toc", "items": [ { "id": "a1", "type": "short-answer", "data": { "items": [ { "text": "…" } ] } } ] } }`.
`GET /api/admin/section-types` lists the types and their fields.
