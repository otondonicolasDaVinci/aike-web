import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type {JSX} from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth()
    const isAdmin = user?.email === 'otondonicolas@gmail.com'

    if (!user || !isAdmin) {
        return <Navigate to="/" />
    }

    return children
}

export default PrivateRoute
