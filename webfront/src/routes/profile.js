import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import AppBar from '../assets/AppBar.tsx';
import SelectorRelease from '../assets/selectorRelease.js';
import { API_URL } from '../auth/constants';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function MyProfile() {
    const [deviceId, setDeviceId] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/auth/bracelet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deviceId }),
            });

            if (response.ok) {
                setSuccessMessage('Bracelet released successfully.');
                setErrorMessage(''); // Clear error message if it was previously set
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'Error releasing bracelet.');
                setSuccessMessage(''); // Clear success message if it was previously set
            }
        } catch (error) {
            setErrorMessage('Error releasing bracelet.');
            setSuccessMessage('');
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
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Liberación de Brazaletes</Typography>
                    </Box>
                    <Divider />
                    <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}>
                        <Stack spacing={2} sx={{ flexGrow: 1 }}>
                            <Stack spacing={1}>
                                <FormControl sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}>
                                    <SelectorRelease onSelectorChange={setDeviceId} />
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction="column" spacing={2} sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}>
                        <Stack direction="row" spacing={2}>
                            <Stack spacing={1} sx={{ flexGrow: 1 }}>
                                <FormControl sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}>
                                    <SelectorRelease onSelectorChange={setDeviceId} />
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Stack>
                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                            <Button size="sm" variant="solid" onClick={handleSubmit}>
                                Liberar
                            </Button>
                        </CardActions>
                    </CardOverflow>
                </Card>
            </Stack>

            {/* MUI Alerts for Success and Error */}
            {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    <AlertTitle>Success</AlertTitle>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}
        </Box>
    );
}
