
import React, { useState, useMemo } from 'react';
import { AppRoute, Booking, User } from '../types';
import { SHUTTLE_SCHEDULES } from '../constants';
import Logo from '../components/Logo';

interface BookingPageProps {
  onNavigate: (r: AppRoute) => void;
  onAddBooking?: (booking: Booking) => void;
  user: User | null;
}

const BookingPage: React.FC<BookingPageProps> = ({ onNavigate, onAddBooking, user }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [isBookingFlow, setIsBookingFlow] = useState(false);
  const [pendingWA, setPendingWA] = useState(false);
  
  const [formData, setFormData] = useState({
    route: 'Singaraja - Denpasar',
    date: '',
    time: '',
    passengers: 1,
    pickup: '',
    dropoff: '',
    passengerPhone: user?.phone || '',
    passengerName: user?.name || '',
  });

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showSeatMap, setShowSeatMap] = useState(false);

  const availableRoutes = useMemo(() => Array.from(new Set(SHUTTLE_SCHEDULES.map(s => s.route))), []);

  // AUTOMATIC FARE ENGINE
  const currentBasePrice = useMemo(() => {
    const route = formData.route.toLowerCase();
    if (route.includes('airport')) return 165000;
    if (route.includes('jimbaran')) return 180000;
    if (route.includes('nusa dua')) return 200000;
    if (route.includes('seminyak')) return 150000;
    if (route.includes('canggu')) return 140000;
    if (route.includes('gianyar')) return 160000;
    if (route.includes('tabanan')) return 140000;
    if (route.includes('denpasar')) return 140000;
    if (route.includes('singaraja')) return 140000;
    return 140000;
  }, [formData.route]);

  const totalPrice = useMemo(() => {
    return currentBasePrice * formData.passengers;
  }, [currentBasePrice, formData.passengers]);

  const handleInitiateSeatSelection = () => {
    if (!formData.date || !formData.time) {
      alert("Pilih tanggal dan jam terlebih dahulu.");
      return;
    }
    setShowPaymentTerms(true);
  };

  const handleProceedToSeatMap = () => {
    setShowPaymentTerms(false);
    setIsChecking(true);
    setShowSeatMap(false);
    setSelectedSeats([]);
    
    setTimeout(() => {
      setOccupiedSeats([]); 
      setIsChecking(false);
      setShowSeatMap(true);
    }, 800);
  };

  const toggleSeat = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return;
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < formData.passengers) {
         setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        alert(`Jumlah kursi terpilih sudah sesuai dengan ${formData.passengers} penumpang.`);
      }
    }
  };

  const executeBooking = (withWA: boolean) => {
    const newBooking: Booking = {
      id: `TC-${Date.now().toString().slice(-6)}`,
      userId: user?.email || '',
      customerName: formData.passengerName,
      route: formData.route,
      date: formData.date,
      time: formData.time,
      seats: formData.passengers,
      seatNumbers: selectedSeats,
      totalPrice: totalPrice,
      status: 'Confirmed' as const,
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      phone: formData.passengerPhone
    };
    
    if (onAddBooking) onAddBooking(newBooking);

    if (withWA) {
      const adminPhone = "628213149400";
      const waText = `Halo Transcity, saya ingin memesan Tiket Penumpang:
• Rute: ${formData.route}
• Nama Penumpang: ${formData.passengerName}
• Jadwal: ${formData.date} Jam ${formData.time}
• HP: ${formData.passengerPhone}
• Penjemputan: ${formData.pickup}
• Pengantaran: ${formData.dropoff}
• Jumlah: ${formData.passengers} Orang
• Kursi: ${selectedSeats.join(',')}
• Total Biaya: Rp ${totalPrice.toLocaleString()}`;
      window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(waText)}`, '_blank');
    }

    setShowTerms(false);
    onNavigate(AppRoute.HISTORY);
  };

  const handleFinalBooking = (withWA: boolean) => {
    if (selectedSeats.length !== formData.passengers) {
      alert(`Silakan pilih ${formData.passengers} nomor kursi.`);
      return;
    }
    if (!formData.passengerName || !formData.pickup || !formData.dropoff || !formData.passengerPhone) {
      alert("Mohon lengkapi Nama Penumpang, Alamat dan Nomor HP.");
      return;
    }
    setPendingWA(withWA);
    setIsBookingFlow(true);
    setShowTerms(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFinalBooking(true);
  };

  const SeatButton = ({ num, label }: { num: number, label?: string }) => {
    const isOccupied = occupiedSeats.includes(num);
    const isSelected = selectedSeats.includes(num);
    return (
      <button
        type="button"
        onClick={() => toggleSeat(num)}
        disabled={isOccupied}
        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl font-black transition-all flex flex-col items-center justify-center relative ${
          isOccupied ? 'bg-white/10 text-white/20 cursor-not-allowed' : 
          isSelected ? 'bg-white text-blue-700 shadow-xl scale-110 ring-4 ring-white/20' : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'
        }`}
      >
        <span className="text-lg leading-none">{num}</span>
        <span className="text-[7px] uppercase mt-0.5 opacity-60 font-bold">{label || 'Kursi'}</span>
        {isOccupied && <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl"><i className="fa-solid fa-user-lock text-white/30 text-xs"></i></div>}
      </button>
    );
  };

  return (
    <div className="relative h-full flex flex-col bg-slate-50">
      {/* Fixed Header - Elegant Blue */}
      <header className="sticky top-0 z-[50] bg-[#1877F2] flex items-center justify-between py-4 px-6 border-b border-white/10 shrink-0 shadow-md">
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

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-28 scrollbar-hide">
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate(AppRoute.HOME)}
              className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-blue-700 shadow-sm active:scale-95 transition-all"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex-1">
               <h2 className="text-2xl font-black text-blue-900 tracking-tighter uppercase leading-none">Booking Travel</h2>
               <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Transcity Travel Bali</p>
            </div>
          </div>
        </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Pilih Rute Perjalanan
            </label>
            <div className="relative">
              <select 
                className="w-full p-4 pr-12 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs text-blue-900 outline-none focus:border-blue-500 transition-colors appearance-none"
                value={formData.route}
                onChange={(e) => {
                  setFormData({...formData, route: e.target.value, time: ''});
                  setShowSeatMap(false);
                }}
              >
                {availableRoutes.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
            </div>
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Harga Tiket:</span>
              <span className="text-[11px] font-black text-blue-700 uppercase tracking-tight">Rp {currentBasePrice.toLocaleString()} / Kursi</span>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-50">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Nama Penumpang
              </label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                <input 
                  type="text"
                  required
                  placeholder="Nama lengkap penumpang..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs text-blue-900 outline-none focus:border-blue-500"
                  value={formData.passengerName}
                  onChange={(e) => setFormData({...formData, passengerName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                No HP/WA Penumpang
              </label>
              <div className="relative">
                <i className="fa-solid fa-phone absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                <input 
                  type="tel"
                  required
                  placeholder="Contoh: 08123456789"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs text-blue-900 outline-none focus:border-blue-500"
                  value={formData.passengerPhone}
                  onChange={(e) => setFormData({...formData, passengerPhone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Alamat Lengkap Penjemputan</label>
              <div className="relative">
                <i className="fa-solid fa-location-dot absolute left-5 top-5 text-slate-300 text-xs"></i>
                <textarea 
                  required
                  rows={2}
                  placeholder="Nama Jalan, No Rumah, Patokan lokasi..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs text-blue-900 outline-none focus:border-blue-500 resize-none"
                  value={formData.pickup}
                  onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Alamat Lengkap Pengantaran</label>
              <div className="relative">
                <i className="fa-solid fa-map-pin absolute left-5 top-5 text-slate-300 text-xs"></i>
                <textarea 
                  required
                  rows={2}
                  placeholder="Alamat tujuan secara detail..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs text-blue-900 outline-none focus:border-blue-500 resize-none"
                  value={formData.dropoff}
                  onChange={(e) => setFormData({...formData, dropoff: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tanggal</label>
              <input 
                type="date"
                required
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs text-blue-900 outline-none focus:border-blue-500"
                onChange={(e) => {
                  setFormData({...formData, date: e.target.value});
                  setShowSeatMap(false);
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Jam (WITA)</label>
              <div className="relative">
                <select 
                  required
                  className="w-full p-4 pr-10 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs text-blue-900 outline-none focus:border-blue-500 appearance-none"
                  value={formData.time}
                  onChange={(e) => {
                    setFormData({...formData, time: e.target.value});
                    setShowSeatMap(false);
                  }}
                >
                  <option value="">Pilih Jam</option>
                  {SHUTTLE_SCHEDULES.filter(s => s.route === formData.route).map(t => (
                    <option key={t.id} value={t.time}>{t.time}</option>
                  ))}
                </select>
                <i className="fa-solid fa-clock absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs"></i>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Jumlah Penumpang</label>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <button 
                type="button" 
                onClick={() => {
                    setFormData(f => ({...f, passengers: Math.max(1, f.passengers - 1)}));
                    setSelectedSeats([]);
                }}
                className="w-12 h-12 rounded-xl bg-white border border-slate-100 text-blue-700 flex items-center justify-center shadow-sm active:bg-slate-50 transition-all"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <div className="flex-1 text-center">
                <span className="font-black text-sm text-blue-900">{formData.passengers} ORANG</span>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Max 4 Penumpang</p>
              </div>
              <button 
                type="button" 
                onClick={() => {
                    setFormData(f => ({...f, passengers: Math.min(4, f.passengers + 1)}));
                    setSelectedSeats([]);
                }}
                className="w-12 h-12 rounded-xl bg-white border border-slate-100 text-blue-700 flex items-center justify-center shadow-sm active:bg-slate-50 transition-all"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button 
              type="button"
              onClick={handleInitiateSeatSelection}
              disabled={isChecking}
              className={`w-full py-4 rounded-2xl bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all flex items-center justify-center gap-3 ${isChecking ? 'opacity-90' : ''}`}
            >
              {isChecking ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-chair"></i>}
              {isChecking ? 'Memeriksa...' : 'Lanjutkan Pilih Kursi'}
            </button>
          </div>
        </div>

        {showSeatMap && (
          <div className="bg-blue-700 p-8 rounded-[3rem] shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
            <div className="absolute inset-x-6 top-10 bottom-10 border-2 border-white/5 rounded-[2.5rem] pointer-events-none"></div>
            <div className="text-center w-full mb-8 relative z-10">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-1">Tata Letak Armada</h3>
                <p className="text-[8px] text-white/40 uppercase font-bold tracking-widest">Pilih {formData.passengers} Kursi</p>
            </div>
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="flex justify-center gap-10 w-full px-4 mb-2">
                <SeatButton num={1} label="Kiri" />
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/10 border border-white/5 flex flex-col items-center justify-center text-white/30 grayscale shadow-inner">
                  <i className="fa-solid fa-id-card-clip text-xl"></i>
                  <span className="text-[7px] uppercase mt-1 font-bold">Driver</span>
                </div>
              </div>
              <div className="flex justify-center gap-10 w-full px-4 mb-2">
                <SeatButton num={3} label="Kiri" />
                <SeatButton num={2} label="Kanan" />
              </div>
              <div className="flex justify-center gap-10 w-full px-4 mb-2">
                <SeatButton num={4} label="Kiri" />
                <div className="h-14 w-14 sm:h-16 sm:w-16"></div>
              </div>
            </div>
          </div>
        )}

        {showSeatMap && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col gap-2 border-b border-slate-50 pb-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Harga Dasar</h5>
                  <p className="text-[10px] font-bold text-slate-600">Rp {currentBasePrice.toLocaleString()} x {formData.passengers}</p>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Total Bayar</h5>
                  <h5 className="text-xl font-black text-blue-900 tracking-tighter">Rp {totalPrice.toLocaleString()}</h5>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                type="button"
                onClick={() => handleFinalBooking(false)}
                className="w-full bg-blue-900 text-white p-5 rounded-[2.5rem] font-black shadow-lg uppercase tracking-widest text-[10px] transform active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
              >
                <i className="fa-solid fa-calendar-check text-lg"></i>
                Booking Sekarang
              </button>

              <button 
                type="button"
                onClick={() => handleFinalBooking(true)}
                className="w-full bg-blue-500 text-white p-5 rounded-[2.5rem] font-black shadow-2xl uppercase tracking-widest text-[10px] transform active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                Konfirmasi via WhatsApp
              </button>
            </div>
          </div>
        )}
      </form>

      {/* MODAL KETENTUAN LAYANAN */}
      {showTerms && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
            <div className="bg-blue-700 p-8 text-center relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight relative z-10">Ketentuan Perjalanan</h3>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto scrollbar-hide">
              <div className="space-y-4 text-left">
                {[
                  { title: "Waktu Jemput", text: "Harap sudah siap di lokasi penjemputan minimal 1 jam sebelum jam keberangkatan." },
                  { title: "Bagasi", text: "Setiap penumpang maksimal membawa 1 koper/tas ukuran 24 inc sedang. Barang berlebih dikenakan biaya tambahan." },
                  { title: "Barang Terlarang", text: "Dilarang membawa narkoba, senjata tajam, barang berbau menyengat, atau hewan peliharaan." },
                  { title: "Pembatalan & Rechedulle", text: "Pembatalan kurang dari H-1 sebelum keberangkatan biaya reservasi tidak dapat dikembalikan." },
                  { title: "Pembatalan & Perubahan Jadwal", text: "Pembatalan setelah konfirmasi mengikuti kebijakan refund. Perubahan jadwal tergantung ketersediaan kursi & biaya admin berlaku." },
                  { title: "Kontak", text: "Driver akan menghubungi Anda melalui WhatsApp saat menuju lokasi penjemputan." }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <h5 className="text-[9px] font-black text-blue-700 uppercase tracking-widest">{item.title}</h5>
                    <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
              
              <button 
                type="button"
                onClick={() => executeBooking(pendingWA)}
                className="w-full bg-blue-700 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all sticky bottom-0"
              >
                Setujui & Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KETENTUAN PEMBAYARAN */}
      {showPaymentTerms && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
            <div className="bg-blue-700 p-8 text-center relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight relative z-10">Pembayaran</h3>
               <p className="text-blue-100 text-[9px] font-bold mt-1 uppercase">Ketentuan & Syarat</p>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide text-left">
              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-5 h-5 bg-blue-50 rounded flex items-center justify-center text-[9px]">1</span>
                   Ketentuan Pembayaran
                </h4>
                <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase">
                  Pembayaran dilakukan setelah Anda memilih kursi. Silakan ikuti instruksi pembayaran yang akan diberikan.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-5 h-5 bg-blue-50 rounded flex items-center justify-center text-[9px]">2</span>
                   Status & Penguncian
                </h4>
                <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase">
                  Kursi resmi terkunci (Confirmed Seat) hanya setelah pembayaran diterima dan bukti transfer diverifikasi admin.
                </p>
              </section>

              <button 
                type="button"
                onClick={handleProceedToSeatMap}
                className="w-full bg-blue-700 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all sticky bottom-0"
              >
                Paham & Lanjutkan Pilih Kursi
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default BookingPage;
