
import { ShuttleSchedule, Destination } from './types';

export const DESTINATION_PRICES: Record<string, number> = {
  'Denpasar': 140000,
  'Airport': 165000,
  'Jimbaran': 180000,
  'Nusa Dua': 200000,
  'Seminyak': 150000,
  'Canggu': 140000,
  'Gianyar': 160000,
  'Tabanan': 140000,
};

// Daftar rute lengkap pergi-pulang
const routeList = [
  "Singaraja - Denpasar",
  "Denpasar - Singaraja",
  "Singaraja - Airport",
  "Airport - Singaraja",
  "Singaraja - Jimbaran",
  "Jimbaran - Singaraja",
  "Singaraja - Nusa Dua",
  "Nusa Dua - Singaraja",
  "Singaraja - Seminyak",
  "Seminyak - Singaraja",
  "Singaraja - Canggu",
  "Canggu - Singaraja",
  "Singaraja - Tabanan",
  "Tabanan - Singaraja",
  "Singaraja - Gianyar",
  "Gianyar - Singaraja"
];

const specialSchedules: Record<string, string[]> = {
  "Singaraja - Denpasar": ["05:00", "09:00"],
  "Denpasar - Singaraja": ["12:00", "16:00"],
  "Airport - Singaraja": ["11:00", "15:00"],
  "Singaraja - Airport": ["05:00", "09:00"],
};

export const SHUTTLE_SCHEDULES: ShuttleSchedule[] = routeList.flatMap((route, index) => {
  const times = specialSchedules[route] || ["09:00", "15:00"];
  
  return times.map((time, tIndex) => ({
    id: `sch-${index}-${tIndex}`,
    time: time,
    route: route,
    price: 140000, // Akan dihitung dinamis di BookingPage
    availableSeats: 4,
    type: 'Regular'
  }));
});

export const MOCK_BOOKINGS = [
  { id: 'B001', customerName: 'Budi Santoso', route: 'Singaraja - Denpasar', date: '2023-11-20', time: '05:00', seats: 1, totalPrice: 140000, status: 'Confirmed' },
];

export const BALI_DESTINATIONS: Destination[] = [
  { id: '1', name: 'Promo 1', lat: -8.6212, lng: 115.0868, imageUrl: '', category: 'Promo' },
  { id: '2', name: 'Promo 2', lat: -8.8291, lng: 115.0849, imageUrl: '', category: 'Promo' },
  { id: '3', name: 'Promo 3', lat: -8.4354, lng: 115.279, imageUrl: '', category: 'Promo' },
  { id: '4', name: 'Promo 4', lat: -8.7175, lng: 115.1747, imageUrl: '', category: 'Promo' },
];

export const MOCK_STATS_DATA = [
  { name: 'Jan', visitors: 400 },
  { name: 'Feb', visitors: 300 },
  { name: 'Mar', visitors: 600 },
  { name: 'Apr', visitors: 800 },
  { name: 'Mei', visitors: 700 },
  { name: 'Jun', visitors: 900 },
  { name: 'Jul', visitors: 1100 },
  { name: 'Agu', visitors: 1284 },
];