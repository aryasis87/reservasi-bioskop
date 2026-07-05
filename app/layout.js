import './globals.css';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

const __jsonld = {"@context":"https://schema.org","@type":"MovieTheater","name":"Sinema Nusantara","description":"Pemesanan tiket bioskop online","url":"https://bioskop.pintuweb.com","areaServed":"ID"};

export const metadata = {
  metadataBase: new URL("https://bioskop.pintuweb.com"),
  title: "Sinema Nusantara — Pesan Tiket Bioskop Online",
  description: "Pesan tiket bioskop online: pilih film, jam tayang, dan kursi lewat denah studio interaktif. Cepat dan tanpa antre.",
  applicationName: "Sinema Nusantara",
  keywords: ["tiket bioskop", "pesan tiket film", "booking bioskop", "jadwal film", "pilih kursi"],
  authors: [{ name: "Sinema Nusantara" }],
  creator: "Sinema Nusantara",
  publisher: "Sinema Nusantara",
  alternates: { canonical: "https://bioskop.pintuweb.com" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://bioskop.pintuweb.com",
    siteName: "Sinema Nusantara",
    title: "Sinema Nusantara — Pesan Tiket Bioskop Online",
    description: "Pesan tiket bioskop online: pilih film, jam tayang, dan kursi lewat denah studio interaktif. Cepat dan tanpa antre.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Sinema Nusantara — Pesan Tiket Bioskop Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinema Nusantara — Pesan Tiket Bioskop Online",
    description: "Pesan tiket bioskop online: pilih film, jam tayang, dan kursi lewat denah studio interaktif. Cepat dan tanpa antre.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = { themeColor: '#f59e0b' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={outfit.variable}>
      <body className="antialiased">{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        </body>
    </html>
  );
}
