import { useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import './styles/Login.css'

const API_URL = import.meta.env.VITE_API_BASE_URL

function Login() {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, password })
            })
            if (!res.ok) throw new Error('Error')
            const data = await res.json()
            localStorage.setItem('token', data.token)
            let role = 'CLIENT'
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]))
                role = payload.r
                localStorage.setItem('role', role)
            } catch {
                localStorage.removeItem('role')
            }
            navigate(role === 'ADMIN' ? '/admin' : '/')
        } catch {
            alert('Error al iniciar sesión')
        }
    }

    const handleGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const email = result.user.email
            if (!email) {
                alert('No se pudo obtener el email de Google')
                await signOut(auth)
                return
            }

            const idToken = await result.user.getIdToken()
            const loginRes = await fetch(`${API_URL}/auth/login-google-web`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            })

            if (loginRes.ok) {
                const data = await loginRes.json()
                localStorage.setItem('token', data.token)
                let role = 'CLIENT'
                try {
                    const payload = JSON.parse(atob(data.token.split('.')[1]))
                    role = payload.r
                    localStorage.setItem('role', role)
                } catch {
                    localStorage.removeItem('role')
                }
                navigate(role === 'ADMIN' ? '/admin' : '/')
            } else {
                await signOut(auth)
                alert('Error al iniciar sesión')
            }
        } catch {
            await signOut(auth)
            alert('Error al iniciar sesión')
        }
    }

    return (
        <div className="auth-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
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
