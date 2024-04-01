import AppBarOut from '../assets/AppBarOut';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios using ES6 import syntax
import React from 'react';
import { useAuth } from '../auth/authProvider';
import { Navigate } from 'react-router-dom';

export default function SignIn() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const auth = useAuth();

    if(auth.isAuthenticated) {
        return <Navigate to='/Dashboard' />;
    }

    
    axios.defaults.withCredentials = true;
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/signIn', values)
        .then(res => {
            if (res.data.message === 'User logged in') {
                navigate('/Dashboard');
            } else {
                alert('Error logging in');
            }
        })
        .catch(err => { // Use .catch() for error handling
            console.log(err);
        });
    }
    return (
        <div>
            <AppBarOut />
            <form className='form' onSubmit={handleSubmit}>

            <h1>Inicia Sesión</h1>
            <label htmlFor='email'>Email</label>
            <input type="text" name='email'  onChange={e => setValues({...values, email: e.target.value})}/>

            <label htmlFor='password'>Contraseña</label>
            <input type="password" name='password' onChange={e => setValues({...values, password: e.target.value})}/>

            <button type='submit'>Iniciar Sesión</button>
            </form>
        </div>
    );
}