import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';

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

export interface CustomBanner {
  id: string;
  url: string;
  type: 'video' | 'image';
  file?: File;
}

export const useCustomBanners = () => {
  const [banners, setBanners] = useState<(CustomBanner | null)[]>(Array(7).fill(null));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'banners'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.banners) {
          setBanners(data.banners);
        }
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/banners');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveBanners = async (newBanners: (CustomBanner | null)[]) => {
    try {
      const processedBanners = await Promise.all(
        newBanners.map(async (banner) => {
          if (!banner) return null;
          if (banner.file) {
            return new Promise<CustomBanner>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  id: banner.id,
                  type: banner.type,
                  url: reader.result as string
                });
              };
              reader.onerror = reject;
              reader.readAsDataURL(banner.file!);
            });
          }
          return banner;
        })
      );
      
      await setDoc(doc(db, 'settings', 'banners'), { banners: processedBanners }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/banners');
    }
  };

  return { banners, saveBanners, isLoading };
};
