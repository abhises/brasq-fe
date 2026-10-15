'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function SearchInput({ initial }: { initial: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(() => router.replace(q ? `/search?q=${encodeURIComponent(q)}` : '/search', { scroll: false }), 250);
    return () => clearTimeout(t);
  }, [q, router]);
  return <input type="search" className="bq-search" autoFocus placeholder="For example: air fryer, mattress, Sarah" value={q} onChange={(e) => setQ(e.target.value)} />;
}
