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
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AppBar from '../assets/AppBar';

export default function MyProfile() {
    return (
      <Box sx={{ flex: 1, width: '100%' }}>
        <AppBar/>
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
              <Typography level="title-md">Información Personal</Typography>
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
                    <Input size="sm" placeholder="Nombre" defaultValue='Orlando' />
                    <Input size="sm" placeholder="Apellido" defaultValue='Barboza' />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Correo</FormLabel>
                    <Input
                      size="sm"
                      type="email"
                      startDecorator={<EmailRoundedIcon />}
                      placeholder="email"
                      defaultValue="oalcala@uniorte.edu.co"
                      sx={{ flexGrow: 1 }}
                    />
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
                    <Input size="sm" placeholder="Nombre" defaultValue='Orlando' />
                    <Input size="sm" placeholder="Apellido" defaultValue='Barboza'/>
                  </FormControl>
                </Stack>
              </Stack>
              <FormControl sx={{ flexGrow: 1 }}>
                <FormLabel>Correo</FormLabel>
                <Input
                  size="sm"
                  type="email"
                  startDecorator={<EmailRoundedIcon />}
                  placeholder="email"
                  defaultValue="oalcala@uninorte.edu.co"
                  sx={{ flexGrow: 1 }}
                />
              </FormControl>
            </Stack>
            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                  Cancelar
                </Button>
                <Button size="sm" variant="solid">
                  Guardar
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Stack>
      </Box>
    );
  }
