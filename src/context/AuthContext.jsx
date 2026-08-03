import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("prepverse_token");
            const storedUser = localStorage.getItem("prepverse_user");

            if (storedToken && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Failed to restore auth session:", error);
            localStorage.removeItem("prepverse_token");
            localStorage.removeItem("prepverse_user");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback((response) => {
        const { token: accessToken, user: userData } = response;

        if (!accessToken || !userData) {
            console.error("Invalid login response:", response);
            return;
        }

        const userInfo = {
            id: userData.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email_verified: userData.email_verified,
            profile_completed: userData.profile_completed
        };

        // Save to state
        setToken(accessToken);
        setUser(userInfo);
        setIsAuthenticated(true);

        // Persist to localStorage
        localStorage.setItem("prepverse_token", accessToken);
        localStorage.setItem("prepverse_user", JSON.stringify(userInfo));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        localStorage.removeItem("prepverse_token");
        localStorage.removeItem("prepverse_user");
    }, []);

    const updateProfileComplete = useCallback(() => {
        if (user) {
            const updatedUser = { ...user, profile_completed: true };
            setUser(updatedUser);
            localStorage.setItem("prepverse_user", JSON.stringify(updatedUser));
        }
    }, [user]);

    const updateUser = useCallback((partial) => {
        setUser((previous) => {
            const updatedUser = { ...previous, ...partial };
            localStorage.setItem("prepverse_user", JSON.stringify(updatedUser));
            return updatedUser;
        });
    }, []);

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfileComplete,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
