import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  register: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user from firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        let userData: User;
        
        if (userSnap.exists()) {
          userData = { id: firebaseUser.uid, ...userSnap.data() } as User;
          // Force admin role if it's the admin email but not set as admin
          if (userData.email === 'namemdasraful@gmail.com' && userData.role !== 'admin') {
            userData.role = 'admin';
            await setDoc(userRef, { role: 'admin', updatedAt: serverTimestamp() }, { merge: true });
          }
        } else {
          // Create user if not exists
          const role = firebaseUser.email === 'namemdasraful@gmail.com' ? 'admin' : 'user';
          const newUser = {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            role,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            wishlist: []
          };
          await setDoc(userRef, newUser);
          userData = { id: firebaseUser.uid, ...newUser } as unknown as User;
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(res.user, { displayName: name });
    
    const userRef = doc(db, 'users', res.user.uid);
    const role = email === 'namemdasraful@gmail.com' ? 'admin' : 'user';
    const newUser = {
      name: name,
      email: email,
      phone: '',
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      wishlist: []
    };
    await setDoc(userRef, newUser);
  };

  const register = login;

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithEmail, registerWithEmail, register, logout, isAdmin: user?.role === 'admin' || user?.email === 'namemdasraful@gmail.com', loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

