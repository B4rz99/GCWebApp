import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';


export default function Home() {
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3001/signIn')
        .then(res => {
            if (res.data.message === 'User logged in') {
                setAuth(true);
                setName(res.data.name);
            } else {
                setAuth(false);
            }
        })
        .catch(err => {
            console.log(err);
        });
    });

    const handleLogout = () => {
        axios.get('http://localhost:3001/api/logout')
        .then(res => {
          window.location.reload(true);
        }).catch(err => console.log(err));
      }


    return (
        <div>
            <h1>Inicio</h1>
            {
                <>
                    {auth ? (
                        <>
                            <h2>Bienvenido {name}</h2>
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </>
                    ) : (
                        <>
                            <h2>{message}</h2>
                            <h2>Regístrate o inicia sesión</h2>
                            <Link to="/signUp">
                                <button>Regístrate</button>
                            </Link>
                            <Link to="/signIn">
                                <button>Inicia Sesión</button>
                            </Link>
                        </>
                    )}
                </>
            }
        </div>
    )
}