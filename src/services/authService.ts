// src/services/authService.ts (Versi Perbaikan)
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from '../firebase-config';

const db = getFirestore();

// --- Login dengan Google ---
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true, user };
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    return { success: false, error };
  }
};

// --- Registrasi dengan Email (dengan tipe data yang benar) ---
export const registerWithEmail = async (displayName: string, email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName });

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            displayName,
            email: user.email,
            photoURL: '',
            createdAt: new Date().toISOString(),
        });
        return { success: true, user };
    } catch (error) {
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