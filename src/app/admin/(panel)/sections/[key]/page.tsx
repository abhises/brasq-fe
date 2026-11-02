import { SectionTypeEditor } from '@/components/admin/SectionTypeEditor';

export default async function EditSectionTypePage({ params }: { params: Promise<{ key: string }> }) {
  return <SectionTypeEditor typeKey={(await params).key} />;
}
