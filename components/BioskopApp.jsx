'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import { cinema, rows, cols, aisleAfter, programHari, hargaTiket, terisiContoh } from '@/lib/data';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { tambahHari, hariKe, fmtTanggal, sudahLewat, rupiah, kodePesan } from '@/lib/waktu';

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function BioskopApp() {
  const sp = useSearchParams();
  const { hari, sekarang } = useHariIni(60);
  const [tiket, setTiket] = useLocalStorage('bioskopkelir.tiket', []);
  const [date, setDate] = useState(null);
  const [showId, setShowId] = useState(null);
  const [seats, setSeats] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [done, setDone] = useState(null);

  const lewat = (d, jam) => (sekarang ? sudahLewat(d, jam, 0, sekarang) : true);
  const hariPil = useMemo(() => (hari ? Array.from({ length: 5 }, (_, i) => tambahHari(hari, i)) : []), [hari]);
  const program = useMemo(() => (date ? programHari(date) : []), [date]);
  const show = program.find((p) => p.id === showId) || null;

  // Pilih hari & jam tayang pertama yang belum mulai; ?film= memilih jam tayang film itu.
  useEffect(() => {
    if (!hari || date) return;
    const ingin = sp.get('film');
    for (const d of Array.from({ length: 5 }, (_, i) => tambahHari(hari, i))) {
      const p = programHari(d).find((x) => !lewat(d, x.jam) && (!ingin || x.film.id === ingin));
      if (p) { setDate(d); setShowId(p.id); return; }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hari]);

  const pilihHari = (d) => {
    setDate(d); setSeats([]);
    const p = programHari(d).find((x) => !lewat(d, x.jam));
    setShowId(p ? p.id : null);
  };

  const takenSet = useMemo(() => {
    if (!show) return new Set();
    const s = terisiContoh(date, show.jam);
    tiket.filter((b) => b.date === date && b.time === show.jam).forEach((b) => b.seats.forEach((x) => s.add(x)));
    return s;
  }, [tiket, show, date]);

  const toggle = (id) => {
    if (takenSet.has(id)) return;
    setSeats((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= cinema.maksKursi ? p : [...p, id]));
  };

  const harga = date ? hargaTiket(date) : cinema.hargaBiasa;
  const total = seats.length * harga;
  const sisa = rows.length * cols - takenSet.size;

  const confirm = (e) => {
    e.preventDefault();
    if (!show || !seats.length || !form.name.trim() || !form.phone.trim()) return;
    const id = `b-${Date.now()}`;
    const t = { id, kode: kodePesan('BK', id), filmId: show.film.id, film: show.film.title, klasifikasi: show.film.klasifikasi, date, time: show.jam, selesai: show.selesai, seats: [...seats].sort(), total, name: form.name, dibuat: new Date().toISOString() };
    setTiket((p) => [...p, t]);
    setDone(t);
    setSeats([]);
    setForm({ name: '', phone: '' });
  };

  return (
    <div className={show && seats.length ? 'pb-56' : 'pb-10'}>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-3xl font-bold">Pesan tiket</h1>
        <p className="mt-1 text-white/75">Satu studio, satu film dalam satu waktu. Tiket {rupiah(cinema.hargaBiasa)} Senin–Kamis, {rupiah(cinema.hargaAkhirPekan)} Jumat–Minggu.</p>

        <section aria-labelledby="h-hari" className="mt-6">
          <h2 id="h-hari" className="sr-only">Tanggal</h2>
          {!hari ? <p className="text-sm text-white/75">Memuat jadwal…</p> : (
            <div className="relative flex gap-2 overflow-x-auto pb-1">
              {hariPil.map((d, i) => {
                const habis = programHari(d).every((p) => lewat(d, p.jam));
                return (
                  <button key={d} type="button" disabled={habis} onClick={() => pilihHari(d)} aria-pressed={date === d}
                    className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${date === d ? 'border-amber-500 bg-amber-500 text-black' : 'border-white/20 bg-white/5 text-white/90 hover:border-amber-400'}`}>
                    {i === 0 ? 'Hari ini' : i === 1 ? 'Besok' : HARI[hariKe(d)]} {Number(d.slice(8))}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section aria-labelledby="h-program" className="mt-6">
          <h2 id="h-program" className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Program {date ? fmtTanggal(date, { weekday: 'long', day: 'numeric', month: 'long' }) : ''}</h2>
          <ul className="mt-3 space-y-2">
            {program.map((p) => {
              const habis = lewat(date, p.jam); const aktif = showId === p.id;
              return (
                <li key={p.id}>
                  <button type="button" disabled={habis} onClick={() => { setShowId(p.id); setSeats([]); }} aria-pressed={aktif}
                    className={`flex w-full items-center gap-4 overflow-hidden rounded-xl border text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${aktif ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                    <span className={`flex h-16 w-14 shrink-0 items-end justify-center bg-gradient-to-br pb-1.5 text-[10px] font-bold ${p.film.color}`}><span className="rounded bg-black/50 px-1.5 py-0.5">{p.film.klasifikasi}</span></span>
                    <span className="w-24 shrink-0 font-mono text-lg font-bold">{p.jam}<span className="block text-[11px] font-normal text-white/75">s.d. {p.selesai}</span></span>
                    <span className="min-w-0 flex-1 py-2 pr-3">
                      <span className="block truncate font-semibold">{p.film.title}</span>
                      <span className="block text-xs text-white/75">{p.film.genre} · {p.film.durasi} menit{habis ? ' · sudah mulai' : ''}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {show && <Link href={`/film/${show.film.id}`} className="mt-3 inline-block text-sm font-semibold text-amber-300 underline-offset-4 hover:underline">Sinopsis {show.film.title}</Link>}
        </section>

        {show && (
          <section aria-labelledby="h-kursi" className="mt-10">
            <h2 id="h-kursi" className="sr-only">Pilih kursi</h2>
            <div className="relative mx-auto w-3/4" aria-hidden="true">
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-amber-400/10 via-amber-400 to-amber-400/10 shadow-[0_4px_30px_rgba(245,158,11,0.55)]" />
              <div className="absolute left-1/2 top-2 h-12 w-4/5 -translate-x-1/2 rounded-full bg-amber-400/20 blur-2xl" />
            </div>
            <p className="mb-8 mt-4 text-center text-[11px] uppercase tracking-[0.35em] text-amber-200">Layar · {sisa} kursi tersisa</p>

            <div className="relative overflow-x-auto pb-2">
              <div className="mx-auto w-max space-y-2">
                {rows.map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <span className="w-4 text-center text-[11px] font-bold text-white/75" aria-hidden="true">{r}</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: cols }, (_, i) => i + 1).map((c) => {
                        const id = `${r}${c}`;
                        const taken = takenSet.has(id);
                        const sel = seats.includes(id);
                        return (
                          <span key={id} className={c === aisleAfter + 1 ? 'ml-5' : ''}>
                            <button type="button" disabled={taken} onClick={() => toggle(id)} aria-pressed={sel} aria-label={`Kursi ${id}${taken ? ', terisi' : ''}`}
                              className={`flex h-7 w-7 items-center justify-center rounded-md rounded-b-sm text-[9px] font-bold transition ${
                                sel ? 'bg-amber-500 text-black' : taken ? 'cursor-not-allowed bg-white/10 text-white/30' : 'bg-white/20 text-white/90 hover:bg-amber-400/50'
                              }`}>
                              {c}
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-6 flex w-max max-w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs text-white/80">
              <Legend className="bg-white/20" label="Kosong" />
              <Legend className="bg-amber-500" label="Pilihanmu" />
              <Legend className="bg-white/10" label="Terisi" />
            </div>
            {seats.length >= cinema.maksKursi && <p className="mt-3 text-center text-sm text-amber-200">Maksimal {cinema.maksKursi} kursi per transaksi.</p>}
          </section>
        )}
      </main>

      <AnimatePresence>
        {show && seats.length > 0 && (
          <motion.form initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} onSubmit={confirm}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#11101c]/95 backdrop-blur">
            <div className="mx-auto max-w-3xl px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-xs text-white/75">{seats.length} kursi · {show.film.title} · {fmtTanggal(date, { weekday: 'short', day: 'numeric', month: 'short' })} {show.jam}</p>
                  <p className="mt-0.5 flex flex-wrap gap-1">
                    {[...seats].sort().map((s) => <span key={s} className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[11px] font-bold text-amber-200">{s}</span>)}
                  </p>
                </div>
                <p className="shrink-0 font-bold text-amber-300">{rupiah(total)}</p>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <label className="w-full"><span className="sr-only">Nama</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" autoComplete="name" required
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-white/60 focus:border-amber-400" /></label>
                <label className="w-full"><span className="sr-only">Nomor HP</span><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nomor HP" autoComplete="tel" required
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-white/60 focus:border-amber-400" /></label>
                <button type="submit" className="shrink-0 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-amber-400">Simpan tiket</button>
              </div>
              <p className="mt-2 text-center text-[11px] text-white/70">Purwarupa: tanpa pembayaran, tiket disimpan di peramban ini.</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {done && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDone(null)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="judul-selesai" initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#15131f] p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black"><Check size={28} /></div>
              <h2 id="judul-selesai" className="mt-4 text-2xl font-bold">Tiket tersimpan</h2>
              <p className="mt-1 text-sm text-white/75">Kode <span className="font-mono font-semibold text-white">{done.kode}</span> · {done.name}</p>
              <dl className="mt-5 space-y-1.5 rounded-xl bg-white/5 p-4 text-left text-sm text-white/80">
                <div className="flex justify-between gap-3"><dt>Film</dt><dd className="text-right font-semibold text-white">{done.film} ({done.klasifikasi})</dd></div>
                <div className="flex justify-between gap-3"><dt>Waktu</dt><dd className="text-right font-semibold text-white">{fmtTanggal(done.date, { weekday: 'short', day: 'numeric', month: 'short' })}, {done.time}</dd></div>
                <div className="flex justify-between gap-3"><dt>Kursi</dt><dd className="text-right font-semibold text-amber-300">{done.seats.join(', ')}</dd></div>
                <div className="flex justify-between gap-3"><dt>Total</dt><dd className="font-semibold text-white">{rupiah(done.total)}</dd></div>
              </dl>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/75"><Clock size={13} aria-hidden="true" /> Pintu studio dibuka 15 menit sebelum film. Purwarupa — tanpa pembayaran.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href="/tiket" className="rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400">Tiket saya</Link>
                <button type="button" onClick={() => setDone(null)} className="rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/90 hover:bg-white/5">Tutup</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Legend({ className, label }) {
  return <span className="flex items-center gap-1.5"><span className={`h-4 w-4 rounded-md rounded-b-sm ${className}`} aria-hidden="true" /> {label}</span>;
}
