import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

interface User {
    id: string;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<{ user: User }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for token on load
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        console.log('AuthContext - Init Check:', { token, savedUser });
        
        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                console.log('AuthContext - User loaded from localStorage:', parsedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('AuthContext - Error parsing user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: any): Promise<{ user: User }> => {
        try {
            console.log('AuthContext - Login attempt with:', credentials);
            const response = await authService.login(credentials);
            console.log('AuthContext - Login response:', response.data);
            
            const { token, user: userData } = response.data;
            
            if (!token || !userData) {
                throw new Error('Invalid response from server');
            }
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            console.log('AuthContext - User logged in successfully:', userData);
            
            return { user: userData };
        } catch (error) {
            console.error('AuthContext - Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        console.log('AuthContext - Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Debug log whenever user state changes
    useEffect(() => {
        console.log('AuthContext - User state changed:', user);
        console.log('AuthContext - isAuthenticated:', !!user);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};