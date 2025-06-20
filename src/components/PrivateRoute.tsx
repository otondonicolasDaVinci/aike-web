import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type {JSX} from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;
