'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, Check } from 'lucide-react';
import { cinema, films, rows, cols, aisleAfter, seedTaken } from '@/lib/data';
import { useLocalStorage } from '@/lib/useLocalStorage';

const rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const MAX = 8;

export default function BioskopApp() {
  const [bookings, setBookings] = useLocalStorage('bioskop.bookings', []);
  const [filmId, setFilmId] = useState(films[0].id);
  const [time, setTime] = useState(films[0].showtimes[0]);
  const [seats, setSeats] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [done, setDone] = useState(null);

  const film = films.find((f) => f.id === filmId);

  const takenSet = useMemo(() => {
    const k = `${filmId}-${time}`;
    const s = new Set(seedTaken[k] || []);
    bookings.filter((b) => b.filmId === filmId && b.time === time).forEach((b) => b.seats.forEach((x) => s.add(x)));
    return s;
  }, [bookings, filmId, time]);

  const pickFilm = (f) => { setFilmId(f.id); setTime(f.showtimes[0]); setSeats([]); };
  const pickTime = (t) => { setTime(t); setSeats([]); };
  const toggle = (id) => {
    if (takenSet.has(id)) return;
    setSeats((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= MAX ? p : [...p, id]));
  };

  const total = seats.length * cinema.price;
  const confirm = (e) => {
    e.preventDefault();
    if (!seats.length || !form.name.trim() || !form.phone.trim()) return;
    setBookings((p) => [...p, { id: `b-${Date.now()}`, filmId, time, seats: [...seats] }]);
    setDone({ film: film.title, time, seats: [...seats], total, name: form.name });
    setSeats([]);
    setForm({ name: '', phone: '' });
  };

  return (
    <div className="min-h-screen pb-10">
      <header className="border-b border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-black"><Clapperboard size={20} /></span>
          <div>
            <h1 className="text-lg font-bold leading-none">{cinema.name}</h1>
            <p className="mt-1 text-xs text-white/50">{cinema.tagline}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        {/* Film */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {films.map((f) => {
            const active = f.id === filmId;
            return (
              <button key={f.id} onClick={() => pickFilm(f)}
                className={`overflow-hidden rounded-2xl border text-left transition ${active ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/10 hover:border-white/30'}`}>
                <div className={`flex h-24 items-end bg-gradient-to-br ${f.color} p-3`}>
                  <span className="rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold">{f.rating}</span>
                </div>
                <div className="bg-white/5 p-3">
                  <p className="text-sm font-bold leading-tight">{f.title}</p>
                  <p className="mt-0.5 text-[11px] text-white/50">{f.genre}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Jam tayang */}
        <div className="mt-5 flex flex-wrap gap-2">
          {film.showtimes.map((t) => (
            <button key={t} onClick={() => pickTime(t)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${time === t ? 'border-amber-500 bg-amber-500 text-black' : 'border-white/15 bg-white/5 text-white/80 hover:border-amber-400'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Layar + kursi */}
        <div className="mt-8">
          <div className="relative mx-auto w-3/4">
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-amber-400/10 via-amber-400 to-amber-400/10 shadow-[0_4px_30px_rgba(245,158,11,0.55)]" />
            <div className="absolute left-1/2 top-2 h-12 w-4/5 -translate-x-1/2 rounded-full bg-amber-400/20 blur-2xl" />
          </div>
          <p className="mb-8 mt-4 text-center text-[11px] uppercase tracking-[0.35em] text-amber-300/80">Layar</p>

          <div className="overflow-x-auto">
            <div className="mx-auto w-max space-y-2">
              {rows.map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <span className="w-4 text-center text-[11px] font-bold text-white/40">{r}</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: cols }, (_, i) => i + 1).map((c) => {
                      const id = `${r}${c}`;
                      const taken = takenSet.has(id);
                      const sel = seats.includes(id);
                      return (
                        <span key={id} className={c === aisleAfter + 1 ? 'ml-5' : ''}>
                          <button disabled={taken} onClick={() => toggle(id)} aria-label={`Kursi ${id}`}
                            className={`flex h-7 w-7 items-center justify-center rounded-md rounded-b-sm text-[9px] font-bold transition ${
                              sel ? 'bg-amber-500 text-black'
                              : taken ? 'cursor-not-allowed bg-white/10 text-white/20'
                              : 'bg-white/15 text-white/50 hover:bg-amber-400/40'
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

          {/* Legenda */}
          <div className="mx-auto mt-6 flex w-max items-center gap-6 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs text-white/60 backdrop-blur">
            <Legend className="bg-white/15" label="Tersedia" />
            <Legend className="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" label="Pilihanmu" />
            <Legend className="bg-white/10" label="Terisi" />
          </div>
        </div>
      </main>

      {/* Bar pemesanan */}
      <AnimatePresence>
        {seats.length > 0 && (
          <motion.form initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} onSubmit={confirm}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#11101c]/95 backdrop-blur">
            <div className="mx-auto max-w-3xl px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50">{seats.length} kursi • {film.title} • {time}</p>
                  <p className="mt-0.5 flex flex-wrap gap-1">
                    {seats.map((s) => <span key={s} className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[11px] font-bold text-amber-300">{s}</span>)}
                  </p>
                </div>
                <p className="font-bold text-amber-400">{rupiah(total)}</p>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" required
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-amber-400" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="No. WhatsApp" required
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-amber-400" />
                <button type="submit" className="shrink-0 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-amber-400">
                  Beli Tiket
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {done && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDone(null)}>
            <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#15131f] p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black"><Check size={28} /></div>
              <h3 className="mt-4 text-2xl font-bold">Tiket Terbeli!</h3>
              <p className="mt-1 text-sm text-white/50">Selamat menonton, {done.name} 🍿</p>
              <div className="mt-5 space-y-1.5 rounded-xl bg-white/5 p-4 text-left text-sm text-white/70">
                <p className="flex justify-between"><span>Film</span><span className="font-semibold text-white">{done.film}</span></p>
                <p className="flex justify-between"><span>Jam</span><span className="font-semibold text-white">{done.time}</span></p>
                <p className="flex justify-between gap-3"><span>Kursi</span><span className="text-right font-semibold text-amber-400">{done.seats.join(', ')}</span></p>
                <p className="flex justify-between"><span>Total</span><span className="font-semibold text-white">{rupiah(done.total)}</span></p>
              </div>
              <button onClick={() => setDone(null)} className="mt-5 w-full rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5">Selesai</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Legend({ className, label }) {
  return <span className="flex items-center gap-1.5"><span className={`h-4 w-4 rounded-md rounded-b-sm ${className}`} /> {label}</span>;
}
