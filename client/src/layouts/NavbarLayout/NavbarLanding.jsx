import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AddIcon from '@mui/icons-material/Add';
import Person3Icon from '@mui/icons-material/Person3';
import Evntya from '../../components/Evntya/Evntya';

export const NavbarLanding = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <AppBar position="static" component="nav" sx={{ pb: 2,bgcolor: 'brandYellow.main', color: 'black' }}>
      <Toolbar>
        <Typography variant="h8" component="div" sx={{ flexGrow: 1 }}>
          <Evntya />
        </Typography>

        <Hidden smDown>
          <Box>
            {' '}
            <Button
              component={Link}
              to="/signin"
              startIcon={<Person3Icon fontSize="large"/>}
              sx={{ textTransform: 'none', color: 'black', fontSize: '1rem' }}
            >
              Sign In
            </Button>
          </Box>
        </Hidden>

        <Hidden mdUp>
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
            <MenuRoundedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            <MenuItem>
              <Typography
                component={Link}
                to="/signin"
                sx={{ textDecoration: 'none', color: 'black', fontSize: '1rem' }}
              >
                Sign In
              </Typography>
            </MenuItem>
            {/* <MenuItem>
              <Typography
                component={Link}
                to="/my-events"
                sx={{ textDecoration: 'none', color: 'black', fontSize: '1rem' }}
              >
                My Events
              </Typography>
            </MenuItem>
            <MenuItem>
              <Typography
                component={Link}
                to="/profile"
                sx={{ textDecoration: 'none', color: 'black', fontSize: '1rem' }}
              >
                Profile
              </Typography>
            </MenuItem> */}
          </Menu>
        </Hidden>
        
      </Toolbar>
    </AppBar>
    <Outlet/>
    </>
  );
};
