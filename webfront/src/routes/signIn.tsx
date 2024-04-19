import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/authProvider.tsx';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../auth/constants';
import AppBarOut from '../assets/AppBarOut';
import { AuthResponseError } from '../auth/types.tsx';


export default function SignIn() {
    /*const [values, setValues] = useState({
        email: '',
        password: ''
    });*/

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');


    const navigate = useNavigate();
    const auth = useAuth();

    /*const handleSubmit = async (e) => {
        e.preventDefault();

    const trimmedValues = {
            email: values.email.trim(),
            password: values.password.trim()
        };

        try {
            const response = await axios.post(`${API_URL}/auth/signIn`, trimmedValues);
            if (response.data.message === 'User logged in successfully') {
                // Navegar al panel de control
                window.location.href('/Dashboard');
            } else {
                alert('Error logging in');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in');
        }
    };*/

    if (auth.isAuthenticated) {
        return <Navigate to='/Dashboard' />;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/signIn`, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });

            if (response.ok) {
                console.log('User logged in successfully');
                const json = await response.json() as AuthResponse;
                
                if(json.body.accessToken && json.body.refreshToken) {
                    auth.saveEmail(json);
                    navigate('/Dashboard');
                }
                
            } else {
                console.log('Error logging in');
                const json = await response.json() as AuthResponseError;
                setError(json.body.error);
                return;
            }
        } catch (error) {
            console.log(error);
            const json = await response.json() as AuthResponseError;
            setError(json.body.error);
            return;
        }
    }

    return (
        <div>
            <AppBarOut />
            <form className='form' onSubmit={handleSubmit}>
                <h1>Inicia Sesión</h1>
                <label htmlFor='email'>Email</label>
                <input type="text" name='email' value={email} onChange={(e) => setEmail(e.target.value)} /*onChange={e => setValues({ ...values, email: e.target.value })}*/ />

                <label htmlFor='password'>Contraseña</label>
                <input type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} /*onChange={e => setValues({ ...values, password: e.target.value })}*/ />

                <button type='submit'>Iniciar Sesión</button>
            </form>
        </div>
    );
}
