import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';

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
    const unsubscribe = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const newBanners: (CustomBanner | null)[] = Array(7).fill(null);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const index = parseInt(doc.id, 10);
        if (!isNaN(index) && index >= 0 && index < 7) {
          newBanners[index] = {
            id: doc.id,
            url: data.url,
            type: data.type
          };
        }
      });
      setBanners(newBanners);
      setIsLoading(false);
    }, (error) => {
      console.error("Failed to fetch banners", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveBanners = async (newBanners: (CustomBanner | null)[]) => {
    try {
      for (let i = 0; i < newBanners.length; i++) {
        const banner = newBanners[i];
        if (!banner) {
          try {
            await deleteDoc(doc(db, 'banners', i.toString()));
          } catch (e) {
            // Ignore if document doesn't exist
          }
          continue;
        }
        
        let url = banner.url;
        if (banner.file) {
          // Convert file to base64 for Firestore
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(banner.file!);
          });
          url = base64;
        }
        
        await setDoc(doc(db, 'banners', i.toString()), {
          url: url,
          type: banner.type
        });
      }
    } catch (err) {
      console.error('Failed to save custom banners', err);
      alert('Gagal menyimpan banner. Pastikan ukuran file tidak terlalu besar (maksimal 1MB).');
    }
  };

  return { banners, saveBanners, isLoading };
};
