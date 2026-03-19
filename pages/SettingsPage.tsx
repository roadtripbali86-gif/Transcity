
import React, { useState } from 'react';
import { AppRoute } from '../types';

interface SettingsPageProps {
  onNavigate: (route: AppRoute) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [selectedLang, setSelectedLang] = useState('id');

  const triggerInstall = () => {
    window.dispatchEvent(new CustomEvent('trigger-app-install'));
  };

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  const languages = [
    { id: 'id', name: 'Bahasa Indonesia', local: 'Indonesian', icon: '🇮🇩' },
    { id: 'en', name: 'English', local: 'International', icon: '🇺🇸' },
    { id: 'ja', name: '日本語', local: 'Japanese', icon: '🇯🇵' },
    { id: 'zh', name: '中文', local: 'Chinese', icon: '🇨🇳' },
    { id: 'ru', name: 'Pусский', local: 'Russian', icon: '🇷🇺' },
    { id: 'fr', name: 'Français', local: 'French', icon: '🇫🇷' },
    { id: 'de', name: 'Deutsch', local: 'German', icon: '🇩🇪' },
    { id: 'es', name: 'Español', local: 'Spanish', icon: '🇪🇸' },
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
            <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Settings</h2>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mt-1 italic">Preferensi Sistem</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24 scrollbar-hide">
        {/* Installation Section */}
      {!isStandalone && (
        <section className="space-y-3">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Application</p>
          <button 
            onClick={triggerInstall}
            className="w-full bg-blue-50 border border-blue-100 p-6 rounded-[2.5rem] flex items-center justify-between group transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-download text-xs"></i>
              </div>
              <div className="text-left">
                <p className="font-black text-xs text-[#240046] uppercase tracking-tight">Instal di HP Anda</p>
                <p className="text-[9px] text-blue-600 font-bold uppercase mt-0.5">Nikmati Fitur Offline & Cepat</p>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-blue-100"></i>
          </button>
        </section>
      )}

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#240046] border border-slate-100">
             <i className="fa-solid fa-language text-xl"></i>
           </div>
           <div>
             <h3 className="text-sm font-black text-[#240046] uppercase tracking-tight">Pilih Bahasa</h3>
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Select your preferred app language</p>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`w-full p-5 rounded-[2rem] border transition-all flex items-center justify-between group ${
                selectedLang === lang.id 
                  ? 'bg-[#240046] border-[#240046] shadow-xl' 
                  : 'bg-slate-50 border-slate-100 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{lang.icon}</span>
                <div className="text-left">
                  <p className={`font-black text-xs uppercase tracking-tight ${selectedLang === lang.id ? 'text-white' : 'text-[#240046]'}`}>
                    {lang.name}
                  </p>
                  <p className={`text-[8px] font-bold uppercase tracking-widest ${selectedLang === lang.id ? 'text-white/50' : 'text-slate-400'}`}>
                    {lang.local}
                  </p>
                </div>
              </div>
              {selectedLang === lang.id && (
                <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-[#240046] text-[10px] animate-in zoom-in duration-300">
                  <i className="fa-solid fa-check"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => onNavigate(AppRoute.HOME)}
          className="w-full bg-white text-[#240046] border border-slate-100 p-6 rounded-[2.5rem] font-black shadow-sm uppercase tracking-[0.2em] text-[10px] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-house"></i>
          Beranda
        </button>
      </div>

      <div className="pt-6 text-center opacity-20 pb-10">
         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">BALI DEWATA GLOBAL NETWORK</p>
      </div>
      </div>
    </div>
  );
};

export default SettingsPage;
