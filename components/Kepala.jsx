'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clapperboard } from 'lucide-react';
import { cinema, nav } from '@/lib/data';

export default function Kepala() {
  const path = usePathname();
  return (
    <header className="border-b border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-black" aria-hidden="true"><Clapperboard size={20} /></span>
          <span><span className="block text-lg font-bold leading-none">{cinema.name}</span><span className="mt-1 block text-xs text-white/75">{cinema.tagline}</span></span>
        </Link>
        <nav aria-label="Utama" className="flex gap-1 text-sm font-semibold">
          {nav.map((n) => {
            const aktif = n.href === '/' ? path === '/' : path?.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={aktif ? 'page' : undefined}
                className={`rounded-lg px-3 py-1.5 transition ${aktif ? 'bg-amber-500 text-black' : 'text-white/90 hover:bg-white/10'}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
