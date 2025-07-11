import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import './styles/Login.css'

function Login() {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('https://ymucpmxkp3.us-east-1.awsapprunner.com/auth/login', {
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
                role = payload.role
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
            const name = result.user.displayName || result.user.email

            // Try to log in to the backend with the Google account
            let loginRes = await fetch('https://ymucpmxkp3.us-east-1.awsapprunner.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: name, password: 'from-google' })
            })

            if (!loginRes.ok) {
                // If the user does not exist, create it and try again
                await fetch('https://ymucpmxkp3.us-east-1.awsapprunner.com/users', {
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
                loginRes = await fetch('https://ymucpmxkp3.us-east-1.awsapprunner.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: name, password: 'from-google' })
                })
            }

            if (loginRes.ok) {
                const data = await loginRes.json()
                localStorage.setItem('token', data.token)
                let role = 'CLIENT'
                try {
                    const payload = JSON.parse(atob(data.token.split('.')[1]))
                    role = payload.role
                    localStorage.setItem('role', role)
                } catch {
                    localStorage.removeItem('role')
                }
                navigate(role === 'ADMIN' ? '/admin' : '/')
            } else {
                localStorage.setItem('role', 'CLIENT')
                navigate('/')
            }
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
