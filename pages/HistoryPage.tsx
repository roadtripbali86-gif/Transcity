
import React, { useState } from 'react';
import Logo from '../components/Logo';
import { AppRoute, Booking, User } from '../types';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useCustomQRIS } from '../hooks/useCustomQRIS';

interface HistoryPageProps {
  onNavigate: (r: AppRoute) => void;
  bookings: Booking[];
  onDeleteBooking: (id: string) => void;
  user: User | null;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, bookings, onDeleteBooking, user }) => {
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  
  const { customQRIS, downloadQRIS } = useCustomQRIS();

  const handleConfirmWA = () => {
    if (!selectedTicket) return;
    const message = `Halo Transcity, saya ingin konfirmasi pembayaran untuk tiket:
ID: ${selectedTicket.id}
Nama: ${selectedTicket.customerName}
No. HP: ${selectedTicket.phone || '-'}
Rute: ${selectedTicket.route}
Tanggal: ${selectedTicket.date}
Jam: ${selectedTicket.time}
Jumlah Penumpang: ${selectedTicket.seats} Orang
Kursi: ${selectedTicket.seatNumbers?.join(', ') || '-'}
Titik Jemput: ${selectedTicket.pickup || '-'}
Titik Antar: ${selectedTicket.dropoff || '-'}
Total Biaya: Rp ${selectedTicket.totalPrice.toLocaleString('id-ID')}
Status: ${selectedTicket.status}`;
    
    window.open(`https://wa.me/628213149400?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDeleteBooking = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    onDeleteBooking(id);
    if (selectedTicket?.id === id) {
      setSelectedTicket(null);
    }
  };

  const pickupCoord: [number, number] = [-8.1139, 115.0919]; 

  return (
    <div className="relative h-full flex flex-col bg-slate-50">
      {/* Fixed Header - Elegant Blue */}
      <header className="sticky top-0 z-[50] bg-[#1877F2] flex items-center justify-between py-4 px-6 border-b border-white/10 shrink-0 shadow-md no-print">
        <Logo light className="h-10 scale-90 origin-left" />
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/10">
            <i className="fa-solid fa-bell"></i>
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.ACCOUNT)}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-blue-900/20 border border-white/10"
          >
            {user?.name?.[0].toUpperCase() || 'U'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
        <header className="no-print space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate(AppRoute.HOME)}
              className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-blue-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="text-right">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Riwayat</h2>
              <p className="text-[9px] font-bold text-blue-700 uppercase tracking-widest mt-1 italic">E-Ticket & Logistik</p>
            </div>
          </div>
        </header>

      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md print:relative print:p-0 print:bg-white print:block overflow-y-auto">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl relative ticket-card print:shadow-none print:border-none my-8">
            <div className="p-6 bg-slate-50 flex justify-between items-center border-b no-print">
               <button 
                 onClick={() => setSelectedTicket(null)}
                 className="flex items-center gap-2 text-blue-700 font-black uppercase text-[9px] tracking-widest"
               >
                 <i className="fa-solid fa-chevron-left"></i>
                 Tutup
               </button>
               <span className="font-black uppercase tracking-widest text-slate-400 text-[9px]">ID: {selectedTicket.id}</span>
            </div>

            <div className="p-8 relative">
              <div className="flex justify-between items-start mb-8 border-b-2 border-dashed border-slate-100 pb-6">
                 <Logo className="h-10 scale-90 origin-left" />
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-700 border border-slate-100">
                    <i className="fa-solid fa-qrcode text-xl"></i>
                 </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Penumpang</p>
                    <p className="text-xs font-bold text-slate-800 uppercase truncate">{selectedTicket.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <span className="text-[8px] font-black bg-blue-50 text-blue-700 px-2 py-1 rounded-full uppercase tracking-widest border border-blue-100">{selectedTicket.status}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  <div>
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Rute Perjalanan</p>
                     <p className="text-xs font-bold text-blue-900 uppercase">{selectedTicket.route}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal</p>
                       <p className="text-xs font-bold text-slate-800 uppercase">{selectedTicket.date}</p>
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Jam (WITA)</p>
                       <p className="text-xs font-bold text-slate-800 uppercase">{selectedTicket.time}</p>
                    </div>
                  </div>
                  {selectedTicket.seatNumbers && selectedTicket.seatNumbers.length > 0 && (
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Nomor Kursi</p>
                       <p className="text-sm font-black text-blue-700 uppercase">{selectedTicket.seatNumbers.join(', ')}</p>
                    </div>
                  )}
                </div>

                {/* DATA PENUMPANG SECTION */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <div className="h-4 w-1 bg-blue-700 rounded-full"></div>
                      <h4 className="text-[9px] font-black text-blue-900 uppercase tracking-widest">Detail Penumpang</h4>
                   </div>
                   
                   <div className="space-y-3">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">No HP/WA</p>
                        <p className="text-xs font-bold text-slate-800">{selectedTicket.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Titik Penjemputan</p>
                        <p className="text-xs font-medium text-slate-600 uppercase leading-relaxed">{selectedTicket.pickup || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Titik Pengantaran</p>
                        <p className="text-xs font-medium text-slate-600 uppercase leading-relaxed">{selectedTicket.dropoff || '-'}</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 z-0 mb-6 no-print shadow-inner">
                 <MapContainer center={pickupCoord} zoom={9} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={pickupCoord} />
                 </MapContainer>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center opacity-40">
                 <p className="text-[8px] font-bold text-slate-400 italic">E-Pass Transcity Bali</p>
                 <i className="fa-solid fa-circle-check text-blue-700"></i>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex gap-3 no-print">
               <button 
                 onClick={() => setShowPaymentInfo(true)} 
                 className="flex-1 bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
               >
                  <i className="fa-solid fa-credit-card"></i>
                  KONFIRMASI/BAYAR
               </button>
               <button onClick={() => setSelectedTicket(null)} className="flex-1 bg-white text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] border border-slate-100">
                  Tutup
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INFO PEMBAYARAN */}
      {showPaymentInfo && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            <div className="bg-blue-700 p-8 text-center relative overflow-hidden shrink-0">
               <button onClick={() => setShowPaymentInfo(false)} className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                 <i className="fa-solid fa-xmark"></i>
               </button>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight relative z-10">Pembayaran</h3>
               <p className="text-blue-100 text-[10px] font-bold uppercase mt-1 tracking-widest">QRIS Nasional</p>
            </div>
            <div className="p-8 space-y-6">
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 flex flex-col items-center animate-fade-in">
                    <div className="w-full flex justify-between items-center mb-2">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-6" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/GPN_logo.svg/1200px-GPN_logo.svg.png" alt="GPN" className="h-6 object-contain" />
                    </div>
                    <div className="text-center space-y-1 w-full">
                       <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Transcity</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">NMID : ID1026489935597</p>
                    </div>
                    <div className="w-full aspect-square bg-white rounded-2xl border-2 border-slate-200 p-2 shadow-sm relative">
                       {/* Placeholder for actual QR code image */}
                       <img src={customQRIS || "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=QRIS_TRANSCITY_8271591608"} alt="QR Code" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">Dicetak oleh: 93600915</p>
                 </div>

               <div className="space-y-3">
                  <button 
                    onClick={downloadQRIS}
                    className="w-full bg-blue-50 text-blue-700 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-download"></i> Download Barcode
                  </button>
                  <button 
                    onClick={handleConfirmWA}
                    className="w-full bg-blue-500 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i>
                    Kirim Bukti Bayar
                  </button>
                  <button 
                    onClick={() => setShowPaymentInfo(false)}
                    className="w-full bg-white text-slate-400 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest border border-slate-100"
                  >
                    Tutup
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="no-print space-y-4 pb-10">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest">Daftar Tiket</h3>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{bookings.length} Pesanan</span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
             <i className="fa-solid fa-receipt text-5xl text-slate-100 mb-4"></i>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Riwayat Kosong</p>
          </div>
        ) : (
          <div className="space-y-4">
             {bookings.map(booking => (
               <div 
                 key={booking.id} 
                 onClick={() => setSelectedTicket(booking)}
                 className="bg-white rounded-[2.5rem] border border-slate-100 p-6 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
               >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg border border-blue-100">
                       <i className="fa-solid fa-ticket-simple"></i>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-black text-sm text-blue-950 uppercase tracking-tight truncate">{booking.route}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{booking.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleDeleteBooking(booking.id, e)}
                      className="w-10 h-10 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-all border border-red-100 active:scale-90"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-blue-700 flex items-center justify-center transition-colors border border-slate-100">
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default HistoryPage;
