import { AdminNav } from '@/components/admin/AdminNav';
import { ConfirmProvider } from '@/components/admin/ConfirmDialog';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ad">
      <AdminNav />
      <div className="ad-main"><ConfirmProvider>{children}</ConfirmProvider></div>
    </div>
  );
}
