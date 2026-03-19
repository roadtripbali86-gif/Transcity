
import React, { useState, useRef, useEffect } from 'react';
import { AppRoute, User } from '../types';

interface AccountPageProps {
  onNavigate: (route: AppRoute) => void;
  user: User | null;
  onLogout: () => void;
  onUpdateUser?: (updatedData: { name: string; phone: string; profilePic?: string }) => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, user, onLogout, onUpdateUser }) => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
      
      if (user.profilePic) {
        setProfilePic(user.profilePic);
      }
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        if (onUpdateUser) {
          onUpdateUser({ name: user.name, phone: user.phone || '', profilePic: base64String });
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  const triggerInstall = () => {
    window.dispatchEvent(new CustomEvent('trigger-app-install'));
  };

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  const handleSaveProfile = () => {
    if (onUpdateUser) {
      onUpdateUser({ name: editName, phone: editPhone });
    }
    setIsEditing(false);
  };

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
            <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Profil Saya</h2>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mt-1 italic">Priority Member</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24 scrollbar-hide">
        <div className="flex flex-col items-center space-y-4 py-4">
        <div className="relative group cursor-pointer" onClick={!isUploading ? triggerUpload : undefined}>
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-3xl font-black shadow-2xl relative overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`} />
            ) : (
              user.name[0].toUpperCase()
            )}
            {isUploading ? (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <i className="fa-solid fa-spinner animate-spin text-white text-xl"></i>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-camera text-white text-xl"></i>
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white text-white text-xs z-10">
            <i className="fa-solid fa-check"></i>
          </div>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/jpg, image/png" 
          className="hidden" 
          disabled={isUploading}
        />
        
        <button 
          onClick={triggerUpload}
          disabled={isUploading}
          className={`text-[10px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100 active:scale-95 transition-transform hover:bg-blue-100 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Mengupload...' : 'Upload Foto Anda'}
        </button>

        <div className="text-center">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{user.name}</h3>
          <p className="text-blue-700 text-[10px] font-bold uppercase tracking-widest">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        {!isStandalone && (
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-white font-black text-sm uppercase tracking-tight">Instal Aplikasi</h4>
                <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Akses 2x Lebih Cepat & Mudah</p>
                <button 
                  onClick={triggerInstall}
                  className="mt-4 bg-white text-blue-700 px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Download Sekarang
                </button>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white text-3xl">
                <i className="fa-solid fa-mobile-screen-button"></i>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative">
          <div className="absolute top-6 right-6">
            {isEditing ? (
              <button 
                onClick={handleSaveProfile}
                className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg active:scale-95 transition-all"
              >
                Simpan
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100 hover:bg-blue-50 transition-colors"
              >
                <i className="fa-solid fa-pen text-xs"></i>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 pr-12">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-700 border border-slate-100 shrink-0">
              <i className="fa-solid fa-user-tag text-xs"></i>
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-sm font-bold text-slate-800 border-b border-blue-200 focus:border-blue-600 outline-none py-1 bg-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              ) : (
                <p className="text-sm font-bold text-slate-800">{user.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pr-12">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-700 border border-slate-100 shrink-0">
              <i className="fa-solid fa-phone text-xs"></i>
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Nomor HP</p>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full text-sm font-bold text-slate-800 border-b border-blue-200 focus:border-blue-600 outline-none py-1 bg-transparent"
                  placeholder="Masukkan nomor HP"
                />
              ) : (
                <p className="text-sm font-bold text-slate-800">{user.phone || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Admin Area</p>
            <button 
              onClick={() => onNavigate(AppRoute.ADMIN)}
              className="w-full bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 shadow-sm flex items-center justify-between group transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-shield-halved text-xs"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-xs text-blue-900 uppercase tracking-tight">Panel Admin</p>
                  <p className="text-[9px] text-blue-600 font-bold uppercase mt-0.5">Kelola Laporan & Gambar</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-blue-300"></i>
            </button>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Preferensi App</p>
          
          <button 
            onClick={() => onNavigate(AppRoute.SETTINGS)}
            className="w-full bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-700 border border-slate-100">
                <i className="fa-solid fa-globe text-xs"></i>
              </div>
              <div>
                <p className="font-black text-xs text-slate-900 uppercase tracking-tight">Pengaturan Bahasa</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Bahasa Indonesia</p>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-200"></i>
          </button>

          <button 
            onClick={onLogout}
            className="w-full bg-red-50 text-red-500 border border-red-100 p-6 rounded-[2.5rem] flex items-center justify-between group transition-all active:scale-[0.98] hover:bg-red-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-right-from-bracket"></i>
              </div>
              <p className="font-black text-xs uppercase tracking-widest">Keluar Akun</p>
            </div>
            <i className="fa-solid fa-chevron-right text-red-200"></i>
          </button>
        </div>
      </div>

      <div className="pt-10 text-center opacity-30">
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">TRANSCITY App v1.2</p>
      </div>
      </div>
    </div>
  );
};

export default AccountPage;
