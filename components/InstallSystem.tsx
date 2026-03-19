
import React, { useState, useEffect } from 'react';

const InstallSystem: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isAppStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isAppStandalone);

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasDismissed = sessionStorage.getItem('install-prompt-dismissed');
      if (!isAppStandalone && !hasDismissed) setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const triggerManual = () => {
      setShowPrompt(true);
    };
    window.addEventListener('trigger-app-install', triggerManual);

    if (isIOSDevice && !isAppStandalone) {
      const hasSeenPrompt = localStorage.getItem('ios-install-prompt-seen');
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-app-install', triggerManual);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) {
      alert("Gunakan menu 'Tambahkan ke Layar Utama' pada browser Chrome Anda.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const closePrompt = () => {
    setShowPrompt(false);
    sessionStorage.setItem('install-prompt-dismissed', 'true');
    if (isIOS) {
      localStorage.setItem('ios-install-prompt-seen', 'true');
    }
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-blue-700 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-5">
              <svg viewBox="0 0 100 100" className="h-14 w-14">
                <rect width="100" height="100" rx="10" fill="#1d4ed8" />
                <path d="M20 30 H80 L40 85 L25 85 L55 38 H20 Z" fill="white" />
              </svg>
            </div>
            <h3 className="text-white font-black text-xl tracking-tight uppercase">Dapatkan Aplikasi</h3>
            <p className="text-blue-100 text-[10px] font-black tracking-[0.3em] uppercase mt-1">Transcity</p>
          </div>
        </div>

        <div className="p-10 space-y-8">
          {isIOS ? (
            <div className="space-y-5">
              <p className="text-slate-500 text-[11px] font-bold text-center leading-relaxed uppercase tracking-wide">
                Instal di iPhone / iPad Anda:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-700">
                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                  </div>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">1. Ketuk ikon 'Bagikan' (Share)</p>
                </div>
                <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-700">
                    <i className="fa-solid fa-plus-square"></i>
                  </div>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">2. Pilih 'Tambah ke Layar Utama'</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-tight">
                Gunakan aplikasi untuk pengalaman pemesanan yang lebih cepat dan aman.
              </p>
              <div className="flex justify-center gap-2">
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
                  <i className="fa-solid fa-bolt mr-2"></i>
                  Instan
                </div>
                <div className="bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">
                  <i className="fa-solid fa-shield-check mr-2"></i>
                  Aman
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {!isIOS && (
              <button 
                onClick={handleAndroidInstall}
                className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Instal Aplikasi Sekarang
                <i className="fa-solid fa-download animate-bounce"></i>
              </button>
            )}
            <button 
              onClick={closePrompt}
              className="w-full bg-slate-100 text-slate-400 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
            >
              {isIOS ? 'Saya Mengerti' : 'Mungkin Nanti'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallSystem;
