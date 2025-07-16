import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import './styles/Login.css'

const API_URL = import.meta.env.VITE_API_BASE_URL

function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [dni, setDni] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: username,
                    email,
                    dni,
                    password,
                    role: { id: 2 }
                })
            })
            navigate('/')
        } catch {
            alert('Error al registrarse')
        }
    }

    const handleGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const name = result.user.displayName || username
            await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email: result.user.email,
                    dni,
                    password: 'from-google',
                    role: { id: 2 }
                })
            })
            navigate('/')
        } catch {
            alert('Error al iniciar sesión con Google')
        }
    }

    return (
        <div className="auth-container">
            <h2>Registrarse</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Registrarse</button>
            </form>
            <button className="google-btn" onClick={handleGoogle}>
                Registrarse con Google
            </button>
            <p className="link">
                ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
            </p>
        </div>
    )
}

export default Register
