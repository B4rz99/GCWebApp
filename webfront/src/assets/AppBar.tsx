import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../auth/constants';
import { useAuth } from '../auth/authProvider.tsx';
import { AuthResponseError } from '../auth/types.tsx';


const pages = ['Dashboard', 'Historial'];
const settings = ['Registro Paciente', 'Dashboard', 'Cerrar Sesión'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const auth = useAuth();

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
    } else if (setting === 'Dashboard') {
      navigate('/Dashboard');
    } else if (setting === 'Registro Paciente') {
      navigate('/Profile');
    }
    handleCloseUserMenu();
  };

  const handleMenuItemClick2 = (page) => () => {
    if (page === 'Dashboard') {
      navigate('/Dashboard');
    } else if (page === 'Historial') {
      navigate('/Historics');
    } 
    handleCloseUserMenu();
  };

  const navigate = useNavigate();

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
                color: 'white'
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
              <MenuIcon />
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleMenuItemClick2(page)}>
                  <Typography textAlign="center" sx={{ fontFamily:'Mulish' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Link to="/Dashboard" style={{ textDecoration: 'none'}}>
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
                letterSpacing: '.1rem',
                textDecoration: 'none',
                color: 'white'
              }}
            >
              GeoCardio
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleMenuItemClick2(page)}
                sx={{ my: 2, color: 'white', display: 'block', fontFamily:'Mulish' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <Button variant="outlined" onClick={handleOpenUserMenu} sx={{ p: 0, color: 'white'}}>
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