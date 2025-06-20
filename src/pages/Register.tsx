import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth'
import { auth, provider, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import './styles/Login.css'

function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password)
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: username })
            }
            await setDoc(doc(db, 'users', cred.user.uid), {
                uid: cred.user.uid,
                email: cred.user.email,
                username
            })
            navigate('/admin')
        } catch {
            alert('Error al registrarse')
        }
    }

    const handleGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            if (result.user.displayName) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    uid: result.user.uid,
                    email: result.user.email,
                    username: result.user.displayName
                })
            }
            navigate('/admin')
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
