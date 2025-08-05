import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';

function PrivateRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem('token');
    let role = localStorage.getItem('role');

    if (!role && token) {
        try {
            role = JSON.parse(atob(token.split('.')[1])).r;
        } catch {
            role = null;
        }
    }

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;
