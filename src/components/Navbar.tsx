import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Navbar() {
    const { user } = useAuth();
    const location = useLocation();
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) return storedRole;
        if (token) {
            try {
                return JSON.parse(atob(token.split('.')[1])).r;
            } catch {
                return null;
            }
        }
        return null;
    });
    const isAdmin = role === 'ADMIN';
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const t = localStorage.getItem('token');
        let r = localStorage.getItem('role');
        if (!r && t) {
            try {
                r = JSON.parse(atob(t.split('.')[1])).r;
            } catch {
                r = null;
            }
        }
        setToken(t);
        setRole(r);
    }, [location]);

    const handleLogout = async () => {
        if (user) await signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-teal-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-teal-700">Aike</h1>
                </div>
                <div className="hidden md:flex space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-teal-700 font-medium">Inicio</Link>
                    <a href="#nosotros" className="text-gray-700 hover:text-teal-700 font-medium">Nosotros</a>
                    <a href="#cabanas" className="text-gray-700 hover:text-teal-700 font-medium">Cabañas</a>
                    <a href="#ubicacion" className="text-gray-700 hover:text-teal-700 font-medium">Ubicación</a>
                    <a href="#contacto" className="text-gray-700 hover:text-teal-700 font-medium">Contacto</a>
                    {isAdmin && (
                        <Link to="/admin" className="text-gray-700 hover:text-teal-700 font-medium">ABM</Link>
                    )}
                    {!user && !token && (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-teal-700 font-medium">Iniciar Sesión</Link>
                            <Link to="/register" className="text-gray-700 hover:text-teal-700 font-medium">Registrarse</Link>
                        </>
                    )}
                    {(user || token) && (
                        <button onClick={handleLogout} className="text-gray-700 hover:text-teal-700 font-medium">Cerrar sesión</button>
                    )}
                </div>
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="md:hidden bg-white pb-4 px-4">
                    <Link to="/" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Inicio</Link>
                    <a href="#nosotros" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Nosotros</a>
                    <a href="#cabanas" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Cabañas</a>
                    <a href="#ubicacion" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Ubicación</a>
                    <a href="#contacto" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Contacto</a>
                    {isAdmin && (
                        <Link to="/admin" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">ABM</Link>
                    )}
                    {!user && !token && (
                        <>
                            <Link to="/login" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Iniciar Sesión</Link>
                            <Link to="/register" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Registrarse</Link>
                        </>
                    )}
                    {(user || token) && (
                        <button onClick={handleLogout} className="block py-2 text-gray-700 hover:text-teal-700 font-medium text-left w-full">Cerrar sesión</button>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
