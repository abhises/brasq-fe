import { LoginForm } from './LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="lg">
      <a href="/" className="lg-back">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4l-6 6 6 6" /></svg>
        Back to BrasQ
      </a>
      <aside className="lg-brand" aria-hidden="true">
        <span />
        <div className="lg-brand__copy">
          <span className="lg-brand__logo">Bras<span>Q</span></span>
          <p className="lg-brand__kicker">Admin</p>
          <p className="lg-brand__title">Independently tested for the home.</p>
          <p className="lg-brand__text">Write guides, update reviews and run the front page, all in one place.</p>
        </div>
        <span className="lg-brand__mark">B</span>
      </aside>

      <main className="lg-main">
        <div className="lg-card">
          <span className="lg-card__logo">Bras<span>Q</span></span>
          <div>
            <h1 className="lg-card__title">Welcome back</h1>
            <p className="lg-card__sub">Sign in to the BrasQ admin.</p>
          </div>
          <LoginForm next={next ?? '/admin'} />
          <div className="lg-or"><span>or</span></div>
          <a href="/" className="lg-home">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9.5L10 3l7 6.5V17H3zM8 17v-5h4v5" /></svg>
            Back to main page
          </a>
        </div>
        <p className="lg-foot">© {new Date().getFullYear()} BrasQ</p>
      </main>
    </div>
  );
}
