import React, { useState, useEffect } from 'react';
import { AppRoute, User, Booking } from './types';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import SchedulePage from './pages/SchedulePage';
import HistoryPage from './pages/HistoryPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import TarifPage from './pages/TarifPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import AboutPage from './pages/AboutPage';
import BottomNav from './components/BottomNav';
import InstallSystem from './components/InstallSystem';
import SplashScreen from './components/SplashScreen';
import { MOCK_BOOKINGS } from './constants';
import { auth, db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where, getDoc, getDocFromServer } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LOGIN);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role from Firestore
        let role: 'admin' | 'user' = 'user';
        let profilePic = '';
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            role = userDoc.data().role || 'user';
            profilePic = userDoc.data().profilePic || '';
          } else {
            // Check if default admin
            if (user.email === 'roadtripbali86@gmail.com' || user.email === 'trancitybali@gmail.com') {
              role = 'admin';
              await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                name: user.displayName || user.email?.split('@')[0] || 'User',
                role: 'admin',
                createdAt: new Date().toISOString()
              });
            } else {
              await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                name: user.displayName || user.email?.split('@')[0] || 'User',
                role: 'user',
                createdAt: new Date().toISOString()
              });
            }
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, `users/${user.uid}`);
        }

        setCurrentUser({
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || 'User',
          phone: user.phoneNumber || '',
          role: role,
          profilePic: profilePic,
          isLoggedIn: true
        });
        
        if (currentRoute === AppRoute.LOGIN || currentRoute === AppRoute.REGISTER) {
          setCurrentRoute(AppRoute.HOME);
        }
      } else {
        setCurrentUser(null);
      }
      setShowSplash(false);
    });

    return () => unsubscribe();
  }, [currentRoute]);

  useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      return;
    }

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
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
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') as AppRoute;
      if (Object.values(AppRoute).includes(hash)) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute(currentUser ? AppRoute.HOME : AppRoute.LOGIN);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const navigate = (route: AppRoute) => {
    window.location.hash = `#/${route}`;
  };

  const handleLogin = (userData: { email: string; name: string; phone: string; role?: 'admin' | 'user' }, rememberMe: boolean = false) => {
    // This is now handled by onAuthStateChanged, but we keep it for any manual updates needed
    navigate(AppRoute.HOME);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate(AppRoute.LOGIN);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleAddBooking = async (newBooking: Booking) => {
    if (!currentUser) return;
    const bookingId = Math.random().toString(36).substr(2, 9);
    const bookingWithId = {
      ...newBooking,
      id: bookingId,
      userId: currentUser.email,
      createdAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'bookings', bookingId), bookingWithId);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `bookings/${bookingId}`);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `bookings/${id}`);
    }
  };

  const handleUpdateUser = async (updatedData: { name: string; phone: string; profilePic?: string }) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await setDoc(userRef, updatedData, { merge: true });
      const newUser = { ...currentUser, ...updatedData };
      setCurrentUser(newUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser!.uid}`);
    }
  };

  if (showSplash) {
    return (
      <div className="flex justify-center min-h-screen bg-slate-100">
        <div className="w-full max-w-md bg-white h-screen flex flex-col relative shadow-2xl overflow-hidden border-x border-slate-200">
          <SplashScreen onFinish={() => setShowSplash(false)} />
        </div>
      </div>
    );
  }

  if (!currentUser && currentRoute !== AppRoute.LOGIN && currentRoute !== AppRoute.REGISTER) {
    return (
      <div className="flex justify-center min-h-screen bg-slate-100">
        <div className="w-full max-w-md bg-[#1877F2] min-h-screen relative shadow-2xl overflow-hidden border-x border-blue-900/30">
          <LoginPage onLogin={handleLogin} onNavigate={navigate} />
        </div>
      </div>
    );
  }

  const renderRoute = () => {
    switch (currentRoute) {
      case AppRoute.LOGIN: return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case AppRoute.REGISTER: return <RegisterPage onRegister={handleLogin} onNavigate={navigate} />;
      case AppRoute.HOME: return <HomePage onNavigate={navigate} user={currentUser} />;
      case AppRoute.BOOKING: 
        return <BookingPage 
          onNavigate={navigate} 
          onAddBooking={handleAddBooking}
          user={currentUser}
        />;
      case AppRoute.SCHEDULE: return <SchedulePage onNavigate={navigate} user={currentUser} />;
      case AppRoute.HISTORY: 
        return <HistoryPage 
          onNavigate={navigate} 
          bookings={bookings} 
          onDeleteBooking={handleDeleteBooking} 
          user={currentUser}
        />;
      case AppRoute.ACCOUNT: return <AccountPage onNavigate={navigate} user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
      case AppRoute.SETTINGS: return <SettingsPage onNavigate={navigate} />;
      case AppRoute.TARIF: return <TarifPage onNavigate={navigate} />;

      case AppRoute.ABOUT: return <AboutPage onNavigate={navigate} />;
      case AppRoute.ADMIN: return <AdminDashboardPage currentUser={currentUser} onNavigate={navigate} />;
      default: return <HomePage onNavigate={navigate} user={currentUser} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md bg-white h-screen flex flex-col relative shadow-2xl overflow-hidden border-x border-slate-200">
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {renderRoute()}
        </main>
        {currentUser && currentRoute !== AppRoute.LOGIN && currentRoute !== AppRoute.REGISTER && (
          <BottomNav currentRoute={currentRoute} onNavigate={navigate} />
        )}
        <InstallSystem />
      </div>
    </div>
  );
};

export default App;
