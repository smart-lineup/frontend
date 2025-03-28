import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

type AuthContextType = {
    username: string | null;
    isAuthenticated: boolean;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
    authLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    username: null,
    isAuthenticated: false,
    fetchUser: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    authLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const fetchUser = async () => {
        setAuthLoading(true);
        try {
            const response = await axios.get(config.backend + "/auth/check", {
                withCredentials: true
            });
            if (!response.data || response.data == "login yet") {
                setUsername(null);
                setIsAuthenticated(false);
                return;
            };
            console.log(response.data);
            setUsername(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            setUsername(null);
            setIsAuthenticated(false);
            console.error("Error fetching user:", error);
            return;
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await axios.post(config.backend + "/user/logout", {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUsername(null);
            fetchUser();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    return (
        <AuthContext.Provider value={{ username, isAuthenticated, fetchUser, logout, authLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}