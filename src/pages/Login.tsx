import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './styles/Login.css'

interface GoogleAccounts {
    accounts: {
        id: {
            initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
            renderButton: (element: HTMLElement | null, options: { theme: string; size: string }) => void
        }
    }
}

declare global {
    interface Window {
        google: GoogleAccounts | undefined
    }
}

const API_URL = import.meta.env.VITE_API_BASE_URL

function Login() {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const handleCredentialResponse = async (response: { credential: string }) => {
            const idToken = response.credential
            const loginRes = await fetch(`${API_URL}/auth/login-google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            })
            if (!loginRes.ok) {
                alert('Error en login con Google')
                return
            }
            const data = await loginRes.json()
            const rawToken: string = data.token
            const token = rawToken.startsWith('Bearer ') ? rawToken.slice(7) : rawToken
            localStorage.setItem('token', token)
            let role = 'CLIENT'
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                role = payload.r
                localStorage.setItem('role', role)
            } catch {
                localStorage.removeItem('role')
            }
            navigate(role === 'ADMIN' ? '/admin' : '/')
        }

        window.google?.accounts.id.initialize({
            client_id: '959565422604-0dvq3jihm4as00tukaut3i60j2ssm25o.apps.googleusercontent.com',
            callback: handleCredentialResponse
        })
        window.google?.accounts.id.renderButton(
            document.getElementById('google-login-button'),
            { theme: 'outline', size: 'large' }
        )
    }, [navigate])

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
            const rawToken: string = data.token
            const token = rawToken.startsWith('Bearer ') ? rawToken.slice(7) : rawToken
            localStorage.setItem('token', token)
            let role = 'CLIENT'
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
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
            <div id="google-login-button" className="google-btn" />
            <p className="link">
                ¿No tenés cuenta? <Link to="/register">Registrate</Link>
            </p>
        </div>
    )
}

export default Login
