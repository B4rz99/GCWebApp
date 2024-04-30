import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AppBar from '../assets/AppBar.tsx';
import SelectorRegister from '../assets/selectorRegister.js';
import { API_URL } from '../auth/constants';


export default function MyProfile() {
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [emailP, setEmailP] = React.useState('');
  const [deviceId, setDeviceId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
          const response = await fetch(`${API_URL}/auth/patient`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, lastName, emailP, password, deviceId }),
          });

          if (response.ok) {
              // User created successfully
              setSuccess('Patient user created successfully.');
              setError('');
              // Clear form fields
              setName('');
              setLastName('');
              setEmailP('');
              setPassword('');
              setDeviceId('');
          } else {
              const json = await response.json();
              setError(`Error creating user: ${json.message}`);
              setSuccess('');
          }
      } catch (error) {
          setError(`An error occurred: ${error.message}`);
          setSuccess('');
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
                  <CardContent>
                      <Typography variant="h6" gutterBottom>
                          Información Personal del Paciente
                      </Typography>
                      <Divider />
                      {/* Form and input elements */}
                  </CardContent>

                  {/* Alerts */}
                  {success && (
                      <Alert severity="success">{success}</Alert>
                  )}
                  {error && (
                      <Alert severity="error">{error}</Alert>
                  )}

                  {/* Form and submit button */}
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button variant="contained" onClick={handleSubmit}>
                          Registrar
                      </Button>
                  </CardActions>
              </Card>
          </Stack>
      </Box>
  );
}
