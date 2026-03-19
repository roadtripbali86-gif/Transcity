
import React from 'react';
import { AppRoute, User } from '../types';
import Logo from '../components/Logo';

interface SchedulePageProps {
  onNavigate: (r: AppRoute) => void;
  user: User | null;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ onNavigate, user }) => {
  const scheduleData = [
    {
      tripName: "Trip I",
      color: "from-blue-600 to-blue-800",
      items: [
        { route: "Singaraja - Denpasar", time: "05.00", icon: "fa-sun" },
        { route: "Denpasar - Singaraja", time: "12.00", icon: "fa-arrow-rotate-left" },
        { route: "Airport - Singaraja", time: "11.00", icon: "fa-plane-departure" },
      ]
    },
    {
      tripName: "Trip II",
      color: "from-blue-800 to-blue-950",
      items: [
        { route: "Singaraja - Denpasar", time: "09.00", icon: "fa-route" },
        { route: "Denpasar - Singaraja", time: "16.00", icon: "fa-arrow-rotate-left" },
        { route: "Airport - Singaraja", time: "15.00", icon: "fa-plane-departure" },
      ]
    }
  ];

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

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 no-print scrollbar-hide">
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate(AppRoute.HOME)}
              className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-blue-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex-1">
               <h2 className="text-2xl font-black text-blue-900 tracking-tighter uppercase leading-none">Jadwal Keberangkatan</h2>
               <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Transcity Travel Bali</p>
            </div>
          </div>
        </header>

      <div className="space-y-8">
        {scheduleData.map((group, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className={`h-6 w-1.5 rounded-full bg-gradient-to-b ${group.color}`}></div>
              <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">{group.tripName}</h3>
            </div>
            
            <div className="grid gap-3">
              {group.items.map((item, i) => (
                <div 
                  key={i} 
                  className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-lg border border-blue-100">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Rute Perjalanan</p>
                      <h4 className="font-black text-xs text-blue-900 uppercase tracking-tight">{item.route}</h4>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Waktu WITA</p>
                    <div className="bg-blue-700 text-white px-3 py-1.5 rounded-xl font-black text-sm shadow-lg shadow-blue-900/20">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button 
        onClick={() => onNavigate(AppRoute.BOOKING)}
        className="w-full bg-blue-700 text-white py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        Pesan Tiket Sekarang
        <i className="fa-solid fa-arrow-right"></i>
      </button>
      </div>
    </div>
  );
};

export default SchedulePage;
