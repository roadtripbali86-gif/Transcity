
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { BALI_DESTINATIONS } from '../constants';
import { AppRoute, Destination } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPageProps {
  onNavigate: (route: AppRoute) => void;
}

const LocationMarker: React.FC<{ dest: Destination }> = ({ dest }) => {
  return (
    <Marker position={[dest.lat, dest.lng]}>
      <Popup className="custom-popup">
        <div className="w-48 p-1">
          <img src={dest.imageUrl} alt={dest.name} className="w-full h-24 object-cover rounded-xl mb-3 shadow-sm" />
          <h3 className="font-black text-[#1e1b4b] uppercase text-[10px] tracking-tight">{dest.name}</h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-3">{dest.category}</p>
          <button className="w-full bg-[#2bbbb0] text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
            Booking
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

const MapPage: React.FC<MapPageProps> = ({ onNavigate }) => {
  const initialPos: [number, number] = [-8.4095, 115.1889];
  const [destinations, setDestinations] = useState<Destination[]>(BALI_DESTINATIONS);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'destinations'), (snapshot) => {
      if (!snapshot.empty) {
        const d: Destination[] = [];
        snapshot.forEach((doc) => {
          d.push({ id: doc.id, ...doc.data() } as Destination);
        });
        setDestinations(d);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-5 left-5 right-5 z-[500] flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => onNavigate(AppRoute.HOME)}
          className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#1877F2] shadow-2xl pointer-events-auto active:scale-95"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-white/50 pointer-events-auto">
          <h2 className="text-sm font-black text-[#1e1b4b] uppercase tracking-tighter leading-none">Interactive</h2>
          <p className="text-[9px] font-bold text-[#1877F2] uppercase tracking-widest mt-1">Bali Tour Map</p>
        </div>
      </div>

      <div className="flex-1 z-0">
        <MapContainer 
          center={initialPos} 
          zoom={10} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {destinations.map(dest => (
            <LocationMarker key={dest.id} dest={dest} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
