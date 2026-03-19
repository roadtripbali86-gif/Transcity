
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from '../types';
import Logo from '../components/Logo';
import { useCustomQRIS } from '../hooks/useCustomQRIS';
import { useCustomBanners, CustomBanner } from '../hooks/useCustomBanners';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
  user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const { banners: customBanners } = useCustomBanners();

  const activeBanners = customBanners.filter(b => b !== null) as CustomBanner[];

  const videoSlides = activeBanners.length > 0 
    ? activeBanners.map(b => ({
        type: b.type,
        video: b.url,
        content: (
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-8 text-white overflow-hidden font-sans pointer-events-none">
            <div className="flex justify-between items-start z-10">
              <div className="bg-blue-600/90 backdrop-blur-md p-3 rounded-xl border-2 border-white/20 shadow-[0_0_20px_rgba(37,99,235,0.4)] animate-slide-in-left">
                <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-tighter leading-none">Transcity Bali</h4>
                <p className="text-[7px] sm:text-[8px] font-bold opacity-90 uppercase mt-1">Tour & Travel</p>
              </div>
              <div className="text-right animate-slide-in-right">
                <div className="flex flex-col items-end">
                  <Logo light className="h-8 sm:h-10 mb-1" />
                  <p className="text-[7px] font-black uppercase tracking-[0.3em] text-blue-100 drop-shadow-md">Hanya dengan Jarimu</p>
                </div>
              </div>
            </div>
          </div>
        )
      }))
    : [
        {
          type: 'image',
          video: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
          content: (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-blue-900/40">
              <Logo light className="h-16 mb-4" />
              <p className="text-white font-black text-xs uppercase tracking-widest text-center">
                Belum ada banner yang diatur.<br/>Silakan upload banner kustom.
              </p>
            </div>
          )
        }
      ];

  const [showTerms, setShowTerms] = useState(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  
  const { customQRIS, downloadQRIS } = useCustomQRIS();

  const slides = [
    { 
      type: 'image', 
      title: "Kapasitas 4 Kursi", 
      subtitle: "Armada eksklusif dengan kenyamanan maksimal untuk perjalanan Anda.",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
      icon: "fa-couch"
    },
    { 
      type: 'image', 
      title: "Perjalanan Lebih Cepat Sampai",
      subtitle: "Rute efisien dan driver berpengalaman memastikan Anda tiba tepat waktu.",
      image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&q=80&w=1200",
      icon: "fa-bolt"
    },
    { 
      type: 'image', 
      title: "Respon Admin Otomatis Lebih Cepat",
      subtitle: "Sistem cerdas kami memproses permintaan Anda dalam hitungan detik.",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=1200",
      icon: "fa-robot"
    },
    { 
      type: 'image', 
      title: "Bisa Cek Ketersediaan Tempat Duduk",
      subtitle: "Pilih kursi favorit Anda secara langsung melalui aplikasi kami.",
      image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&q=80&w=1200",
      icon: "fa-chair"
    },
    { 
      type: 'image', 
      title: "Sistem Booking Lebih Praktis",
      subtitle: "Reservasi tiket hanya dengan beberapa ketukan di layar ponsel Anda.",
      image: "https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&q=80&w=1200",
      icon: "fa-mobile-screen-button"
    }
  ];

  const quickRates = [
    { route: "DPS - SGR", price: "140K", icon: "fa-city" },
    { route: "SGR - AIRPORT", price: "165K", icon: "fa-plane-departure" },
    { route: "SGR - JIMBARAN", price: "180K", icon: "fa-umbrella-beach" },
  ];

  const travelGallery = [
    {
      title: "Unit Kapasitas 4 Penumpang",
      location: "Armada Eksklusif.",
      icon: "fa-bus-simple",
      color: "bg-blue-600",
      tag: "Premium Unit"
    },
    {
      title: "Lebih Cepat Sampai",
      location: "Tanpa Lama Di Jalan",
      icon: "fa-bolt-lightning",
      color: "bg-blue-600",
      tag: "Fast Trip"
    },
    {
      title: "Fasilitas AC",
      location: "Dingin & Segar",
      icon: "fa-snowflake",
      color: "bg-blue-500",
      tag: "Comfort"
    },
    {
      title: "Titik Jemput",
      location: "Sesuai Aplikasi",
      icon: "fa-location-dot",
      color: "bg-blue-600",
      tag: "Pick Up"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const videoTimer = setInterval(() => {
      setCurrentVideoSlide((prev) => (prev + 1) % videoSlides.length);
    }, 4000);
    return () => clearInterval(videoTimer);
  }, [videoSlides.length]);

  const handleContactAdmin = () => {
    window.open('https://wa.me/628213149400?text=Halo Transcity Bali, saya ingin reservasi tiket antar jemput antar kota...', '_blank');
  };

  const handleSendProof = () => {
    window.open('https://wa.me/628213149400?text=Halo Transcity, saya ingin mengirimkan bukti pembayaran tiket/paket saya...', '_blank');
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

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Landscape Promo Banner - Now with Video Animation Slider - FULL WIDTH */}
        <section className="w-full">
          <div className="w-full overflow-hidden shadow-2xl border-b border-slate-200 bg-slate-900 relative aspect-[16/9]">
            {videoSlides.map((vSlide, vIdx) => (
              <div 
                key={vIdx}
                className={`absolute inset-0 transition-opacity duration-1000 ${currentVideoSlide === vIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {vSlide.type === 'image' ? (
                  <img src={vSlide.video} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  >
                    <source src={vSlide.video} type="video/mp4" />
                  </video>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
                
                {vSlide.content}
              </div>
            ))}

            {/* Floating Badge */}
            <div className="absolute top-4 right-6 z-20 flex flex-col items-end gap-2">
               <span className="bg-blue-600 text-white text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Official Animation
               </span>
            </div>

            {/* Video Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {videoSlides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-500 ${currentVideoSlide === i ? 'w-4 bg-white' : 'w-1 bg-white/30'}`}
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Slider - FULL WIDTH */}
        <section className="relative h-[22rem] overflow-hidden shadow-2xl border-b border-slate-200">
        {slides.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="w-full h-full relative overflow-hidden bg-slate-900">
              {slide.image && (
                <>
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 transition-transform duration-[2000ms]"
                    style={{ transform: currentSlide === idx ? 'scale(1)' : 'scale(1.1)' }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                </>
              )}
              
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-16">
                 <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center text-white text-5xl shadow-2xl">
                    <i className={`fa-solid ${slide.icon}`}></i>
                 </div>
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center">
                <h2 className="text-xl font-black text-white leading-tight uppercase mb-2 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-blue-100 text-[9px] font-bold uppercase tracking-wide max-w-[240px] leading-snug mb-6 opacity-90">
                  {slide.subtitle}
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => onNavigate(AppRoute.BOOKING)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl text-[9px] tracking-widest uppercase active:scale-95"
                  >
                    Booking
                  </button>
                  <button 
                    onClick={() => onNavigate(AppRoute.SCHEDULE)}
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl font-black transition-all shadow-xl text-[9px] tracking-widest uppercase active:scale-95"
                  >
                    Jadwal
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
            ></div>
          ))}
        </div>
      </section>

      <div className="p-5 space-y-8">
        {/* Enhanced Quick Menu */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
        {[
          { icon: 'fa-tags', title: 'Cek Tarif', val: 'Estimasi Biaya', bg: 'bg-blue-700', text: 'text-white', route: AppRoute.TARIF },
          { icon: 'fa-calendar-days', title: 'Jadwal', val: 'Cek Keberangkatan', bg: 'bg-white', text: 'text-blue-700', route: AppRoute.SCHEDULE },
          { icon: 'fa-credit-card', title: 'No Rekening', val: 'Info Pembayaran', bg: 'bg-white', text: 'text-blue-700', onClick: () => setShowAccountInfo(true) },
          { icon: 'fa-money-bill-transfer', title: 'Ketentuan Bayar', val: 'Sistem Pembayaran', bg: 'bg-blue-50', text: 'text-blue-700', onClick: () => setShowPaymentTerms(true) },
          { icon: 'fa-gavel', title: 'Ketentuan Layanan', val: 'Aturan Perjalanan', bg: 'bg-slate-50', text: 'text-slate-700', onClick: () => setShowTerms(true) },
          { icon: 'fa-circle-info', title: 'Tentang Kami', val: 'Profil Transcity', bg: 'bg-slate-50', text: 'text-slate-700', route: AppRoute.ABOUT },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => {
              if (item.onClick) item.onClick();
              else if (item.route) onNavigate(item.route);
            }}
            className={`min-w-[150px] ${item.bg === 'bg-blue-700' ? 'bg-blue-700 text-white shadow-blue-900/20' : 'bg-white text-slate-800 shadow-sm'} p-6 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col gap-4 text-left active:scale-95 transition-all`}
          >
            <div className={`w-12 h-12 rounded-2xl ${item.bg === 'bg-blue-700' ? 'bg-white/10' : item.bg} ${item.text} flex items-center justify-center text-xl`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div>
              <p className={`font-black text-[10px] uppercase tracking-wide opacity-50 ${item.bg === 'bg-blue-700' ? 'text-white/60' : 'text-slate-400'}`}>{item.title}</p>
              <p className={`font-black text-xs mt-0.5 tracking-tight ${item.text}`}>{item.val}</p>
            </div>
          </button>
        ))}
      </div>


      {/* QUICK RATES PREVIEW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-blue-700 rounded-full"></div>
              <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest">Tarif Terpopuler</h3>
           </div>
           <button 
             onClick={() => onNavigate(AppRoute.TARIF)}
             className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1"
           >
              Lihat Semua <i className="fa-solid fa-arrow-right"></i>
           </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {quickRates.map((rate, i) => (
            <div 
              key={i} 
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 text-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-sm">
                <i className={`fa-solid ${rate.icon}`}></i>
              </div>
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{rate.route}</p>
                <p className="text-sm font-black text-blue-950 tracking-tighter">{rate.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAVEL GALLERY SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-blue-700 rounded-full"></div>
              <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest">Layanan Transcity</h3>
           </div>
           <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Iconic Service</span>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide snap-x">
          {travelGallery.map((item, idx) => (
            <div 
              key={idx}
              className="min-w-[200px] bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 snap-center group relative"
            >
              <div className={`h-36 relative overflow-hidden flex items-center justify-center ${item.color} bg-opacity-10`}>
                <div className={`${item.color} text-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div className="absolute bottom-3 left-4">
                   <span className={`${item.color} text-white text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm`}>
                      {item.tag}
                   </span>
                </div>
              </div>
              <div className="p-6 space-y-1">
                 <h4 className="font-black text-blue-950 text-sm uppercase tracking-tight">{item.title}</h4>
                 <div className="flex items-center gap-2">
                    <i className={`fa-solid fa-circle-check text-blue-600 text-[8px]`}></i>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.location}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL NO REKENING PEMBAYARAN */}
      {showAccountInfo && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            <div className="bg-blue-700 p-8 text-center relative overflow-hidden shrink-0">
               <button onClick={() => setShowAccountInfo(false)} className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
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
                    onClick={handleSendProof}
                    className="w-full bg-blue-500 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i>
                    Kirim Bukti Bayar
                  </button>
                  <button 
                    onClick={() => setShowAccountInfo(false)}
                    className="w-full bg-white text-slate-400 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest border border-slate-100"
                  >
                    Tutup
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KETENTUAN LAYANAN */}
      {showTerms && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
            <div className="bg-blue-700 p-8 text-center relative overflow-hidden shrink-0">
               <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                 <i className="fa-solid fa-xmark"></i>
               </button>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight relative z-10">Ketentuan Layanan</h3>
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
                onClick={() => setShowTerms(false)}
                className="w-full bg-blue-700 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Saya Mengerti
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
               <button onClick={() => setShowPaymentTerms(false)} className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                 <i className="fa-solid fa-xmark"></i>
               </button>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10 leading-snug">Ketentuan Pembayaran</h3>
               <p className="text-blue-100 text-[9px] font-bold mt-1 uppercase">Transcity Bali Tour & Travel</p>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide text-left">
              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-5 h-5 bg-blue-50 rounded flex items-center justify-center text-[9px]">1</span>
                   Sistem Pembayaran
                </h4>
                <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase">
                  Pembayaran dilakukan melalui transfer bank ke rekening BCA 8271591608 a/n Trancity. Wajib konfirmasi dengan bukti transfer ke admin.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-5 h-5 bg-blue-50 rounded flex items-center justify-center text-[9px]">2</span>
                   Status Pemesanan & Penguncian Kursi
                </h4>
                <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase">
                  Pemesanan awal berstatus order sementara (Belum Terkunci). Kursi resmi terkunci (Confirmed Seat) hanya setelah pembayaran diterima & diverifikasi admin.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-5 h-5 bg-blue-50 rounded flex items-center justify-center text-[9px]">3</span>
                   Batas Waktu Pembayaran
                </h4>
                <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase">
                  Pembayaran wajib dilakukan maksimal sesuai waktu info admin. Jika melewati batas, pemesanan dianggap batal otomatis & nama dihapus dari daftar.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-5 h-5 bg-blue-50 rounded flex items-center justify-center text-[9px]">4</span>
                   Pembatalan & Perubahan Jadwal
                </h4>
                <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase">
                  Pembatalan setelah konfirmasi mengikuti kebijakan refund. Perubahan jadwal tergantung ketersediaan kursi & biaya admin berlaku.
                </p>
              </section>
              <button 
                onClick={() => setShowPaymentTerms(false)}
                className="w-full bg-blue-700 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE SUMMARY */}
      <section className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-shuttle-van"></i>
          </div>
          <div>
            <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest leading-none mb-1">Travel Antar Kota</h4>
            <p className="text-[9px] text-blue-700/60 font-bold uppercase tracking-tight">Singaraja - Denpasar - Airport PP</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 font-medium leading-relaxed uppercase">
          Kami menyediakan jasa antar jemput penumpang dari Singaraja ke seluruh wilayah Denpasar, Kuta, Airport, dan sekitarnya. Cukup pesan lewat ponsel, armada kami siap menjemput Anda tepat di depan pintu.
        </p>
      </section>

      {/* CONTACT BUTTON */}
      <button 
        onClick={handleContactAdmin}
        className="w-full bg-blue-700 p-6 rounded-[3rem] flex items-center justify-between group transition-all active:scale-[0.98] shadow-2xl shadow-blue-900/20"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-700 shadow-lg">
            <i className="fa-brands fa-whatsapp text-2xl"></i>
          </div>
          <div>
            <p className="font-black text-white text-xs tracking-tight">Hubungi Kami</p>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Layanan Pelanggan 24/7</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </div>
      </button>

      <div className="pt-6 text-center opacity-20 pb-10">
         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">Bali Intercity Shuttle Expert</p>
      </div>
      </div>
      </div>
    </div>
  );
};

export default HomePage;
