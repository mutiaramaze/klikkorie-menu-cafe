'use client';

interface QtyControlProps{
    jumlah: number;
    onTambah: () => void;
    onKurang: () => void;
    kecil?: boolean;
}

export default function QtyControl({ jumlah, onTambah, onKurang, kecil }: QtyControlProps) {
  if (jumlah === 0) {
    return (
      <button className="wb-add" type="button" onClick={onTambah}>
        Tambah
      </button>
    );
  }

  return (
    <div className={`wb-stepper${kecil ? ' wb-stepper--sm' : ''}`} role="group" aria-label="Jumlah">
      <button type="button" onClick={onKurang} aria-label="Kurangi">
        &minus;
      </button>
      <span className="wb-num">{jumlah}</span>
      <button type="button" onClick={onTambah} aria-label="Tambah">
        +
      </button>
    </div>
  );
}