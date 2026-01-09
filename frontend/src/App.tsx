import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Desenvolvedores from './pages/Desenvolvedores';
import Niveis from './pages/Niveis';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import { ProtectedRoute } from './components/RouteProtector';
import TrocarSenha from './pages/TrocarSenha';
import Logout from './pages/Logout';
import AppLayout from './components/Layout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/trocarsenha" element={<TrocarSenha/>}/>
          <Route path="/" element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
            <Route index element={<Home/>}/>
            <Route path="desenvolvedores" element={<Desenvolvedores/>}/>
            <Route path="niveis" element={<Niveis/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
