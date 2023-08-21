import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { SignOut } from '../../components/SignOut/SignOut'; 
import toast, { Toaster } from 'react-hot-toast';

export const AdminProfile = () => {
  const [user, setUser] = useState({});
  const [eventCount, setEventCount] = useState(0);

  const toastStyle = {
    padding: '10px',
    fontSize: '14px',
  };
  
  useEffect(() => {    
      axiosInstance
        .get('/admin-profile')
        .then((response) => {
          setUser(response.data);
          setEventCount(response.data.eventCount);
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
  <Card sx={{ borderRadius: 5}} >
  <CardHeader
  avatar={<Avatar sx={{ width: 100, height: 100 }} alt={user.name} src="{user.picture}" />}
  title={<Typography variant="h4">{user.firstName} {user.lastName}</Typography>}
  subheader={
    <Box>
      <Typography variant="subtitle1">{user.email}</Typography>
      <Typography variant="subtitle2">Admin</Typography>
    </Box>
  }
/>
    <CardActions sx={{ justifyContent: 'center' }}>
      <Button variant="contained">Update</Button>
    </CardActions>
  </Card>
</Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 5}}>
            <CardContent>
            <Typography variant="h6">
  Hey there! I'm {user.firstName} {user.lastName}, and as an admin, I have the privilege of overseeing and managing the captivating world of event hosting and participation. I can handle user accounts and manage user-created events to ensure a smooth and seamless experience for everyone.
</Typography>
            </CardContent>
          </Card>
        </Grid>   

        <Grid item xs={12}>
        <Card sx={{ width: { xs: 100, sm: 150 }, height: { xs: 50, sm: 75 }, borderRadius: 5} }>
    <CardHeader
      title={<Typography variant="h6">Sign Out</Typography>}
      action={<SignOut />}
    />
  </Card>
</Grid>


      </Grid>     
      <Toaster
        toastOptions={{
          style: toastStyle,
        }}
        position="top-right"
      />
    </Box>
  )};