import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

type AuthContextType = {
    username: string | null;
    email: string | null;
    role: string | null;
    isAuthenticated: boolean;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
    authLoading: boolean;
    isPremium: boolean;
};

const AuthContext = createContext<AuthContextType>({
    username: null,
    email: null,
    role: null,
    isAuthenticated: false,
    fetchUser: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    authLoading: true,
    isPremium: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [isPremium, setIsPremium] = useState<boolean>(false);

    const fetchUser = async () => {
        setAuthLoading(true);
        try {
            const response = await axios.get(config.backend + "/auth/check", {
                withCredentials: true
            });
            if (!response.data || response.data == "login yet") {
                setUsername(null);
                setEmail(null);
                setRole(null);
                setIsAuthenticated(false);
                setIsPremium(false);
                return;
            };

            const [username, email, role] = response.data.split(":");
            setUsername(username);
            setEmail(email);
            setRole(role);
            setIsAuthenticated(true);
            setIsPremium(role !== "FREE")
        } catch (error) {
            setUsername(null);
            setEmail(null);
            setRole(null);
            setIsAuthenticated(false);
            setIsPremium(false);
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
        <AuthContext.Provider value={{ username, email, role, isAuthenticated, fetchUser, logout, authLoading, isPremium }}>
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