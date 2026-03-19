
export interface ShuttleSchedule {
  id: string;
  time: string;
  route: string;
  price: number;
  availableSeats: number;
  type: 'Regular' | 'VIP';
}

export interface Booking {
  id: string;
  userId: string;
  customerName: string;
  route: string;
  date: string;
  time: string;
  seats: number;
  seatNumbers?: number[];
  totalPrice: number;
  status: 'Confirmed' | 'Pending' | 'Completed';
  pickup?: string;
  dropoff?: string;
  phone?: string;
  createdAt?: string;
}

export enum AppRoute {
  LOGIN = 'login',
  REGISTER = 'register',
  HOME = 'home',
  BOOKING = 'booking',
  SCHEDULE = 'schedule',
  HISTORY = 'history',
  DASHBOARD = 'dashboard',
  PACKAGE = 'package',
  ACCOUNT = 'account',
  SETTINGS = 'settings',
  TARIF = 'tarif',
  ABOUT = 'about',
  ADMIN = 'admin'
}

export interface User {
  email: string;
  name: string;
  phone: string;
  isLoggedIn: boolean;
  role?: 'admin' | 'user';
  profilePic?: string;
}

export interface Destination {
  id: string;
  name: string;
  lat: number;
  lng: number;
  imageUrl: string;
  category: 'Culture' | 'Nature' | 'Nightlife' | 'Beach';
}

export interface ItineraryItem {
  time: string;
  activity: string;
  location: string;
}
