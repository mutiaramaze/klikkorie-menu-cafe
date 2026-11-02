'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  daftarMenu,
  KATEGORI_LIST,
  suhu_list,
  cariMenu,
  kunciKeranjang,
  labelKategori,
  type CartMap,
  type kategori,
  type MetodeBayar,
  type Order,
  type suhu,
} from '@/data/data_menu';
import { formatIDR } from '@/lib/format';
import CartSheet from './cart_sheet';
import QtyControl from './qty_control';
import './menu.css';

const STORAGE_KEY = 'warkoban-cart';

export default function CafeApp() {
  const [kategori, setKategori] = useState<'all' | kategori>('all');
  const [kataKunci, setKataKunci] = useState('');
  const [keranjang, setKeranjang] = useState<CartMap>({});
  const [suhuPilihan, setSuhuPilihan] = useState<Record<string, suhu>>({});
  const [sheetBuka, setSheetBuka] = useState(false);
  const [pesanan, setPesanan] = useState<Order | null>(null);
  const [siap, setSiap] = useState(false);

  // Ambil keranjang tersimpan dari browser
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as CartMap;
        const bersih: CartMap = {};
        Object.entries(data).forEach(([kunci, jml]) => {
          if (cariMenu(kunci.split('|')[0]) && jml > 0) bersih[kunci] = jml;
        });
        setKeranjang(bersih);
      }
    } catch {}
    setSiap(true);
  }, []);

  useEffect(() => {
    if (!siap) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
    } catch {}
  }, [keranjang, siap]);
  
  useEffect(() => {
    if (pesanan?.status === 'Menunggu Pembayaran QRIS') {
      const timer = setTimeout(() => {
        setPesanan((p) => (p ? { ...p, status: 'Lunas / Diproses' } : null));
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [pesanan?.status]);

  const ubahJumlah = useCallback((kunci: string, delta: number) => {
    setKeranjang((prev) => {
      const jml = (prev[kunci] ?? 0) + delta;
      const next = { ...prev };
      if (jml > 0) next[kunci] = jml;
      else delete next[kunci];
      return next;
    });
  }, []);

  const { jumlahItem, subtotal, total } = useMemo(() => {
    let n = 0;
    let sub = 0;

    Object.entries(keranjang).forEach(([kunci, jml]) => {
      const m = cariMenu(kunci.split('|')[0]);
      if (m) {
        n += jml;
        sub += m.harga * jml;
      }
    });

    return { jumlahItem: n, subtotal: sub, total: sub };
  }, [keranjang]);

  const kategoriTersedia = KATEGORI_LIST.filter((k) => daftarMenu.some((m) => m.kategori === k));

  const grup = kategoriTersedia
    .filter((k) => kategori === 'all' || kategori === k)
    .map((k) => ({
      kategori: k,
      items: daftarMenu.filter(
        (m) => m.kategori === k && m.nama.toLowerCase().includes(kataKunci.trim().toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  const buatPesanan = (namaPelanggan: string, meja: string, metode: MetodeBayar) => {
    if (jumlahItem === 0) return;
    const items = Object.entries(keranjang).flatMap(([kunci, qty]) => {
      const [id, suhu] = kunci.split('|');
      const m = cariMenu(id);
      return m ? [{ nama: suhu ? `${m.nama} (${suhu})` : m.nama, harga: m.harga, qty }] : [];
    });

    setPesanan({
      id: 'WB-' + Math.floor(100000 + Math.random() * 900000),
      namaPelanggan: namaPelanggan.trim() || 'Pelanggan Klikkorie',
      meja,
      items,
      total,
      metodePembayaran: metode,
      waktu: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      // UBAH BARIS INI:
      status: metode === 'QRIS' ? 'Menunggu Pembayaran QRIS' : 'Menunggu Kasir',
    });
    setKeranjang({});
  };

  const simulasiKasirLunas = () => {
    setPesanan((p) => (p ? { ...p, status: 'Lunas / Diproses' } : null));
  };

  const tutupSheet = useCallback(() => setSheetBuka(false), []);
  const selesai = () => {
    setPesanan(null);
    setSheetBuka(false);
  };

  return (
    <div className="wb">
      <header className="wb-top">
        <div className="wb-wrap wb-top-inner">
          <div className="wb-brand">
            <b>Klikkorie Cafe</b>
            <span>Pesan dari meja</span>
          </div>
          <button className="wb-cart-btn" type="button" onClick={() => setSheetBuka(true)} aria-label="Buka pesanan">
            Pesanan
            <span className="wb-count wb-num" data-zero={jumlahItem === 0 ? 'true' : 'false'}>
              {jumlahItem}
            </span>
          </button>
        </div>
      </header>

      <div className="wb-wrap">
        <section className="wb-banner">
          <span className="wb-banner-label">SELAMAT DATANG DI KLIKKORIE CAFE</span>
          <h2>Rasa Autentik, Pesan & Bayar Instan</h2>
          <p>Pesan langsung dari meja, pilih QRIS atau tunai, pesanan langsung masuk sistem!</p>
        </section>

        <div className="wb-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Cari menu"
            aria-label="Cari menu"
            autoComplete="off"
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
          />
        </div>
      </div>

      <nav className="wb-cats" aria-label="Kategori menu">
        <div className="wb-wrap">
          <div className="wb-scroll">
            {(['all', ...kategoriTersedia] as const).map((k) => (
              <button
                key={k}
                type="button"
                className="wb-chip"
                aria-pressed={kategori === k}
                onClick={() => setKategori(k)}
              >
                {k === 'all' ? 'Semua' : labelKategori(k)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="wb-wrap wb-main">
        {grup.length === 0 && <div className="wb-empty">Menu tidak ditemukan. Coba kata kunci lain.</div>}

        {grup.map((g) => (
          <section className="wb-group" key={g.kategori}>
            <h2>
              {labelKategori(g.kategori)} <small className="wb-num">{g.items.length} menu</small>
            </h2>
            {g.items.map((m) => {
              const suhu = suhuPilihan[m.id] ?? 'dingin'; 
              const kunci = kunciKeranjang(m.id, m.suhu ? suhu : undefined);
              
              return (
                <div className="wb-row" key={m.id}>
                  <div>
                    <div className="wb-name">{m.nama}</div>
                    <div className="wb-price wb-num">{formatIDR(m.harga)}</div>
                    {m.suhu && (
                      <div className="wb-temp" role="group" aria-label={`Pilih suhu ${m.nama}`}>
                        {suhu_list.map((v) => (
                          <button
                            key={v}
                            type="button"
                            aria-pressed={suhu === v}
                            onClick={() => setSuhuPilihan((p) => ({ ...p, [m.id]: v }))}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <QtyControl
                    jumlah={keranjang[kunci] ?? 0}
                    onTambah={() => ubahJumlah(kunci, 1)}
                    onKurang={() => ubahJumlah(kunci, -1)}
                  />
                </div>
              );
            })}
          </section>
        ))}
      </main>

      {jumlahItem > 0 && !sheetBuka && (
        <div className="wb-bar">
          <button type="button" onClick={() => setSheetBuka(true)}>
            <span>Lihat pesanan &middot; {jumlahItem} item</span>
            <span className="wb-num">{formatIDR(total)}</span>
          </button>
        </div>
      )}

      <CartSheet
        buka={sheetBuka}
        onTutup={pesanan ? selesai : tutupSheet}
        keranjang={keranjang}
        onUbah={ubahJumlah}
        subtotal={subtotal}
        total={total}
        onBuat={buatPesanan}
        pesanan={pesanan}
        onSelesai={selesai}
        onSimulasiKasir={simulasiKasirLunas}
      />
    </div>
  );
}