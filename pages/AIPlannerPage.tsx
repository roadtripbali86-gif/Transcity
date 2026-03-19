
import React, { useState } from 'react';
import { generateItinerary } from '../services/geminiService';
import { AppRoute, ItineraryItem } from '../types';

interface AIPlannerPageProps {
  onNavigate: (r: AppRoute) => void;
}

const AIPlannerPage: React.FC<AIPlannerPageProps> = ({ onNavigate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<{title: string, summary: string, items: ItineraryItem[]} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateItinerary(prompt);
      setPlan(result);
    } catch (err) {
      setError("Gagal membuat rencana perjalanan. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-8">
      <header className="space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate(AppRoute.HOME)}
            className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[#2bbbb0] shadow-sm"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="text-right flex-1">
             <h2 className="text-xl font-black text-[#1e1b4b] uppercase tracking-tighter leading-none">AI Planner</h2>
             <p className="text-[9px] font-bold text-[#2bbbb0] uppercase tracking-widest mt-1">Smart Bali Itinerary</p>
          </div>
        </div>
      </header>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-[#2bbbb0] rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner border border-blue-100/50">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <p className="text-slate-500 text-xs font-medium leading-relaxed">
          Beri tahu kami perjalanan impian Anda, dan AI Dewata akan menyusun rencana perjalanan eksklusif.
        </p>
        <div className="space-y-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Contoh: 3 hari di Ubud..."
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#2bbbb0] transition-all outline-none text-slate-800 font-bold text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-[#2bbbb0] text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 tracking-widest text-[10px] uppercase flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic"></i>}
            Buat Itinerary
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 font-bold text-[10px] uppercase tracking-wider border border-red-100">
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {plan && (
        <section className="space-y-6 pb-10">
          <div className="bg-[#1e1b4b] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-xl font-black mb-2 tracking-tight uppercase">{plan.title}</h3>
               <p className="text-slate-400 text-xs leading-relaxed font-medium">{plan.summary}</p>
             </div>
          </div>

          <div className="space-y-4">
            {plan.items.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                <div className="shrink-0 flex flex-col items-center">
                   <div className="w-1.5 h-full bg-blue-100 rounded-full relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2bbbb0] rounded-full border-2 border-white"></div>
                   </div>
                </div>
                <div className="pb-2">
                   <span className="text-[10px] font-black text-[#2bbbb0] uppercase tracking-widest">{item.time}</span>
                   <h4 className="font-black text-sm text-[#1e1b4b] uppercase mt-1">{item.activity}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AIPlannerPage;
