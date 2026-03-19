
import React from 'react';
import { AppRoute } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
  userEmail: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, onLogout, userEmail }) => {
  const menuItems = [
    { route: AppRoute.HOME, icon: 'fa-house', label: 'Beranda' },
    { route: AppRoute.BOOKING, icon: 'fa-ticket', label: 'Book' },
    { route: AppRoute.SCHEDULE, icon: 'fa-calendar-days', label: 'Jadwal' },
    { route: AppRoute.HISTORY, icon: 'fa-clock-rotate-left', label: 'Riwayat' },
  ];

  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col h-full shadow-2xl z-20 no-print">
      <div className="p-6 border-b border-slate-900">
        <Logo light className="h-16" />
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.route}
            onClick={() => onNavigate(item.route)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
              currentRoute === item.route
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${currentRoute === item.route ? 'bg-blue-500' : 'bg-slate-900'}`}>
              <i className={`fa-solid ${item.icon} text-sm`}></i>
            </div>
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto bg-slate-900/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
            {userEmail[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate text-white">{userEmail.split('@')[0]}</p>
            <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Priority Member</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-bold"
        >
          <i className="fa-solid fa-power-off w-5 text-xs"></i>
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
