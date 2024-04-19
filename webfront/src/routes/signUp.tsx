import AppBarOut from '../assets/AppBarOut';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios using ES6 import syntax
import React from 'react';
import { useAuth } from '../auth/authProvider.tsx';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../auth/constants';

export default function SignUp() {

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const navigate = useNavigate();
    const auth = useAuth();

    if(auth.isAuthenticated) {
        return <Navigate to='/Dashboard' />;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/signUp`, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, lastName, email, password})
            });

            if (response.ok) {
                console.log('User created successfully');
                navigate('/signIn');
            } else {
                console.log('Error creating user');
            }
        } catch (error) {
            console.log(error);
            const json = await response.json() as AuthResponseError;
            setError(json.body.error);
            return;
        }
    }
    
    /*const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedValues = {
            name: values.name.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            password: values.password.trim()
        };
        
        
        axios.post(`${API_URL}/auth/signUp`, trimmedValues)
        .then(res => {
            if (res.data.message === 'User created successfully') {
                navigate('/signIn');
            } else {
                alert('Error creating user');
            }
        })
        .catch(err => { // Use .catch() for error handling
            console.log(err);
        });
    }*/

    

    return (
        <div>
            <AppBarOut />
            <form className='form' onSubmit={handleSubmit}>
                <h1>Regístrate</h1>
                
                <label htmlFor='name'>Nombre</label>
                <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}/*onChange={e => setValues({...values, name: e.target.value})}*//>

                <label htmlFor='lastName'>Apellido</label>
                <input type="text" name='lastName'  value={lastName} onChange={(e) => setLastName(e.target.value)} /*onChange={e => setValues({...values, lastName: e.target.value})}*//>

                <label htmlFor='email'>Email</label>
                <input type="text" name='email'  value={email} onChange={(e) => setEmail(e.target.value)}/*onChange={e => setValues({...values, email: e.target.value})}*//>

                <label htmlFor='password'>Contraseña</label>
                <input type="password" name='password'  value={password} onChange={(e) => setPassword(e.target.value)}/*onChange={e => setValues({...values, password: e.target.value})}*//>

                <button type='submit'>Registrarse</button>
            </form>
        </div>
    );
}
