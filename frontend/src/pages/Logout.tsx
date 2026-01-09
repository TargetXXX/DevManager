import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    logout();

    navigate('/login');

  return (<></>);
}