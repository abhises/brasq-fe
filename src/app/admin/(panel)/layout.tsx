import { AdminNav } from '@/components/admin/AdminNav';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ad">
      <AdminNav />
      <div className="ad-main">{children}</div>
    </div>
  );
}
