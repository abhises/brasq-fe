import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { AdminNav } from '@/components/admin/AdminNav';
import { ConfirmProvider } from '@/components/admin/ConfirmDialog';
import { TOKEN_COOKIE } from '@/lib/api';

/** Email from the session token, only for display (the backend verifies the token on every call). */
async function signedInEmail() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  try {
    const payload = JSON.parse(Buffer.from(token!.split('.')[1], 'base64url').toString());
    return typeof payload.email === 'string' ? payload.email : null;
  } catch {
    return null;
  }
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ad">
      <AdminNav email={await signedInEmail()} />
      <div className="ad-main">
        <ConfirmProvider>
          {/* list pages read ?page= with useSearchParams, which needs a Suspense boundary for production builds */}
          <Suspense>{children}</Suspense>
        </ConfirmProvider>
      </div>
    </div>
  );
}
