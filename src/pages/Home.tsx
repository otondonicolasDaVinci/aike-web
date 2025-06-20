import { useAuth } from '../context/AuthContext';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import 'styles/Home.css';

function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate('/admin');
        } catch {
            alert('Error al iniciar sesión');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        window.location.reload();
    };

    return (
        <>
            <header className="home-header">
                <h2 className="home-title">Aike</h2>
                <nav className="home-nav">
                    <Link to="/cabins">Cabañas</Link>
                    <Link to="/about">Nosotros</Link>
                    <Link to="/contact">Contacto</Link>
                    <Link to="/app">App</Link>
                </nav>
                {!user ? (
                    <button className="home-button" onClick={handleLogin}>Iniciar sesión</button>
                ) : (
                    <button className="home-button" onClick={handleLogout}>Cerrar sesión</button>
                )}
            </header>

            <main className="home-main">
                <section className="home-landing">
                    <div className="home-landing-content">
                        <h1>Bienvenido a Aike</h1>
                        <p>Tu experiencia inteligente en la Patagonia</p>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <p>© 2025 Aike · Proyecto de tesis · Da Vinci</p>
            </footer>
        </>
    );
}

export default Home;
