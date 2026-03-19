
import React from 'react';
import { AppRoute } from '../types';

interface BottomNavProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentRoute, onNavigate }) => {
  const menuItems = [
    { route: AppRoute.HOME, icon: 'fa-house', label: 'Beranda' },
    { route: AppRoute.BOOKING, icon: 'fa-ticket', label: 'Book' },
    { route: AppRoute.SCHEDULE, icon: 'fa-calendar-days', label: 'Jadwal' },
    { route: AppRoute.HISTORY, icon: 'fa-clock-rotate-left', label: 'Riwayat' },
    { route: AppRoute.ACCOUNT, icon: 'fa-user', label: 'Profil' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-[#1877F2] border-t border-white/10 px-2 py-3 flex justify-between items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      {menuItems.map((item) => {
        const isActive = currentRoute === item.route;
        return (
          <button
            key={item.route}
            onClick={() => onNavigate(item.route)}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-blue-200' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <div className={`text-lg mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="w-1.5 h-1.5 bg-blue-200 rounded-full mt-0.5 shadow-sm shadow-blue-200/50"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
