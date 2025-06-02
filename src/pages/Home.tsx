import { auth, provider } from '../firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import 'styles/Home.css'

function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider)
            navigate('/admin')
        } catch {
            alert('Error al iniciar sesión')
        }
    }

    const handleLogout = async () => {
        await signOut(auth)
        window.location.reload()
    }

    return (
        <>
            <header className="top-nav">
                <h2 className="brand">Aike</h2>
                <div className="nav-links">
                    <Link to="/cabins">Cabañas</Link>
                    <Link to="/about">Nosotros</Link>
                    <Link to="/prices">Precios</Link>
                    <Link to="/contact">Contacto</Link>
                    <Link to="/app">App</Link>
                </div>
                {!user && <button onClick={handleLogin}>Iniciar sesión</button>}
                {user && <button onClick={handleLogout}>Cerrar sesión</button>}
            </header>

            <div className="filters-bar">
                <div className="filters-container">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Entrada</label>
                        <input type="date" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Salida</label>
                        <input type="date" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Huéspedes</label>
                        <input type="number" min="1" defaultValue={2} />
                    </div>

                    <button className="search-button">Buscar</button>
                </div>
            </div>

            <main>
                <section className="landing">
                    <div className="landing-content">
                        <h1>Aike</h1>
                        <p>Viví la Patagonia de forma inteligente</p>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p>© 2025 Aike · Proyecto final de carrera · Escuela Da Vinci</p>
            </footer>
        </>
    )
}

export default Home
