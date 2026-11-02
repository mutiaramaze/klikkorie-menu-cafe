import CafeApp from '@/components/cafe_app';

export default function Page() {
  return <CafeApp />;
}



//   return (
//     <div style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', fontFamily: 'sans-serif', color: '#333' }}>
//       {/* NAVBAR */}
//       <header style={{ position: 'sticky', top: 0, zIndex: 30, backgroundColor: 'rgba(253, 251, 247, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #eee3d1', padding: '15px 20px' }}>
//         <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div onClick={() => setTampilan('menu')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <div style={{ backgroundColor: '#5e3a2a', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>☕</div>
//             <div>
//               <h1 style={{ margin: 0, fontSize: '20px', color: '#341d14' }}>Warkoban</h1>
//               <small style={{ color: '#888' }}>Digital Order & Payment Solution</small>
//             </div>
//           </div>
//           <div style={{ display: 'flex', gap: '10px' }}>
           
//             <button onClick={() => setIsCartOpen(true)} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#eee3d1', color: '#341d14', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
//               🛒 Keranjang ({totalItemKeranjang})
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* CONTENT */}
//       <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
//         {tampilan === 'menu' && (
//           <div>
//             <div style={{ background: 'linear-gradient(135deg, #341d14 0%, #724530 100%)', color: '#fff', padding: '30px', borderRadius: '20px', marginBottom: '25px' }}>
//               <h2 style={{ fontSize: '28px', margin: '15px 0 8px 0' }}>Rasa Autentik, Pesan & Bayar Instan</h2>
//               <p style={{ color: '#eee3d1', fontSize: '14px', margin: 0 }}>Pesan langsung dari meja, pilih QRIS / Tunai, pesanan langsung masuk sistem!</p>
//             </div>

//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '25px', backgroundColor: '#fff', padding: '15px', borderRadius: '15px', border: '1px solid #eee3d1' }}>
//               <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
//                 {[
//                   { key: 'all', label: 'Semua' },
//                   { key: 'kopi', label: 'Kopi' },
//                   { key: 'non-kopi', label: 'Non-Kopi' },
//                   { key: 'cemilan', label: 'Cemilan' },
//                   { key: 'makanan', label: 'Makanan' },
//                   { key: 'seafood', label: 'Seafood' },
//                 ].map((cat) => (
//                   <button key={cat.key} onClick={() => setKategoriAktif(cat.key)} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: kategoriAktif === cat.key ? '#724530' : '#f7f2e9', color: kategoriAktif === cat.key ? '#fff' : '#724530', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
//                     {cat.label}
//                   </button>
//                 ))}
//               </div>
//               <input type="text" placeholder="Cari menu..." value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '13px', outline: 'none', minWidth: '200px' }} />
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
//               {menuTersaring.map((item) => (
//                 <div key={`${item.id}`} style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '20px', border: '1px solid #eee3d1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
//                   <div>
//                     <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#8c5535', fontWeight: 'bold', backgroundColor: '#f7f2e9', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '10px' }}>
//                       {item.kategori}
//                     </span>
//                     <h3 style={{ margin: '0 0 15px 0', fontSize: '17px', color: '#341d14' }}>{item.nama}</h3>
//                   </div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #f0f0f0' }}>
//                     <strong style={{ color: '#2e7d32', fontSize: '16px' }}>{formatIDR(item.harga)}</strong>
//                     <button onClick={() => tambahKeranjang(item)} style={{ backgroundColor: '#724530', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>+ Pesan</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {tampilan === 'receipt' && (
//           <ReceiptView order={currentOrder} onSimulasiBayar={simulasiBayarBerhasil} onKembaliKeMenu={() => setTampilan('menu')} formatIDR={formatIDR} />
//         )}

//         {/* {tampilan === 'admin' && (
//           <AdminDashboard ordersDb={ordersDb} formatIDR={formatIDR} />
//         )} */}
//       </main>

//       {/* DRAWER KERANJANG */}
//       <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} keranjang={keranjang} onUpdateJumlah={updateJumlahKeranjang} onProsesPesanan={prosesPesanan} totalTagihan={totalTagihan} formatIDR={formatIDR} />
//     </div>
//   );
// }