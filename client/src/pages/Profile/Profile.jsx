import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { SignOut } from '../../components/SignOut/SignOut'; 
import toast, { Toaster } from 'react-hot-toast';
import { UpdateProfile } from './UpdateProfile';



export const Profile = () => {
  const [user, setUser] = useState({});
  const [eventCount, setEventCount] = useState(0);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const toastStyle = {
    padding: '10px',
    fontSize: '14px',
  };
  
  useEffect(() => {    
    axiosInstance
    .get('/api/profile')
        .then((response) => {
          setUser(response.data);
          setEventCount(response.data.eventCount);
        })
        .catch((error) => {
          console.log(error)
          toast.error(error.response.data.message);
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
      avatar={<Avatar sx={{ width: 100, height: 100 }} alt={user.name} src={user.picture} />}
      title={<Typography variant="h4">{user.firstName} {user.lastName}</Typography>}
      subheader={<Typography variant="h8">{user.email}</Typography>}
    />
    <CardActions sx={{ justifyContent: 'center' }}>   
          {!showUpdateForm && (
            <Button onClick={() => setShowUpdateForm(true)} variant="contained" color="info">Update</Button>
          )}
          {showUpdateForm && (
            <>
              <UpdateProfile user={user} setUser={setUser} setShowUpdateForm={setShowUpdateForm} />
            </>
          )}        
    </CardActions>
  </Card>
</Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 5}}>
            <CardContent >
              <Typography variant="h6">Created Events: {eventCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 5}}>
            <CardContent>
              <Typography variant="h6" >Hey there! I'm {user.firstName} {user.lastName}, and I have an undying passion for the captivating world of event hosting and participation. With a heart full of excitement and a spirit of adventure, I find immense joy in both curating memorable events and actively taking part in them.</Typography>
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
