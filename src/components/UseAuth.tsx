import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

export const useAuth = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUser = async () => {
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

    return { username, isAuthenticated, logout };
};
