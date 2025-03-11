import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

export const useAuth = () => {
    const [username, setUsername] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(config.backend + "/auth/check", {
                        withCredentials: true
                    });
                if (response.data === 'login yet') {
                    setUsername(null);
                    setIsAuthenticated(false);
                    return;
                }
                setUsername(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        fetchUser();
    }, []);

    return { username, isAuthenticated };
};