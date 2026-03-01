import { createContext, useContext, useState } from 'react';
import { USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('devjobs_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (email, password) => {
        const found = USERS.find(
            u => u.email === email && u.password === password && u.status === 'active'
        );
        if (found) {
            const userData = { ...found };
            delete userData.password;
            setUser(userData);
            localStorage.setItem('devjobs_user', JSON.stringify(userData));
            return { success: true, user: userData };
        }
        return { success: false, message: 'Email hoặc mật khẩu không chính xác' };
    };

    const logout = () => {
        setUser(null);
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
