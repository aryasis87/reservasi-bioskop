# Sinema Nusantara — Design System (Reservasi Bioskop)

> Concept: **cinema marquee / theater experience** — panggung gelap dramatis, marquee & poster menyala; terasa seperti melangkah ke dalam bioskop. Platform: responsive web. Bahasa: Indonesia.

## Brand voice
Sinematik, premium, sedikit dramatis. "Pesan tiket", "Pilih kursimu", "Selamat menonton 🍿".

## Color tokens
| Token | Hex | Pakai |
|---|---|---|
| `bg` | `#0a0a12` | latar near-black |
| `surface` | `rgba(255,255,255,.05)` | kartu/elemen |
| `text` | `#e7e5f0` | teks utama |
| `muted` | `rgba(231,229,240,.5)` | teks sekunder |
| `primary` | `#f59e0b` | aksen emas (LAYAR, terpilih, CTA) |
| `primary-soft` | `#fbbf24` | hover/glow |
| `seat-free` | `rgba(255,255,255,.15)` | kursi tersedia |
| `seat-taken` | `rgba(255,255,255,.10)` teks `.20` | terisi |
| `seat-sel` | `#f59e0b` teks hitam | dipilih |
| poster gradients | amber/sky/emerald | sampul film |

## Typography
- **Outfit** (bold modern display) 400–800 — judul film, nama bioskop, total.
- Skala: H1 24, judul film 14–16 bold, kursi 9–10 bold, total 18.

## Shape & elevation
- Radius `8–16px`; kursi kotak membulat di bawah (mirip bangku).
- **Screen glow**: bilah emas di atas + blur gradient (`screen-glow`) sebagai layar.

## Components
- **Film cards**: poster gradien + rating + judul/genre; aktif → ring emas.
- **Showtime pills**: jam tayang; aktif = emas solid.
- **Seat map (signature)**: label "LAYAR" + baris A–H × 12 kursi dengan lorong tengah; status free/taken/selected; legenda.
- **Sticky checkout bar**: jumlah kursi + chip kursi (E6/E7…) + total + form Nama/WA + "Beli Tiket".
- **Success**: tiket sukses (idealnya ber-stub/sobekan) + detail (film, jam, kursi, total).

## States
Empty = pilih film/jam. Hover kursi → glow emas tipis. Selected = emas. Disabled = terisi (redup). Maks 8 kursi. Success = modal/tiket emas.

## Motion
Seat-pop saat dipilih, screen glow lembut, checkout bar slide-up, (opsional) ticket-tear. Hormati reduced-motion.

## Layout
Stage gelap terpusat; seat map scroll-x di mobile; checkout bar sticky di bawah.
