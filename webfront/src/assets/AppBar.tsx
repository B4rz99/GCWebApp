import { useLocation, useNavigate } from 'react-router-dom';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/authProvider.tsx';
import Container from '@mui/material/Container';

const pages = ['Dashboard', 'Historial'];
const settings = ['Registro Paciente', 'Liberación', 'Cerrar Sesión'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Get current route

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    async function handleSignOut() {
        auth.signOut();
        navigate('/signIn');
    }

    const handleMenuItemClick = (setting) => () => {
        if (setting === 'Cerrar Sesión') {
            handleSignOut();
        } else if (setting === 'Registro Paciente') {
            navigate('/Profile');
        } else if (setting === 'Liberación') {
            navigate('/Release');
        }
        handleCloseUserMenu();
    };

    const handleMenuItemClick2 = (page) => () => {
        if (page === 'Dashboard') {
            navigate('/Dashboard');
        } else if (page === 'Historial') {
            navigate('/Historics');
        } else if (page === 'Perfil') {
            navigate('/Profile');
        } else if (page === 'Liberación') {
            navigate('/Release');
        }
        handleCloseUserMenu();
    };

    // Filter the pages array to exclude "Dashboard" and "Historial" based on current route
    const filteredPages = pages.filter(page => {
        if (location.pathname === '/Dashboard' && page === 'Dashboard') {
            return false;
        } else if (location.pathname === '/Historics' && page === 'Historial') {
            return false;
        }
        return true;
    });

    return (
        <AppBar position="static">
            <Container maxWidth="xxl">
                <Toolbar disableGutters>
                    <Link to="/Dashboard" style={{ textDecoration: 'none' }}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'Mulish',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'white',
                            }}
                        >
                            GeoCardio
                        </Typography>
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <Button
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            Menu
                        </Button>
                    </Box>

                    <Link to="/Dashboard" style={{ textDecoration: 'none' }}>
                    <Typography
                          variant="h5"
                          noWrap
                          href="#app-bar-with-responsive-menu"
                          sx={{
                              mr: 2,
                              display: { xs: 'flex', md: 'none' },
                              flexGrow: 1,
                              fontFamily: 'Mulish',
                              fontWeight: 700,
                              letterSpacing: '.1rem', // Change to camelCase
                              textDecoration: 'none', // Change to camelCase
                              color: 'white',
                          }}
                      >
                          GeoCardio
                      </Typography>
                    </Link>

                    {/* Conditionally render buttons based on filteredPages */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {filteredPages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleMenuItemClick2(page)}
                                sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'Mulish' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <Button
                                variant="outlined"
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0, color: 'white' }}
                            >
                                Menu
                            </Button>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleMenuItemClick(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
