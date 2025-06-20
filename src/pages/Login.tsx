import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import './styles/Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/admin')
        } catch {
            alert('Error al iniciar sesión')
        }
    }

    const handleGoogle = async () => {
        try {
            await signInWithPopup(auth, provider)
            navigate('/admin')
        } catch {
            alert('Error al iniciar sesión')
        }
    }

    return (
        <div className="auth-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Ingresar</button>
            </form>
            <button className="google-btn" onClick={handleGoogle}>
                Iniciar con Google
            </button>
            <p className="link">
                ¿No tenés cuenta? <Link to="/register">Registrate</Link>
            </p>
        </div>
    )
}

export default Login
