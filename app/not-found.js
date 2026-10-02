import Link from 'next/link';

export const metadata = { title: 'Halaman tidak ditemukan' };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-7xl font-bold text-amber-400">404</p>
      <h1 className="mt-4 text-3xl font-bold">Layarnya gelap</h1>
      <p className="mt-3 text-white/75">Halaman yang kamu cari tidak ditemukan.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400">Pesan tiket</Link>
        <Link href="/film" className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5">Lihat film</Link>
      </div>
    </main>
  );
}
