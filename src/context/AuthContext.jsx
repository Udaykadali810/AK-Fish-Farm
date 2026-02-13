import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ name: 'Guest', phoneNumber: '0000000000', role: 'user' });
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const checkAuth = async () => {
            const savedProfile = JSON.parse(localStorage.getItem('ak_user_profile') || '{}');
            const token = localStorage.getItem('ak_token');

            // Base user starts with Guest defaults, overridden by saved profile
            let userState = { name: 'Guest', phoneNumber: '0000000000', role: 'user', ...savedProfile };

            if (token) {
                const role = localStorage.getItem('ak_role');
                userState = { ...userState, token, role };
            }

            setUser(userState);
            setLoading(false);
        };
        checkAuth();
    }, []);

    const sendOtp = async (phoneNumber) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/send-otp`, { phoneNumber });
            return { success: true, message: res.data.message, debugOtp: res.data.debugOtp };
        } catch (error) {
            console.error('sendOtp Error:', error);
            if (error.code === 'ERR_NETWORK') {
                return { success: false, message: 'Unable to connect to server. Is it running?' };
            }
            return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
        }
    };

    const verifyOtp = async (phoneNumber, otp) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/verify-otp`, { phoneNumber, otp });
            const { token, user, role } = res.data;
            localStorage.setItem('ak_token', token);
            localStorage.setItem('ak_role', role);
            setUser({ ...user, token, role });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Invalid OTP' };
        }
    };

    const loginWithPhone = async (phoneNumber) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login-phone`, { phoneNumber });
            const { token, user, role } = res.data;
            localStorage.setItem('ak_token', token);
            localStorage.setItem('ak_role', role);
            setUser({ ...user, token, role });
            return { success: true };
        } catch (error) {
            console.error('Phone Login Error:', error);
            if (error.code === 'ERR_NETWORK') {
                return { success: false, message: 'Unable to connect to server.' };
            }
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const login = async (email, password) => { // Admin login
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            const { token, role } = res.data;
            localStorage.setItem('ak_token', token);
            localStorage.setItem('ak_role', role);
            setUser({ token, role });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('ak_token');
        localStorage.removeItem('ak_role');
        setUser({ name: 'Guest', phoneNumber: '0000000000', role: 'user' });
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('ak_theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('ak_theme', 'light');
        }
    };

    const updateUserProfile = (newDetails) => {
        setUser(prev => {
            const updated = { ...prev, ...newDetails };
            localStorage.setItem('ak_user_profile', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, loginWithPhone, login, logout, isDarkMode, toggleDarkMode, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

