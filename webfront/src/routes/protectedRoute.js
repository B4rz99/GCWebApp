import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/authProvider.tsx";
import axios from 'axios';
import { API_URL } from '../auth/constants';

export default function ProtectedRoute() {
    const [auth, setAuth] = useState(false);

    axios.get(`${API_URL}/home`)
    .then(res => {
        if (res.data.message === 'User logged in'){
            setAuth(true)
        } else{
            setAuth(false)
        }
    }).catch(err => console.log(err));

    return auth ? <Outlet /> : <Navigate to="/SignIn" />;
}
