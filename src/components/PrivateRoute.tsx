import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type {JSX} from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    let role = localStorage.getItem('role');

    if (!role && token) {
        try {
            role = JSON.parse(atob(token.split('.')[1])).role;
        } catch {
            role = null;
        }
    }

    if (!user && !token) {
        return <Navigate to="/" replace />;
    }

    if (role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;
