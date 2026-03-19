import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const useCustomQRIS = () => {
  const [customQRIS, setCustomQRIS] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'qris'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().imageUrl) {
        setCustomQRIS(docSnap.data().imageUrl);
      }
    }, (error) => {
      console.error("Failed to fetch QRIS", error);
    });

    return () => unsubscribe();
  }, []);

  const downloadQRIS = () => {
    const imageUrl = customQRIS || "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=QRIS_TRANSCITY_8271591608";
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'QRIS_Transcity.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error('Failed to download QRIS', err);
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'QRIS_Transcity.jpg';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  return { customQRIS, downloadQRIS };
};
