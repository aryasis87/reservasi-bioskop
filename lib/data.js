// Bioskop: film, jam tayang, layout kursi, harga.
export const cinema = {
  name: 'Sinema Nusantara',
  tagline: 'Studio premium • Dolby Atmos',
  price: 50000,
};

export const films = [
  { id: 'f1', title: 'Gerhana Terakhir', genre: 'Sci-Fi • 2j 14m', rating: '13+', color: 'from-amber-500 to-orange-600', showtimes: ['12:30', '15:00', '18:30', '21:00'] },
  { id: 'f2', title: 'Senandung Hujan', genre: 'Drama • 1j 52m', rating: 'SU', color: 'from-sky-500 to-indigo-600', showtimes: ['13:00', '16:15', '19:30'] },
  { id: 'f3', title: 'Jejak di Rimba', genre: 'Petualangan • 2j 05m', rating: '13+', color: 'from-emerald-500 to-teal-600', showtimes: ['14:00', '17:00', '20:00'] },
];

export const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const cols = 12;       // 1..12, lorong setelah kolom 6
export const aisleAfter = 6;

// Kursi terisi per (film-jam). key: `${filmId}-${time}` -> ["C5","C6",...]
export const seedTaken = {
  'f1-18:30': ['C5', 'C6', 'C7', 'D6', 'D7', 'E2', 'F10', 'F11', 'G3', 'G4', 'A1'],
  'f1-21:00': ['D5', 'D6', 'D7', 'D8', 'E5', 'E6', 'H1', 'H2', 'H3'],
  'f2-19:30': ['C4', 'C5', 'B8', 'B9', 'F6', 'F7', 'G7'],
};
