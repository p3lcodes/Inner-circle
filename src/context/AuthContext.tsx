import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, User> = {
    super_admin: {
        id: '1',
        role: 'super_admin',
        full_name: 'Main Admin',
        email: 'admin@innercircle.com',
        phone: '+254 712 345 678',
        status: 'active',
        created_at: new Date().toISOString()
    },
    razak: {
        id: 'user_razak',
        role: 'super_admin',
        full_name: 'Razak',
        email: 'razakwako45@gmail.com',
        phone: '+254 700 111 222',
        status: 'active',
        created_at: new Date().toISOString()
    },
    joseph: {
        id: 'user_joseph',
        role: 'investor',
        full_name: 'Joseph Gitari',
        email: 'josephwanjohi@gmail.com',
        phone: '+254 722 333 444',
        status: 'active',
        created_at: new Date().toISOString()
    },
    investor: {
        id: '101',
        role: 'investor',
        full_name: 'Samuel Mckenzie',
        email: 'sam@example.com',
        phone: '+254 722 000 000',
        status: 'active',
        created_at: new Date().toISOString()
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Try to load user from saved session first (for fast loading)
                const saved = localStorage.getItem('ic_user_session');
                if (saved) {
                    setUser(JSON.parse(saved));
                }

                // If we have an API, try to verify
                const token = localStorage.getItem('ic_auth_token');
                if (token && import.meta.env.VITE_API_URL) {
                    try {
                        const data = await apiFetch('/auth/me');
                        if (data.user) {
                            setUser(data.user);
                            localStorage.setItem('ic_user_session', JSON.stringify(data.user));
                        }
                    } catch (e) {
                        // If token is invalid or API is down, we stay with saved or mock
                        console.log("API not reachable, using saved session");
                    }
                }
            } catch (err) {
                console.error("Auth check failed", err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const signIn = async (email: string, password: string) => {
        // demo mode: if no API or if it's a known demo login
        const demoEmails = ['sam@example.com', 'admin@innercircle.com', 'razakwako45@gmail.com', 'josephwanjohi@gmail.com'];
        const useMock = !import.meta.env.VITE_API_URL || demoEmails.includes(email);

        if (useMock) {
            // Check specific passwords for new users
            if (email === 'razakwako45@gmail.com' && password !== 'guyesa10333') {
                throw new Error('Invalid password for Razak');
            }
            if (email === 'josephwanjohi@gmail.com' && password !== 'josep3l') {
                throw new Error('Invalid password for Joseph');
            }

            let mockKey: string = 'investor';

            if (email === 'razakwako45@gmail.com' || email.includes('admin')) {
                mockKey = email === 'razakwako45@gmail.com' ? 'razak' : 'super_admin';
            } else if (email === 'josephwanjohi@gmail.com') {
                mockKey = 'joseph';
            }

            const mockUser = MOCK_USERS[mockKey] || MOCK_USERS.investor;
            setUser(mockUser);
            localStorage.setItem('ic_user_session', JSON.stringify(mockUser));
            return;
        }

        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            localStorage.setItem('ic_auth_token', data.token);
            setUser(data.user);
            localStorage.setItem('ic_user_session', JSON.stringify(data.user));
        } catch (error: any) {
            // fallback to mock login even on failure if it's a demo credential
            if (email === 'sam@example.com' || email === 'admin@innercircle.com') {
                const role = email.includes('admin') ? 'super_admin' : 'investor';
                setUser(MOCK_USERS[role]);
                return;
            }
            throw new Error(error.message || 'Login failed. Check your connection.');
        }
    };

    const signOut = () => {
        localStorage.removeItem('ic_auth_token');
        localStorage.removeItem('ic_user_session');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
