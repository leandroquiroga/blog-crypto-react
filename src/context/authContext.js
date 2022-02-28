import { createContext, useEffect, useState } from 'react';
import { auth } from '../firabase.config';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';

export const authContext = createContext();




export const AuthProvaider = ({ children }) => {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(auth.currentUser);
      } else {
        setUser(null);
      };
    });

    return () => unsuscribe();
  }, []);

  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  
  const logIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logOut = () => signOut(auth);

  const loginWithGoogle = () => {
    const googleProvaider = new GoogleAuthProvider();
    
    return signInWithPopup(auth, googleProvaider);
  }

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  const value = {
    signUp,
    logIn,
    logOut,
    loginWithGoogle,
    resetPassword,
    user,
  };


  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
};