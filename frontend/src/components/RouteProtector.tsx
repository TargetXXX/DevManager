import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { checkToken } from "../services/auth";
import type { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { dev, logout } = useAuth();
    const navigate = useNavigate();

    if (!dev) return <Navigate to="/login" replace />;

    checkToken(() => {
        logout();
        navigate('login');
        localStorage.setItem('feedback', 'Sessao expirada');
    });

    if(dev.first_login) return <Navigate to="/trocarsenha" replace />;
    
    return children;
}