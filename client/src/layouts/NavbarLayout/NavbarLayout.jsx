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
import AccountCircle from '@mui/icons-material/AccountCircle';
import Evntya from '../../components/Evntya/Evntya';

export const NavbarLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isUser = true;
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
        <Evntya isUser={isUser} />
        
        </Typography>

        <Hidden smDown>
          <Box>
            <Button
              component={Link}
              to="/create-event"
              endIcon={<AddIcon/>}
              sx={{ textTransform: 'none', color: 'black', fontSize: '1rem' }}
            >
              Create an Event
            </Button>
            {' '}
            <Button
              component={Link}
              to="/my-events"
              sx={{ textTransform: 'none', color: 'black', fontSize: '1rem' }}
            >
              My Events
            </Button>
            {' '}
            <Button
              component={Link}
              to="/bookings"
              sx={{ textTransform: 'none', color: 'black', fontSize: '1rem' }}
            >
              My Bookings
            </Button>
            {' '}
            <Button
              component={Link}
              to="/profile"
              endIcon={<AccountCircle fontSize="large"/>}
              sx={{ textTransform: 'none', color: 'black', fontSize: '1rem' }}
            >
              Profile
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
                to="/create-event"
                sx={{ textDecoration: 'none', color: 'black', fontSize: '1rem' }}
              >
                Create an Event
              </Typography>
            </MenuItem>
            <MenuItem>
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
                to="/bookings"
                sx={{ textDecoration: 'none', color: 'black', fontSize: '1rem' }}
              >
                My Bookings
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
            </MenuItem>
          </Menu>
        </Hidden>
      </Toolbar>
    </AppBar>
    <Outlet/>
    </>
  );
};
