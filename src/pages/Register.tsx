import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './styles/Login.css'

const API_URL = import.meta.env.VITE_API_BASE_URL

function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [dni, setDni] = useState('')
    const navigate = useNavigate()

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

    useEffect(() => {
        const handleCredentialResponse = async (response: { credential: string }) => {
            const idToken = response.credential
            const loginRes = await fetch(`${API_URL}/auth/login-google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            })
            if (!loginRes.ok) {
                alert('Error al iniciar sesión con Google')
                return
            }
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
        }

        window.google?.accounts.id.initialize({
            client_id: '959565422604-0dvq3jihm4as00tukaut3i60j2ssm25o.apps.googleusercontent.com',
            callback: handleCredentialResponse
        })
        window.google?.accounts.id.renderButton(
            document.getElementById('google-register-button'),
            { theme: 'outline', size: 'large' }
        )
    }, [navigate])

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
            <div id="google-register-button" className="google-btn" />
            <p className="link">
                ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
            </p>
        </div>
    )
}

export default Register
