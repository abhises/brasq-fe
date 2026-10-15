# brasq-fe

Next.js 16 public site + admin for BrasQ. All data comes from **brasq-be** (`BACKEND_URL`).

```bash
cp .env.example .env
npm install
npm run dev     # http://localhost:3000   admin: http://localhost:3000/admin
```

- Public pages: `/`, `/guide/[slug]`, `/review/[slug]`, `/[slug]` (pages such as `/deals`, `/how-we-test`, `/contact`),
  `/category/[slug]`, `/author/[slug]`, `/team`, `/search`, `/newsletter`, `/sitemap.xml`, `/robots.txt`.
- Admin: posts with HTML/CSS/JSON-LD editor and live preview, media library (drag & drop, import from URL), categories,
  authors, subscribers, automation API docs. Login uses brasq-be's `ADMIN_EMAIL` / `ADMIN_PASSWORD`; the token is kept
  in an httpOnly cookie and `/api/admin/*` here forwards requests to brasq-be.
- Styling: `public/brasq.css` is the component library used by both the site and post HTML. See `CONTENT_GUIDE.md`.
- Post HTML is rendered as-is (it is trusted admin content). Don't give admin access to people you wouldn't let edit the site's code.
