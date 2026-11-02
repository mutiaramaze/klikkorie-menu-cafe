export const KATEGORI_LIST = [
  "KOPI", "NON KOPI", "SNACK", "MAKANAN", 
] as const;

export type kategori = (typeof KATEGORI_LIST)[number];
export type suhu = 'panas' | 'dingin';
export type MetodeBayar = 'QRIS' | 'Tunai';

export const suhu_list: suhu[] = ['panas', 'dingin'];

export interface MenuItem {
  id: string;
  nama: string;
  harga: number;
  kategori: kategori;
  suhu?: boolean;
}

export type CartMap = Record<string, number>;

export interface OrderItem {
  nama: string;
  harga: number;
  qty: number;
}

export interface Order {
  id: string;
  namaPelanggan: string;
  meja: string;
  items: OrderItem[];
  total: number;
  metodePembayaran: MetodeBayar;
  waktu: string;
  status: 'Menunggu Pembayaran QRIS' |'Menunggu Kasir' | 'Lunas / Diproses' | 'Selesai';
}

export const daftarMenu: MenuItem[] = [
  { id: 'm1', nama: 'Kopi Susu Gula Aren', kategori: 'KOPI', suhu: true, harga: 12000 },
  { id: 'm2', nama: 'Butterscotch Latte', kategori: 'KOPI', suhu: true, harga: 12000 },
  { id: 'm3', nama: 'Americano', kategori: 'KOPI', suhu: true, harga: 10000 },
  { id: 'm4', nama: 'Salted Caramel Latte', kategori: 'KOPI', suhu: true, harga: 10000 },
  { id: 'm5', nama: 'Hazelnut Latte', kategori: 'KOPI', suhu: true, harga: 10000 },
  { id: 'm6', nama: 'Lychee Tea', kategori: 'NON KOPI', suhu: true, harga: 10000 },
  { id: 'm7', nama: 'Matcha', kategori: 'NON KOPI', suhu: true, harga: 15000 },
  {id: 'm8', nama: 'Aneka Jus', kategori: 'NON KOPI', suhu: true, harga: 15000 },
  {id: 'm9', nama: 'Matcha', kategori: 'NON KOPI', suhu: true, harga: 15000 },
  {id: 'm10', nama: 'Matcha', kategori: 'NON KOPI', suhu: true, harga: 15000 },
  { id: 'm11', nama: 'Chicken Steak', kategori: 'MAKANAN', harga: 15000 },
  { id: 'm12', nama: 'Chicken Steak + Sosis', kategori: 'MAKANAN', harga: 15000 },
  { id: 'm13', nama: 'Mendoan', kategori: 'SNACK', harga: 15000 }, 
];

// Helper functions
export const labelKategori = (k: string) =>
  k.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export const kunciKeranjang = (id: string, suhu?: suhu) => (suhu ? `${id}|${suhu}` : id);

export const bacaKunci = (kunci: string) => {
  const [id, suhu] = kunci.split('|');
  return { id, suhu: suhu as suhu | undefined };
};

export const cariMenu = (id: string) => daftarMenu.find((m) => m.id === id);

export const namaItem = (kunci: string) => {
  const { id, suhu } = bacaKunci(kunci);
  const m = cariMenu(id);
  if (!m) return '';
  return suhu ? `${m.nama} (${suhu})` : m.nama;
};