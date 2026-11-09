'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ComparisonPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/shop');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-slate-500 text-sm">
      Redirecting to shop...
    </div>
  );
}
