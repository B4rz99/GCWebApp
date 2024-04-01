import AppBarOut from '../assets/AppBarOut';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios using ES6 import syntax
import React from 'react';
import { useAuth } from '../auth/authProvider';
import { Navigate } from 'react-router-dom';


export default function SignUp() {
    const [values, setValues] = useState({
        name: '',
        lastName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const auth = useAuth();

    if(auth.isAuthenticated) {
        return <Navigate to='/Dashboard' />;
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/signUp', values)
        .then(res => {
            if (res.data.message === 'User created') {
                navigate('/signIn');
            } else {
                alert('Error creating user');
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
                <h1>Regístrate</h1>

                <label htmlFor='name'>Nombre</label>
                <input type="text" name='name'  onChange={e => setValues({...values, name: e.target.value})}/>

                <label htmlFor='lastName'>Apellido</label>
                <input type="text" name='lastName'  onChange={e => setValues({...values, lastName: e.target.value})}/>

                <label htmlFor='email'>Email</label>
                <input type="text" name='email'  onChange={e => setValues({...values, email: e.target.value})}/>

                <label htmlFor='password'>Contraseña</label>
                <input type="password" name='password'  onChange={e => setValues({...values, password: e.target.value})}/>

                <button type='submit'>Registrarse</button>
            </form>
        </div>
    );
}
