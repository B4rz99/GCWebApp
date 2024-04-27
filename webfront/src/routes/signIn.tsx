import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/authProvider.tsx';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../auth/constants';
import AppBarOut from '../assets/AppBarOut';
import { AuthResponseError } from '../auth/types.tsx';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';


export default function SignIn() {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');


    const navigate = useNavigate();
    const auth = useAuth();


    if (localStorage.getItem('token')) {
        return <Navigate to='/Dashboard' />;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/auth/signIn`, {
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
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Iniciar Sesión
              </Typography>
              <Box 
              component="form"
              noValidate
              onSubmit={handleSubmit} 
              noValidate sx={{ mt: 1 }}>
                <TextField
                    label="Correo Electrónico"
                    margin="normal"
                    required
                    fullWidth
                    type="text" 
                    name='email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                    size="small"
                />
                <TextField
                    label="Contraseña"
                    margin="normal"
                    required
                    fullWidth
                    type="password" 
                    name='password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="password"
                    autoFocus
                    size="small"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Iniciar Sesión
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href='/signUp' variant="body2">
                      Regístrate
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            </Container>
        </div>
    );
}
