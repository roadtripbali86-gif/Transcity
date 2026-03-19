import React, { useState } from 'react';
import Logo from '../components/Logo';
import { AppRoute } from '../types';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface RegisterPageProps {
  onRegister: (userData: { email: string; name: string; phone: string }, rememberMe?: boolean) => void;
  onNavigate: (route: AppRoute) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged in App.tsx will handle the navigation
    } catch (err: any) {
      setErrorMsg('Gagal mendaftar dengan Google.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1877F2] p-10 flex flex-col items-center justify-center space-y-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>

      <div className="text-center relative z-10">
        <Logo light className="h-14 mb-4" />
        <h2 className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em]">Gabung Member Prioritas</h2>
      </div>

      <div className="w-full space-y-6 relative z-10">
        <div className="space-y-4">
          {errorMsg && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-bold text-center border border-red-500/20">
              {errorMsg}
            </div>
          )}
          
          <button
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border border-blue-300/50 font-black py-5 rounded-3xl shadow-[0_0_30px_rgba(132,204,23,0.3)] transform transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-4 tracking-widest text-xs"
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch animate-spin text-lg text-white"></i>
            ) : (
              <>
                <div className="bg-white p-1 rounded-full">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-4 h-4" />
                </div>
                <span>DAFTAR DENGAN GOOGLE</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <button 
            onClick={() => onNavigate(AppRoute.LOGIN)}
            className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Sudah punya akun? <span className="text-blue-200 ml-1">Masuk Sini</span>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center relative z-10 opacity-30">
         <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">
            TRANSCITY • Layanan Premium
         </p>
      </div>
    </div>
  );
};

export default RegisterPage;
