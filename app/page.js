import { Suspense } from 'react';
import BioskopApp from '@/components/BioskopApp';

export default function Home() {
  return (
    <Suspense fallback={<p className="py-32 text-center text-white/75">Memuat…</p>}>
      <BioskopApp />
    </Suspense>
  );
}
