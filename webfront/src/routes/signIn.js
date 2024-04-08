import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/authProvider.tsx';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../auth/constants';
import AppBarOut from '../assets/AppBarOut';

export default function SignIn() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedValues = {
            email: values.email.trim(),
            password: values.password.trim()
        };

        try {
            const response = await axios.post(`${API_URL}/api/auth/signIn`, trimmedValues);
            if (response.data.message === 'User logged in successfully') {
                // Guardar el token de acceso en el proveedor de autenticación
                auth.saveUser({ accessToken: response.data.token });
                // Navegar al panel de control
                navigate('/Dashboard');
            } else {
                alert('Error logging in');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in');
        }
    };

    // Si el usuario ya está autenticado, redirigir al panel de control
    if (auth.isAuthenticated) {
        return <Navigate to='/Dashboard' />;
    }

    return (
        <div>
            <AppBarOut />
            <form className='form' onSubmit={handleSubmit}>
                <h1>Inicia Sesión</h1>
                <label htmlFor='email'>Email</label>
                <input type="text" name='email' value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} />

                <label htmlFor='password'>Contraseña</label>
                <input type="password" name='password' value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} />

                <button type='submit'>Iniciar Sesión</button>
            </form>
        </div>
    );
}
