import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import AppBar from '../assets/AppBar.tsx';
import SelectorRegister from '../assets/selectorRegister.js';
import { API_URL } from '../auth/constants';
import Alert from '@mui/material/Alert';

export default function MyProfile() {
    const [name, setName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [emailP, setEmailP] = React.useState('');
    const [deviceId, setDeviceId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    // Regular expression pattern to validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!name || !lastName || !emailP || !password || !deviceId) {
            setError('Todos los campos son requeridos');
            setSuccess(false); // Clear success state
            return; // Exit function early
        }
    
        if (!emailRegex.test(emailP)) {
            setError('Formato de correo electrónico inválido');
            setSuccess(false); // Clear success state
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/auth/patient`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, lastName, emailP, password, deviceId }),
            });
    
            if (response.ok) {
                setSuccess(true);
                setError('');
            } else {
                const json = await response.json();
                setError(json.error || 'Ha ocurrido un error desconocido');
                setSuccess(false);
            }
        } catch (error) {
            setError('Falló la conexión con el servidor');
            setSuccess(false);
        }
    };
    

    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <AppBar />
            <Stack
                spacing={4}
                sx={{
                    display: 'flex',
                    maxWidth: '800px',
                    mx: 'auto',
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                }}
            >
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}
                {success && (
                    <Alert severity="success">Usuario creado con éxito</Alert>
                )}
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Información Personal del Paciente</Typography>
                    </Box>
                    <Divider />
                    <Stack
                        direction="row"
                        spacing={3}
                        sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
                    >
                        <Stack spacing={2} sx={{ flexGrow: 1 }}>
                            <Stack spacing={1}>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl
                                    sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                >
                                    <Input size="sm" value={name} onChange={(e) => setName(e.target.value)} />
                                </FormControl>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl
                                    sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                >
                                    <Input size="sm" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </FormControl>
                                <FormLabel>Correo</FormLabel>
                                <FormControl
                                    sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                >
                                    <Input size="sm" type="email" value={emailP} onChange={(e) => setEmailP(e.target.value)} />
                                </FormControl>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl
                                    sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                >
                                    <Input size="sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </FormControl>
                                <FormLabel>ID</FormLabel>
                                <FormControl
                                    sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                >
                                    <SelectorRegister onSelectorChange={setDeviceId} />
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack
                        direction="column"
                        spacing={2}
                        sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}
                    >
                        <Stack direction="row" spacing={2}>
                            <Stack spacing={1} sx={{ flexGrow: 1 }}>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl
                                    sx={{
                                        display: {
                                            sm: 'flex-column',
                                            md: 'flex-row',
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <Input size="sm" value={name} onChange={(e) => setName(e.target.value)} />
                                </FormControl>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl
                                    sx={{
                                        display: {
                                            sm: 'flex-column',
                                            md: 'flex-row',
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <Input size="sm" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </FormControl>
                                <FormLabel>Correo</FormLabel>
                                <FormControl
                                    sx={{
                                        display: {
                                            sm: 'flex-column',
                                            md: 'flex-row',
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <Input size="sm" type="email" value={emailP} onChange={(e) => setEmailP(e.target.value)} />
                                </FormControl>
                                <FormLabel>ID</FormLabel>
                                <FormControl
                                    sx={{
                                        display: {
                                            sm: 'flex-column',
                                            md: 'flex-row',
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <Input size="sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </FormControl>
                                <FormLabel>Brazalete</FormLabel>
                                <FormControl
                                    sx={{
                                        display: {
                                            sm: 'flex-column',
                                            md: 'flex-row',
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <SelectorRegister onSelectorChange={setDeviceId} />
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Stack>
                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                            <Button size="sm" variant="solid" onClick={handleSubmit}>
                                Registrar
                            </Button>
                        </CardActions>
                    </CardOverflow>
                </Card>
            </Stack>
        </Box>
    );
}
