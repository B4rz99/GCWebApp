import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/authProvider";

export default function ProtectedRoute() {
    const auth = useAuth();

    return auth.isAuthenticated ? <Outlet /> : <Navigate to="/SignIn" />;
}
