
import React from 'react';
import { AppRoute } from '../types';

interface TarifPageProps {
  onNavigate: (route: AppRoute) => void;
}

const TarifPage: React.FC<TarifPageProps> = ({ onNavigate }) => {
  const tarifList = [
    {
      title: "Singaraja - Denpasar & Denpasar - Singaraja",
      desc: "Antar jemput wilayah kota",
      price: "140K",
      icon: "fa-city"
    },
    {
      title: "Singaraja - Airport & Airport - Singaraja",
      desc: "Antar jemput wilayah kota",
      price: "165K",
      icon: "fa-plane-arrival"
    },
    {
      title: "Singaraja - Jimbaran & Jimbaran - Singaraja",
      desc: "Antar jemput wilayah kota",
      price: "180K",
      icon: "fa-umbrella-beach"
    },
    {
      title: "Singaraja - Nusa Dua & Nusa Dua - Singaraja",
      desc: "Antar jemput wilayah kota",
      price: "200K",
      icon: "fa-hotel"
    },
    {
      title: "Singaraja - Gianyar & Gianyar - Singaraja",
      desc: "Antar jemput wilayah kota",
      price: "160K",
      icon: "fa-map-pin"
    },
    {
      title: "Singaraja - Tabanan & Tabanan - Singaraja",
      desc: "Antar jemput wilayah kota",
      price: "140K",
      icon: "fa-location-crosshairs"
    },
    {
      title: "Singaraja - Seminyak & Seminyak - Singaraja",
      desc: "Antar jemput wilayah kota",
      price: "150K",
      icon: "fa-martini-glass-citrus"
    },
    {
      title: "Singaraja - Canggu & Canggu - Singaraja",
      desc: "Antar jemput wilayah kota",
      price: "140K",
      icon: "fa-water"
    }
  ];

  const conditions = [
    "khusus rute tujuan singaraja gianyar batu bulan batas titik penjemputan dan pengantaran hanya sampai di (Terminal Batu Bulan).",
    "khusus rute tujuan singaraja tabanan batas titik penjemputan dan pengantaran hanya sampai di (Indomaret Jl. A. Yani Kediri Tabanan).",
    "khusus rute tujuan Singaraja jimbaran batas titik penjemputan dan pengantaran hanya sampai di depan (Kantor Rektorat Universitas Udayana Jimbaran).",
    "khusus rute tujuan singaraja nusa dua batas titik penjemputan dan pengantaran hanya sampai di (Pepito Jl. Silitiga Nusa Dua).",
    "khusus rute tujuan singaraja canggu batas titik penjemputan dan pengantaran hanya sampai di (Indomaret Raya Kerobokan).",
    "khusus rute tujuan singaraja seminyak batas titik penjemputan dan pengantaran hanya sampai di (Starbuck Dewata Sunset Road)."
  ];

  return (
    <div className="relative h-full flex flex-col bg-slate-50">
      {/* Fixed Header - Elegant Blue */}
      <header className="sticky top-0 z-[50] bg-[#1877F2] flex items-center justify-between py-4 px-6 border-b border-white/10 shrink-0 shadow-md no-print">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate(AppRoute.HOME)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shadow-sm hover:bg-white/10 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="flex-1">
             <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Daftar Tarif</h2>
             <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mt-1">Transcity Travel Bali</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24 scrollbar-hide">
        <section className="bg-blue-700 p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <h3 className="text-white font-black text-lg uppercase tracking-tight">Tarif Transcity (4Seat)</h3>
          <p className="text-blue-100 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Armada Eksklusif Bali</p>
        </div>
      </section>

      <div className="grid gap-4">
        {tarifList.map((item, idx) => (
          <div 
            key={idx}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-lg border border-blue-100 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-[11px] text-blue-900 uppercase tracking-tight leading-tight mb-1">{item.title}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="text-xl font-black text-blue-700 tracking-tighter">{item.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
           <div className="h-4 w-1 bg-blue-700 rounded-full"></div>
           <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Keterangan Khusus</h3>
        </div>
        
        <div className="space-y-3">
          {conditions.map((condition, i) => (
            <div key={i} className="bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100 flex items-start gap-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 shrink-0 text-[10px] font-bold">
                {i + 1}
              </div>
              <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase">
                {condition}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 shrink-0">
          <i className="fa-solid fa-location-dot"></i>
        </div>
        <div>
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Informasi Umum</h5>
          <p className="text-[9px] text-slate-500 font-medium leading-relaxed uppercase">
            Tarif di atas adalah harga per kursi untuk layanan Antar Jemput Wilayah Kota (Door-to-Door). Untuk rute lain silakan hubungi admin.
          </p>
        </div>
      </div>

      <button 
        onClick={() => onNavigate(AppRoute.BOOKING)}
        className="w-full bg-blue-700 text-white py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        Pesan Sekarang
        <i className="fa-solid fa-arrow-right"></i>
      </button>
      </div>
    </div>
  );
};

export default TarifPage;