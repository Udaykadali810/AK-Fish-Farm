import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get additional user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser({ ...firebaseUser, ...userDoc.data() });
                } else {
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        const savedTheme = localStorage.getItem('ak_theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark');
        }

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    };

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user exists in Firestore, if not create
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    createdAt: new Date().toISOString()
                });
            }
            return { success: true, user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;

            // Update Firebase profile name
            await updateProfile(user, { displayName: name });

            // Store extra info in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                phone,
                role: 'user',
                createdAt: new Date().toISOString()
            });

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        const newMode = !isDarkMode;
        if (newMode) {
            document.body.classList.add('dark');
            localStorage.setItem('ak_theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('ak_theme', 'light');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout, isDarkMode, toggleDarkMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
