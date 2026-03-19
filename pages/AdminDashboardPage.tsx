import React, { useState, useEffect } from 'react';
import { AppRoute, User, Booking, Destination } from '../types';
import { BALI_DESTINATIONS } from '../constants';
import BannerSettingsModal from '../components/BannerSettingsModal';
import { useCustomBanners } from '../hooks/useCustomBanners';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

interface AdminDashboardPageProps {
  currentUser: User | null;
  onNavigate: (route: AppRoute) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'laporan' | 'gambar'>('laporan');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [showBannerModal, setShowBannerModal] = useState(false);

  const { banners, saveBanners } = useCustomBanners();

  useEffect(() => {
    // Load bookings
    const q = query(collection(db, 'bookings'));
    const unsubscribeBookings = onSnapshot(q, (snapshot) => {
      const b: Booking[] = [];
      snapshot.forEach((doc) => {
        b.push({ id: doc.id, ...doc.data() } as Booking);
      });
      // Sort client-side
      b.sort((x, y) => {
        const dateX = x.createdAt ? new Date(x.createdAt).getTime() : 0;
        const dateY = y.createdAt ? new Date(y.createdAt).getTime() : 0;
        return dateY - dateX;
      });
      setBookings(b);
    }, (error) => {
      console.error("Failed to fetch bookings", error);
    });

    // Load destinations
    const unsubscribeDestinations = onSnapshot(collection(db, 'destinations'), (snapshot) => {
      if (!snapshot.empty) {
        const d: Destination[] = [];
        snapshot.forEach((doc) => {
          d.push({ id: doc.id, ...doc.data() } as Destination);
        });
        setDestinations(d);
      } else {
        // Initialize with default destinations if empty
        setDestinations(BALI_DESTINATIONS);
        BALI_DESTINATIONS.forEach(async (dest) => {
          try {
            await setDoc(doc(db, 'destinations', dest.id), dest);
          } catch (e) {
            console.error("Failed to initialize destination", e);
          }
        });
      }
    }, (error) => {
      console.error("Failed to fetch destinations", error);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeDestinations();
    };
  }, []);

  const handleSaveImage = async () => {
    if (!editingDest) return;
    try {
      await setDoc(doc(db, 'destinations', editingDest.id), {
        ...editingDest,
        imageUrl: editImageUrl
      });
      setEditingDest(null);
    } catch (e) {
      console.error("Failed to update destination", e);
      alert("Gagal menyimpan gambar destinasi.");
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold">Akses Ditolak</p>
        <button onClick={() => onNavigate(AppRoute.HOME)} className="mt-4 text-blue-500">Kembali ke Beranda</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-[50] bg-[#1877F2] flex items-center gap-4 py-4 px-6 border-b border-white/10 shadow-md">
        <button 
          onClick={() => onNavigate(AppRoute.ACCOUNT)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shadow-sm hover:bg-white/10 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Panel Admin</h2>
          <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mt-1">Transcity Dashboard</p>
        </div>
      </header>

      <div className="flex bg-white border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('laporan')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'laporan' ? 'border-[#1877F2] text-[#1877F2]' : 'border-transparent text-slate-400'}`}
        >
          Laporan Penumpang
        </button>
        <button 
          onClick={() => setActiveTab('gambar')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'gambar' ? 'border-[#1877F2] text-[#1877F2]' : 'border-transparent text-slate-400'}`}
        >
          Kelola Gambar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {activeTab === 'laporan' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-center text-slate-400 text-xs font-bold py-10">Belum ada laporan penumpang.</p>
            ) : (
              bookings.map((b, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-slate-800">{b.customerName}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{b.phone || '-'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                      b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                      b.status === 'Completed' ? 'bg-[#1877F2]/10 text-[#1877F2]' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Rute</p>
                      <p className="text-[10px] font-black text-slate-700">{b.route}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Jadwal</p>
                      <p className="text-[10px] font-black text-slate-700">{b.date} • {b.time}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Kursi</p>
                      <p className="text-[10px] font-black text-slate-700">{b.seats} Kursi</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Total</p>
                      <p className="text-[10px] font-black text-[#1877F2]">Rp {b.totalPrice.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'gambar' && (
          <div className="space-y-4">
            <button 
              onClick={() => setShowBannerModal(true)}
              className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#1877F2]/30 flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors"
            >
              <i className="fa-solid fa-images"></i>
              Kelola Banner Beranda
            </button>

            <div className="h-px bg-slate-200 my-6"></div>

            <p className="text-[10px] text-slate-500 font-bold mb-4">Edit gambar destinasi yang ditampilkan di halaman utama.</p>
            {destinations.map((dest) => (
              <div key={dest.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
                <img src={dest.imageUrl} alt={dest.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-800">{dest.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{dest.category}</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingDest(dest);
                    setEditImageUrl(dest.imageUrl);
                  }}
                  className="w-8 h-8 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2]/20 transition-colors"
                >
                  <i className="fa-solid fa-pen text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Image Modal */}
      {editingDest && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Edit Gambar</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{editingDest.name}</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-full aspect-video rounded-xl bg-slate-100 overflow-hidden">
                <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL')} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">URL Gambar Baru</label>
                <input 
                  type="text" 
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-[#1877F2]"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setEditingDest(null)}
                className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveImage}
                className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-white bg-[#1877F2] hover:bg-blue-700 transition-colors shadow-lg shadow-[#1877F2]/30"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Settings Modal */}
      {showBannerModal && (
        <BannerSettingsModal 
          banners={banners} 
          onClose={() => setShowBannerModal(false)} 
          onSave={saveBanners} 
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
