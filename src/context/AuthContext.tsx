import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const BOOTSTRAPPED_ADMIN_EMAIL = 'userhelpdesk9@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // 1. Check if email matches bootstrapped administrator
        const emailLower = user.email?.toLowerCase().trim();
        if (emailLower === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // 2. Check if UID exists in /admins/{uid}
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists() && adminDoc.data()?.enabled === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.warn('Error checking administrator status:', err);
        // Fallback for safety: only allow if bootstrapped admin email
        if (user.email?.toLowerCase().trim() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in window closed before completing.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setAuthError(err.message || 'Unable to authenticate with Google.');
      }
    }
  };

  const signOutUser = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (err: any) {
      console.error('Sign-out failed:', err);
      setAuthError(err.message || 'Error signing out.');
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      loading,
      authError,
      signInWithGoogle,
      signOutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
