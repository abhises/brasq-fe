import { LoginForm } from './LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="ad-login">
      <div className="ad-login__box">
        <span style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-0.04em' }}>Bras<span style={{ color: 'var(--orange-mid)' }}>Q</span> admin</span>
        <LoginForm next={next ?? '/admin'} />
      </div>
    </div>
  );
}
