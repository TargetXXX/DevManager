import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";
import type { Dev, LoginResponse } from "../types/dev";

type AuthContextType = {
    dev: Dev | null;
    loginUser: (data: any) => void;
    logout: () => void;
    setDev: Dispatch<SetStateAction<Dev | null>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [dev, setDev] = useState<Dev | null>(() => {
        const stored = localStorage.getItem("dev");

        return stored ? JSON.parse(stored) : null;
    });

    const [loading, setLoading] = useState<boolean>(false);

    function loginUser(data: LoginResponse) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("dev", JSON.stringify(data.dev));
        setDev(data.dev);
    }

    function logout() {
        localStorage.clear();
        setDev(null);
    }

    return (
    <AuthContext.Provider value={{dev, loginUser, logout, setDev, loading, setLoading }}>
        {children}
    </AuthContext.Provider>
    );
}