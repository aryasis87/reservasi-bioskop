# Sinema Nusantara — Pesan Tiket Bioskop Online

Pesan tiket bioskop online: pilih film, jam tayang, dan kursi lewat denah studio interaktif. Cepat dan tanpa antre.

**Demo live:** https://reservasi-bioskop.vercel.app

![Tangkapan layar Sinema Nusantara](public/og.jpg)

> Aplikasi reservasi contoh. Data tersimpan di browser (localStorage), tanpa backend.

## Konsep

Paradigma **peta kursi**: pilih film dan jadwal, lalu kursi di baris A–H dengan lorong di tengah dan bilah checkout yang menempel.

## Halaman

`/`

## Teknologi

- Next.js 15.5 (App Router) dan React 19
- Tailwind CSS v4
- JavaScript
- Framer Motion, Lucide (ikon)
- Font: Outfit (next/font)
- SEO: metadata per halaman, Open Graph, JSON-LD, sitemap.xml, dan robots.txt

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk build produksi: `npm run build` lalu `npm start`.

---

Bagian dari koleksi 5 aplikasi reservasi di [PortalReservasi](https://portal-reservasi-nu.vercel.app). Dibuat oleh [PintuWeb](https://pintuweb.com), jasa pembuatan website.
