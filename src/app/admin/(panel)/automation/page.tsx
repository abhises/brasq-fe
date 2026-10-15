const BE = process.env.PUBLIC_API_URL ?? process.env.BACKEND_URL ?? 'http://localhost:4000';

export default function AutomationPage() {
  const ex1 = `curl -X PUT ${BE}/api/admin/posts/by-slug/guide/best-air-purifier \\
  -H "Authorization: Bearer $API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "The best air purifier of 2026",
    "status": "draft",
    "categorySlug": "home",
    "authorSlug": "sarah-miller",
    "excerpt": "We ran 9 air purifiers for four weeks…",
    "coverImage": "https://…",
    "testedCount": 9, "testWeeks": 4, "topPick": "PureAir 5",
    "html": "<article class=\\"bq-article\\">…</article>",
    "css": ""
  }'`;
  const ex2 = `curl -X POST ${BE}/api/admin/media -H "Authorization: Bearer $API_TOKEN" -F "file=@photo.jpg" -F "alt=Air purifier in the living room"
curl -X POST ${BE}/api/admin/media/import -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/photo.jpg","alt":"…"}'`;
  return (
    <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="ad-head" style={{ marginBottom: 0 }}><h1>Automation API</h1></div>
      <p>Everything in this admin can also be done over HTTP, so Claude (or n8n, Make, a cron job…) can create and update posts directly. Authenticate with the <code>API_TOKEN</code> from <code>brasq-be/.env</code> as a bearer token.</p>
      <div className="ad-card">
        <h3 style={{ marginTop: 0 }}>Create or update a post (idempotent, by type + slug)</h3>
        <pre className="ad-pre">{ex1}</pre>
        <p className="ad-hint">Any field can be omitted on update. <code>type</code> is guide, review or page. Set <code>&quot;status&quot;: &quot;published&quot;</code> to go live.</p>
      </div>
      <div className="ad-card">
        <h3 style={{ marginTop: 0 }}>Upload images</h3>
        <pre className="ad-pre">{ex2}</pre>
        <p className="ad-hint">The response contains <code>media.url</code>: local URL in development, S3/CDN URL in production. Use it in the post HTML.</p>
      </div>
      <div className="ad-card">
        <h3 style={{ marginTop: 0 }}>All endpoints</h3>
        <pre className="ad-pre">{`GET    /api/admin/posts?type=&status=&q=     list
GET    /api/admin/posts/:id                  read one (with html/css)
POST   /api/admin/posts                      create
PATCH  /api/admin/posts/:id                  update
PUT    /api/admin/posts/by-slug/:type/:slug  create or update
DELETE /api/admin/posts/:id
GET|POST|PATCH|DELETE /api/admin/categories[/:id]
GET|POST|PATCH|DELETE /api/admin/authors[/:id]
GET    /api/admin/media    POST /api/admin/media (multipart "file")    POST /api/admin/media/import
GET    /api/admin/subscribers[?format=csv]`}</pre>
        <p className="ad-hint">HTML conventions and copy-paste components: <code>brasq-fe/CONTENT_GUIDE.md</code>.</p>
      </div>
    </div>
  );
}
