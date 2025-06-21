import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import './styles/Login.css'

function Login() {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('https://aike-api.onrender.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, password })
            })
            if (!res.ok) throw new Error('Error')
            const data = await res.json()
            localStorage.setItem('token', data.token)
            navigate('/admin')
        } catch {
            alert('Error al iniciar sesión')
        }
    }

    const handleGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const name = result.user.displayName || result.user.email
            await setDoc(
                doc(db, 'users', result.user.uid),
                {
                    uid: result.user.uid,
                    email: result.user.email,
                    username: name
                },
                { merge: true }
            )
            await fetch('https://aike-api.onrender.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email: result.user.email,
                    dni: '',
                    password: 'from-google',
                    role: { id: 2 }
                })
            })
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
