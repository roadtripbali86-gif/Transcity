import React, { useState, useEffect } from 'react';
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

export const useCustomQRIS = () => {
  const [customQRIS, setCustomQRIS] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'qris'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.imageUrl) {
          setCustomQRIS(data.imageUrl);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/qris');
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

  const saveQRIS = async (imageUrl: string) => {
    try {
      await setDoc(doc(db, 'settings', 'qris'), { imageUrl }, { merge: true });
      setCustomQRIS(imageUrl);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/qris');
    }
  };

  return { customQRIS, downloadQRIS, saveQRIS };
};
