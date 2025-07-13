import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

function Navbar() {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    let role = localStorage.getItem('role');
    if (!role && token) {
        try {
            role = JSON.parse(atob(token.split('.')[1])).r;
        } catch {
            role = null;
        }
    }
    const isAdmin = role === 'ADMIN';
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (user) await signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/') }>
                    <svg className="w-8 h-8 text-teal-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-teal-700">Aike</h1>
                </div>
                <div className="hidden md:flex space-x-8">
                    <Link to="/#inicio" className="text-gray-700 hover:text-teal-700 font-medium">Inicio</Link>
                    <Link to="/#nosotros" className="text-gray-700 hover:text-teal-700 font-medium">Nosotros</Link>
                    <Link to="/#cabanas" className="text-gray-700 hover:text-teal-700 font-medium">Cabañas</Link>
                    <Link to="/#ubicacion" className="text-gray-700 hover:text-teal-700 font-medium">Ubicación</Link>
                    <Link to="/#contacto" className="text-gray-700 hover:text-teal-700 font-medium">Contacto</Link>
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
                    <Link to="/#inicio" className="block py-2 text-gray-700 hover:text-teal-700 font-medium" onClick={() => setMenuOpen(false)}>Inicio</Link>
                    <Link to="/#nosotros" className="block py-2 text-gray-700 hover:text-teal-700 font-medium" onClick={() => setMenuOpen(false)}>Nosotros</Link>
                    <Link to="/#cabanas" className="block py-2 text-gray-700 hover:text-teal-700 font-medium" onClick={() => setMenuOpen(false)}>Cabañas</Link>
                    <Link to="/#ubicacion" className="block py-2 text-gray-700 hover:text-teal-700 font-medium" onClick={() => setMenuOpen(false)}>Ubicación</Link>
                    <Link to="/#contacto" className="block py-2 text-gray-700 hover:text-teal-700 font-medium" onClick={() => setMenuOpen(false)}>Contacto</Link>
                    {isAdmin && (
                        <Link to="/admin" className="block py-2 text-gray-700 hover:text-teal-700 font-medium" onClick={() => setMenuOpen(false)}>ABM</Link>
                    )}
                    {!user && !token && (
                        <>
                            <Link to="/login" className="block py-2 text-gray-700 hover:text-teal-700 font-medium" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
                            <Link to="/register" className="block py-2 text-gray-700 hover:text-teal-700 font-medium" onClick={() => setMenuOpen(false)}>Registrarse</Link>
                        </>
                    )}
                    {(user || token) && (
                        <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="block py-2 text-gray-700 hover:text-teal-700 font-medium text-left w-full">Cerrar sesión</button>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
