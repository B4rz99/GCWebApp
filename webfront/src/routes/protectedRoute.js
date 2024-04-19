import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/authProvider.tsx';

export default function ProtectedRoute() {
    const auth = useAuth();

    return localStorage.getItem('token') ? <Outlet /> : <Navigate to="/SignIn" />;

}