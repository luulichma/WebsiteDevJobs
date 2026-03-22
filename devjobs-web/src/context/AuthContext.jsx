import { createContext, useContext, useState } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('devjobs_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email, password) => {
        try {
            const res = await apiService.post('/auth/login', { email, password });
            const { token, user: userData } = res.data;
            localStorage.setItem('devjobs_token', token);
            localStorage.setItem('devjobs_user', JSON.stringify(userData));
            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi đăng nhập' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('devjobs_token');
        localStorage.removeItem('devjobs_user');
    };

    const isAuthenticated = !!user;
    const isCandidate = user?.role === 'candidate';
    const isRecruiter = user?.role === 'recruiter';
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isCandidate, isRecruiter, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
