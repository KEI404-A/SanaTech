// src/services/authService.ts (Versi Perbaikan)
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase-config';

// --- Login dengan Google ---
export const signInWithGoogle = async (useRedirect = false) => {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  
  try {
    let result;
    
    if (useRedirect) {
      // Gunakan redirect untuk menghindari popup blocker
      await signInWithRedirect(auth, provider);
      return { success: true, redirect: true };
    } else {
      // Coba popup terlebih dahulu
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        // Jika popup gagal karena popup blocker, coba redirect
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          console.log('Popup blocked, trying redirect...');
          await signInWithRedirect(auth, provider);
          return { success: true, redirect: true };
        }
        throw popupError;
      }
    }
    
    if (result) {
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      
      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (firestoreError: any) {
        // Jika error Firestore, tetap return success karena auth sudah berhasil
        console.warn("Error saving user to Firestore: ", firestoreError);
        // Jangan throw error, karena autentikasi sudah berhasil
      }
      
      return { success: true, user };
    }
    
    return { success: false, error: new Error('No result from authentication') };
  } catch (error: any) {
    console.error("Error signing in with Google: ", error);
    
    // Berikan pesan error yang lebih informatif
    let errorMessage = 'Gagal masuk dengan Google.';
    if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup diblokir. Silakan coba lagi atau gunakan email/password.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Popup ditutup. Silakan coba lagi.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'Domain tidak diizinkan. Hubungi administrator.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Google sign-in tidak diaktifkan. Hubungi administrator.';
    } else if (error.message?.includes('permissions')) {
      errorMessage = 'Izin tidak cukup. Pastikan Firestore rules sudah dikonfigurasi dengan benar.';
    }
    
    return { success: false, error, errorMessage };
  }
};

// --- Handle redirect result setelah Google sign-in ---
export const handleGoogleRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      
      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (firestoreError: any) {
        console.warn("Error saving user to Firestore: ", firestoreError);
      }
      
      return { success: true, user };
    }
    return { success: false, user: null };
  } catch (error: any) {
    console.error("Error handling Google redirect: ", error);
    return { success: false, error };
  }
};

// --- Registrasi dengan Email (dengan tipe data yang benar) ---
export const registerWithEmail = async (displayName: string, email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile dengan displayName
        try {
            await updateProfile(user, { displayName });
        } catch (profileError) {
            console.warn("Error updating profile: ", profileError);
            // Lanjutkan meskipun update profile gagal
        }

        // Simpan ke Firestore
        const userRef = doc(db, "users", user.uid);
        try {
            await setDoc(userRef, {
                uid: user.uid,
                displayName,
                email: user.email || email,
                photoURL: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        } catch (firestoreError: any) {
            console.warn("Error saving user to Firestore: ", firestoreError);
            // Tetap return success karena user sudah dibuat di Auth
        }
        
        return { success: true, user };
    } catch (error: any) {
        console.error("Error registering with email: ", error);
        return { success: false, error };
    }
}

// --- Login dengan Email (dengan tipe data yang benar) ---
export const signInWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Error signing in with email: ", error);
        return { success: false, error };
    }
}

// --- Logout ---
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error signing out: ", error);
        return { success: false, error };
    }
}