'use client';

import { useEffect, useState } from 'react';
import { cariMenu, bacaKunci, namaItem, type CartMap, type MetodeBayar, type Order } from '@/data/data_menu';
import { formatIDR } from '@/lib/format';
import QtyControl from './qty_control';

const DAFTAR_MEJA = [
  ...Array.from({ length: 10 }, (_, i) => `Meja ${i + 1}`),
  'Bungkus (Takeaway)',
];

interface CartSheetProps {
  buka: boolean;
  onTutup: () => void;
  keranjang: CartMap;
  onUbah: (kunci: string, delta: number) => void;
  subtotal: number;
  total: number;
  onBuat: (nama: string, meja: string, metode: MetodeBayar) => void;
  pesanan: Order | null;
  onSelesai: () => void;
  onSimulasiKasir?: () => void;
}

export default function CartSheet({
  buka,
  onTutup,
  keranjang,
  onUbah,
  subtotal,
  total,
  onBuat,
  pesanan,
  onSelesai,
  onSimulasiKasir,
}: CartSheetProps) {
  const [nama, setNama] = useState('');
  const [meja, setMeja] = useState(DAFTAR_MEJA[0]);
  const [metode, setMetode] = useState<MetodeBayar>('QRIS');
  
  const [isMejaTerkunci, setIsMejaTerkunci] = useState(false);

  const isMenunggu = pesanan ? pesanan.status.includes('Menunggu') : false;

  // Cek apakah nama sudah diisi (menghapus spasi kosong di awal/akhir)
  const isNamaKosong = nama.trim() === '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nomorMeja = params.get('meja');

      if (nomorMeja) {
        const cekBungkus = nomorMeja.toLowerCase().includes('bungkus') || nomorMeja.toLowerCase().includes('takeaway');
        
        if (cekBungkus) {
          setMeja('Bungkus (Takeaway)');
          setIsMejaTerkunci(true);
        } else {
          const formatMeja = nomorMeja.toLowerCase().includes('meja') 
            ? nomorMeja.trim() 
            : `Meja ${nomorMeja.trim()}`;
            
          const mejaCocok = DAFTAR_MEJA.find(m => m.toLowerCase() === formatMeja.toLowerCase());
          
          if (mejaCocok) {
            setMeja(mejaCocok);
            setIsMejaTerkunci(true);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!buka) return;
    const tutupDenganEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isMenunggu) onTutup();
    };
    document.addEventListener('keydown', tutupDenganEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tutupDenganEsc);
      document.body.style.overflow = '';
    };
  }, [buka, onTutup, isMenunggu]);

  if (!buka) return null;

  const kunciList = Object.keys(keranjang);

  return (
    <div className="wb-sheet">
      <div className="wb-scrim" onClick={() => { if (!isMenunggu) onTutup(); }} />
      <section className="wb-panel" role="dialog" aria-modal="true" aria-labelledby="wb-sheet-title">
        {pesanan ? (
          <>
            <header>
              <h3 id="wb-sheet-title">
                {isMenunggu ? 'Selesaikan Pembayaran' : 'Pesanan Diproses'}
              </h3>
              {!isMenunggu && (
                <button className="wb-x" type="button" onClick={onSelesai} aria-label="Tutup">
                  &#10005;
                </button>
              )}
            </header>

            <div className="wb-body">
              {pesanan.status === 'Menunggu Pembayaran QRIS' && (
                <div className="wb-qris-box">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=KLIKKORIE-${pesanan.id}`}
                    alt="QRIS Klikkorie"
                  />
                  <h4>Scan QRIS</h4>
                  <p>Buka M-Banking atau e-Wallet Anda dan scan kode QR ini untuk membayar <b>{formatIDR(pesanan.total)}</b>.</p>
                  <p className="wb-pulse">Menunggu konfirmasi otomatis...</p>
                </div>
              )}

              {pesanan.status === 'Menunggu Kasir' && (
                <div className="wb-cash-box">
                  <div className="wb-cash-icon">💵</div>
                  <h4>Bayar di Kasir</h4>
                  <p>Silakan menuju kasir dan sebutkan nomor pesanan di bawah ini untuk pembayaran tunai sebesar <b>{formatIDR(pesanan.total)}</b>.</p>
                  {onSimulasiKasir && (
                    <button type="button" className="wb-dev-btn" onClick={onSimulasiKasir}>
                      [Simulasi: Kasir klik Lunas]
                    </button>
                  )}
                </div>
              )}

              {pesanan.status === 'Lunas / Diproses' && (
                <div className="wb-success-box">
                  <div className="wb-ok">✅ Pembayaran Berhasil</div>
                  <p>Pesanan Anda langsung masuk ke dapur dan sedang kami siapkan!</p>
                </div>
              )}

              <div className="wb-done">
                <div className="wb-code">{pesanan.id}</div>
                <dl>
                  <dt>Atas nama</dt>
                  <dd>{pesanan.namaPelanggan}</dd>
                  <dt>Tempat</dt>
                  <dd>{pesanan.meja}</dd>
                  <dt>Waktu</dt>
                  <dd>{pesanan.waktu}</dd>
                </dl>
              </div>

              <div style={{ borderTop: '1px dashed var(--line)', marginTop: '12px', paddingTop: '12px' }}>
                {pesanan.items.map((it, i) => (
                  <div className="wb-line" key={i}>
                    <div>
                      <div className="wb-n">{it.nama}</div>
                      <div className="wb-p wb-num">
                        {it.qty} &times; {formatIDR(it.harga)}
                      </div>
                    </div>
                    <div className="wb-num">{formatIDR(it.qty * it.harga)}</div>
                  </div>
                ))}
              </div>
            </div>

            <footer>
              <div className="wb-sum wb-num">
                <div className="wb-total">
                  <span>Total</span>
                  <span>{formatIDR(pesanan.total)}</span>
                </div>
              </div>
              {isMenunggu ? (
                <button className="wb-primary" type="button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  {pesanan.status}...
                </button>
              ) : (
                <button className="wb-primary" type="button" onClick={onSelesai}>
                  Selesai
                </button>
              )}
            </footer>
          </>
        ) : kunciList.length === 0 ? (
          <>
            <header>
              <h3 id="wb-sheet-title">Pesanan</h3>
              <button className="wb-x" type="button" onClick={onTutup} aria-label="Tutup">
                &#10005;
              </button>
            </header>
            <div className="wb-body">
              <div className="wb-empty">Belum ada menu yang dipilih.</div>
            </div>
            <footer>
              <button className="wb-secondary" type="button" onClick={onTutup}>
                Lihat menu
              </button>
            </footer>
          </>
        ) : (
          <>
            <header>
              <h3 id="wb-sheet-title">Pesanan</h3>
              <button className="wb-x" type="button" onClick={onTutup} aria-label="Tutup">
                &#10005;
              </button>
            </header>
            <div className="wb-body">
              {kunciList.map((kunci) => {
                const m = cariMenu(bacaKunci(kunci).id);
                if (!m) return null;
                return (
                  <div className="wb-line" key={kunci}>
                    <div>
                      <div className="wb-n">{namaItem(kunci)}</div>
                      <div className="wb-p wb-num">{formatIDR(m.harga)}</div>
                    </div>
                    <QtyControl
                      kecil
                      jumlah={keranjang[kunci]}
                      onTambah={() => onUbah(kunci, 1)}
                      onKurang={() => onUbah(kunci, -1)}
                    />
                  </div>
                );
              })}

              <div className="wb-field">
                <label htmlFor="wb-nama">
                  Nama pemesan <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                <input
                  id="wb-nama"
                  type="text"
                  placeholder="Contoh: Budi"
                  autoComplete="name"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="wb-field">
                <label htmlFor="wb-meja">Tempat duduk</label>
                <select 
                  id="wb-meja" 
                  value={meja} 
                  onChange={(e) => setMeja(e.target.value)}
                  disabled={isMejaTerkunci}
                  style={isMejaTerkunci ? { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 'bold' } : {}}
                >
                  {DAFTAR_MEJA.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <fieldset className="wb-field">
                <legend>Pembayaran</legend>
                <div className="wb-seg">
                  {(['QRIS', 'Tunai'] as MetodeBayar[]).map((m) => (
                    <span key={m} style={{ display: 'contents' }}>
                      <input
                        type="radio"
                        name="wb-pay"
                        id={`wb-pay-${m}`}
                        value={m}
                        checked={metode === m}
                        onChange={() => setMetode(m)}
                      />
                      <label htmlFor={`wb-pay-${m}`}>{m}</label>
                    </span>
                  ))}
                </div>
              </fieldset>
            </div>
            <footer>
              <div className="wb-sum wb-num">
                <div>
                  <span>Subtotal</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
                <div className="wb-total">
                  <span>Total</span>
                  <span>{formatIDR(total)}</span>
                </div>
              </div>
              <button 
                className="wb-primary" 
                type="button" 
                onClick={() => onBuat(nama, meja, metode)}
                disabled={isNamaKosong}
                style={isNamaKosong ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
              >
                {isNamaKosong ? 'Isi nama pemesan dulu' : 'Buat pesanan'}
              </button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}