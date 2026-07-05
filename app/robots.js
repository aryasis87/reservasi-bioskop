export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://reservasi-bioskop.vercel.app/sitemap.xml",
    host: "https://reservasi-bioskop.vercel.app",
  };
}
