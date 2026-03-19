
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { MOCK_STATS_DATA } from '../constants';
import { AppRoute } from '../types';

interface DashboardPageProps {
  onNavigate: (r: AppRoute) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Perjalanan', value: '1,284', change: '+12%', icon: 'fa-suitcase' },
    { label: 'Rating', value: '4.9', change: '+0.2', icon: 'fa-star' },
    { label: 'Destinasi', value: '42', change: '+4', icon: 'fa-map' },
    { label: 'User', value: '850+', change: '+18%', icon: 'fa-user-group' },
  ];

  return (
    <div className="p-5 space-y-8 pb-20">
      <header className="space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate(AppRoute.HOME)}
            className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[#2bbbb0] shadow-sm"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="text-right flex-1">
             <h2 className="text-xl font-black text-[#1e1b4b] uppercase tracking-tighter leading-none">Insight</h2>
             <p className="text-[9px] font-bold text-[#2bbbb0] uppercase tracking-widest mt-1">Operational Stats</p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-slate-50 text-[#2bbbb0] rounded-xl flex items-center justify-center text-lg border border-slate-100/50">
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-lg font-black text-[#1e1b4b] mt-1">{stat.value}</h4>
          </div>
        ))}
      </section>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-[#1e1b4b] mb-8 flex items-center gap-2 uppercase tracking-tight">
          <span className="w-1.5 h-6 bg-[#2bbbb0] rounded-full"></span>
          Tren Bulanan
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_STATS_DATA}>
              <defs>
                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2bbbb0" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2bbbb0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px'}} 
              />
              <Area type="monotone" dataKey="visitors" stroke="#2bbbb0" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1e1b4b] text-white p-8 rounded-[3.5rem] relative overflow-hidden shadow-xl">
        <div className="relative z-10">
           <p className="text-[#2bbbb0] text-[10px] font-black uppercase tracking-widest mb-2">Member Baru</p>
           <h4 className="text-2xl font-black tracking-tight mb-4">850+ Customer <br/><span className="text-blue-200/50 font-serif italic">Verified</span></h4>
           <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1e1b4b] bg-slate-200 overflow-hidden shadow-lg">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#1e1b4b] bg-[#2bbbb0] flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                 +2K
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
