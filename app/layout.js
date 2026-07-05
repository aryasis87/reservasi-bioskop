import './globals.css';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata = {
  title: 'Sinema Nusantara — Pesan Tiket',
  description: 'Pilih film, jam tayang, dan kursi lewat denah studio interaktif.',
};

export const viewport = { themeColor: '#f59e0b' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={outfit.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
