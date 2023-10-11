import React, { useState, useEffect } from 'react';
import { Link, Outlet,useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig';
import toast, { Toaster } from 'react-hot-toast';
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
  Chip,
  Avatar,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Evntya from '../../components/Evntya/Evntya';

export const AdminLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [shadow, setShadow] = useState(0)
  const [profile, setProfile] = useState(null)
  const isAdmin = true;
  const navigate = useNavigate()

  useEffect(() => {    
    axiosInstance
    .get('/api/profile')
        .then((response) => {
          setProfile(response.data);
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error)
          toast.error(error.response.data.message);
        });
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    navigate('/admin/profile');
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setShadow(4);
      } else {
        setShadow(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <>
    <AppBar position="sticky" elevation={shadow} component="nav" sx={{ bgcolor: 'primary.main', color: 'black' }}>
      <Toolbar>
        <Typography variant="h8" component="div" sx={{ flexGrow: 1 }}>
        <Evntya isAdmin={isAdmin} />
        </Typography>

        <Hidden smDown>
          <Box>
            <Button
              component={Link}
              to="/admin/users"
              sx={{ textTransform: 'none', color: 'white', fontSize: '1rem' }}
            >
              Manage Users
            </Button>
            {' '}
            <Button
              component={Link}
              to="/admin/events"
              sx={{ textTransform: 'none', color: 'white', fontSize: '1rem' }}
            >
              Manage Events
            </Button>
            {' '}
            {profile ? (
                  <Chip
                    avatar={<Avatar alt="profile" src={profile.picture} />}
                    label={profile.firstName}
                    sx={{ textTransform: 'none', color: 'white', fontSize: '1rem', fontWeight: 'medium' }}
                    onClick={handleClick}
                  />
                ) : (
                  <Chip
                    avatar={<Avatar />}
                    label="Loading..."
                    sx={{ textTransform: 'none', color: 'black', fontSize: '1rem', fontWeight: 'medium' }}
                  />
                )}
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
            {profile ? (
                  <Chip
                    avatar={<Avatar alt="profile" src={profile.picture} />}
                    label={profile.firstName}
                    sx={{ textTransform: 'none', color: 'black', fontSize: '1rem', fontWeight: 'medium' }}
                    onClick={handleClick}
                  />
                ) : (
                  <Chip
                    avatar={<Avatar />}
                    label="Loading..."
                    sx={{ textTransform: 'none', color: 'black', fontSize: '1rem', fontWeight: 'medium' }}
                  />
                )}
            </MenuItem>
          </Menu>
        </Hidden>
      </Toolbar>
    </AppBar>
    <Outlet/>
    </>
  );
};
