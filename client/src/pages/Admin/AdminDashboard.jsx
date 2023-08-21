import React from 'react';
import { Card, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

const users = [
  { id: 1, name: 'Can Handle Users' },
  { id: 2, name: 'Can Handle Events' },
  { id: 3, name: 'Can Handle Tickets' },
];

export const AdminDashboard = () => {
  return (
    <Grid container >      
    <Grid item xs={12}>
    <Card sx={{ borderRadius: 5 ,p:5, m:2}} >
    <Typography variant="h4" my={2}>Admin Dashboard</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
      </Card>
      </Grid>
      </Grid>

    
  );
};
