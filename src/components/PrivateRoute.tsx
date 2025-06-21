import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type {JSX} from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    if (!user && !token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;
