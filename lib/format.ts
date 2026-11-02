const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export const formatIDR = (harga: number) => idr.format(harga).replace(/\u00a0/g, ' ');