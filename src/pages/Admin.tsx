import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

function Admin() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        if (auth.currentUser) {
            await signOut(auth)
        }
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        navigate('/')
    }

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Admin Dashboard</h1>
            <button
                onClick={handleLogout}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#8B5E3C',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Logout
            </button>
        </div>
    )
}

export default Admin
