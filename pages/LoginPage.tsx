import React, { useState } from 'react';
import Logo from '../components/Logo';
import { AppRoute } from '../types';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface LoginPageProps {
  onLogin: (userData: { email: string; name: string; phone: string }, rememberMe: boolean) => void;
  onNavigate: (route: AppRoute) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Silakan masukkan email dan password.');
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Email atau password salah.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Gagal login dengan Google. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-8 overflow-hidden bg-[#1877F2]">
      {/* Background with Elegant Lime Green Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-600/20 to-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-blue-600/20 to-blue-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Login Content Container */}
      <div className="w-full max-w-sm relative z-10 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <Logo light className="h-14 justify-center mb-2" />
          <p className="text-blue-100/80 text-[10px] font-black uppercase tracking-[0.4em]">Intercity Premium Shuttle</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-white font-black text-xl uppercase tracking-tight">Selamat Datang</h2>
            <p className="text-blue-100/80 text-[10px] font-bold uppercase tracking-widest">Akses Member Transcity</p>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 text-center">
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-100/80 ml-2">Email / Username</label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xs"></i>
                  <input 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-xs text-white placeholder:text-white/30 outline-none focus:border-blue-400 focus:bg-white/10 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-100/80 ml-2">Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xs"></i>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-xs text-white placeholder:text-white/30 outline-none focus:border-blue-400 focus:bg-white/10 transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 px-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded border border-white/20 bg-white/5 group-hover:border-blue-400 transition-colors">
                    <input 
                      type="checkbox" 
                      className="opacity-0 absolute inset-0 cursor-pointer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    {rememberMe && <i className="fa-solid fa-check text-[8px] text-blue-200"></i>}
                  </div>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Ingat Saya</span>
                </label>
                <button type="button" className="text-blue-200 text-[10px] font-bold uppercase tracking-widest hover:text-blue-100 transition-colors">Lupa Password?</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 transform transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-4 tracking-widest text-[10px] uppercase hover:bg-blue-500"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket text-lg"></i>
                  <span>Masuk</span>
                </>
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-white/30 text-[8px] font-black uppercase tracking-widest">ATAU</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white/5 text-white font-black py-4 rounded-2xl shadow-sm transform transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-4 tracking-widest text-[10px] uppercase border border-white/10 hover:bg-white/10"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>
          </form>
        </div>

        {/* Support Footer */}
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={() => onNavigate(AppRoute.REGISTER)}
            className="text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mb-2"
          >
            Belum punya akun? <span className="text-blue-200 ml-1">Daftar Sini</span>
          </button>

          <div className="flex items-center gap-4 w-full px-8">
             <div className="h-[1px] bg-white/10 flex-1"></div>
             <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Butuh Bantuan?</span>
             <div className="h-[1px] bg-white/10 flex-1"></div>
          </div>
          
          <button 
            onClick={() => window.open('https://wa.me/628213149400', '_blank')}
            className="flex items-center gap-3 text-white/80 font-black text-[9px] uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            <i className="fa-brands fa-whatsapp text-lg text-blue-200"></i>
            Chat Admin Transcity
          </button>
        </div>
      </div>

      <div className="mt-auto pt-10 text-center relative z-10 opacity-30">
         <p className="text-[8px] font-black text-white/60 uppercase tracking-[0.5em]">
            Bali Intercity Professional Shuttle
         </p>
      </div>
    </div>
  );
};

export default LoginPage;
