
import React from 'react';
import { AppRoute } from '../types';
import Logo from '../components/Logo';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
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
             <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Tentang Kami</h2>
             <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mt-1">Profil Lengkap Transcity</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24 scrollbar-hide">
        {/* Hero Branding */}
      <section className="bg-blue-700 p-10 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
         <Logo light className="h-16 justify-center mb-4 relative z-10" />
         <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.4em] relative z-10 opacity-80">
            Premium Shuttle Service Bali
         </p>
      </section>

      {/* I. PROFIL SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="h-6 w-1.5 bg-blue-700 rounded-full"></div>
           <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest">Siapa Transcity?</h3>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <p className="text-[11px] text-slate-600 font-bold leading-relaxed uppercase">
            Transcity Bali Tour & Travel adalah layanan jasa transportasi antar kota di Bali yang mengutamakan:
          </p>
          <div className="grid grid-cols-2 gap-3">
             {[
               { icon: 'fa-bolt', label: 'Cepat Sampai' },
               { icon: 'fa-couch', label: 'Kenyamanan' },
               { icon: 'fa-mobile-screen', label: 'Reservasi Digital' },
               { icon: 'fa-door-open', label: 'Door to Door' },
             ].map((feat, i) => (
               <div key={i} className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center gap-2 text-center border border-blue-100">
                  <i className={`fa-solid ${feat.icon} text-blue-700 text-sm`}></i>
                  <span className="text-[9px] font-black text-blue-900 uppercase tracking-tight">{feat.label}</span>
               </div>
             ))}
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
            Saat ini, Transcity fokus melayani rute utama: <span className="font-black text-blue-700">SINGARAJA – DENPASAR – AIRPORT (PP)</span>. Dengan konsep perjalanan semi-private (mini bus 4 seat), penumpang tidak perlu menunggu lama atau berputar-putar mengambil banyak penumpang seperti travel konvensional.
          </p>
        </div>
      </section>

      {/* II. FILOSOFI SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="h-6 w-1.5 bg-blue-700 rounded-full"></div>
           <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest">Filosofi Nama</h3>
        </div>
        <div className="bg-blue-900 p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16"></div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-6">
               <div className="text-center">
                  <span className="block text-4xl font-black text-white leading-none">TRANS</span>
                  <span className="text-[10px] text-blue-100 font-black uppercase tracking-widest">Transportasi</span>
               </div>
               <div className="h-10 w-[1px] bg-white/20"></div>
               <div className="text-center">
                  <span className="block text-4xl font-black text-blue-200 leading-none">CITY</span>
                  <span className="text-[10px] text-blue-100 font-black uppercase tracking-widest">Kota</span>
               </div>
            </div>
            <p className="text-[10px] text-blue-100/70 font-bold leading-relaxed uppercase tracking-wider italic">
              "Layanan transportasi antar kota yang cepat, modern, dan terintegrasi secara digital. Transcity hadir sebagai jembatan mobilitas antar kota di Bali dengan sistem yang lebih efisien, transparan, dan berbasis teknologi aplikasi."
            </p>
          </div>
        </div>
      </section>

      {/* III. VISI & MISI */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="h-6 w-1.5 bg-blue-700 rounded-full"></div>
           <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest">Visi & Misi</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] mb-3">Visi Kami</h4>
             <p className="text-[11px] text-slate-700 font-black leading-relaxed uppercase">
                Menjadi platform transportasi antar kota digital terpercaya di Bali yang menghubungkan kota-kota dengan sistem cepat, nyaman, dan profesional.
             </p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
             <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">Misi Kami</h4>
             <ul className="space-y-3">
                {[
                  "Memberikan layanan travel antar kota yang lebih privat dan cepat sampai.",
                  "Mengembangkan sistem pemesanan berbasis aplikasi otomatis.",
                  "Membuka peluang kemitraan bagi driver lokal Bali.",
                  "Memperluas rute antar kota secara bertahap di seluruh Bali."
                ].map((misi, i) => (
                  <li key={i} className="flex gap-3">
                    <i className="fa-solid fa-circle-check text-blue-600 text-[10px] mt-1"></i>
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">{misi}</p>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </section>

      {/* IV. LAYANAN UTAMA */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="h-6 w-1.5 bg-blue-700 rounded-full"></div>
           <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest">Detail Layanan</h3>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="space-y-3">
             <h4 className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Rute Aktif Saat Ini</h4>
             <div className="flex flex-wrap gap-2">
                {["Denpasar", "Airport", "Jimbaran", "Nusa Dua", "Batu Bulan", "Tabanan"].map(r => (
                  <span key={r} className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-[9px] font-black border border-slate-100 uppercase tracking-tight">Singaraja - {r}</span>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
             <div className="space-y-2">
                <h4 className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Jadwal Harian</h4>
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-blue-950 uppercase">Pagi & Sore</p>
                   <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">2x Keberangkatan</p>
                </div>
             </div>
             <div className="space-y-2">
                <h4 className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Kapasitas Unit</h4>
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-blue-950 uppercase">Max 4 Seat</p>
                   <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Semi-Private Trip</p>
                </div>
             </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-700 shadow-sm shrink-0">
                <i className="fa-solid fa-bolt-lightning text-lg"></i>
             </div>
             <div>
                <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Keunggulan Sistem</h5>
                <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase">
                   Antar jemput sampai alamat tujuan, tidak banyak berhenti di jalan, dan estimasi perjalanan jauh lebih cepat dibanding travel biasa.
                </p>
             </div>
          </div>
        </div>
      </section>

      <button 
        onClick={() => onNavigate(AppRoute.BOOKING)}
        className="w-full bg-blue-700 text-white py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        Booking Tiket Sekarang
        <i className="fa-solid fa-arrow-right"></i>
      </button>

      <div className="pt-6 text-center opacity-20 pb-10">
         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">Bali Intercity Shuttle Expert</p>
      </div>
      </div>
    </div>
  );
};

export default AboutPage;
