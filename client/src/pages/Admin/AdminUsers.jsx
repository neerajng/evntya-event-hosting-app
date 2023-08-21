import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import { Avatar, Grid, Table, TableBody, TableCell, TableHead, 
  TableContainer,TableRow, Typography, Button, Paper, Card } from '@mui/material';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend and update the state
    axiosInstance
      .get('/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleBlockClick = (user) => {
      const userId = user._id
    // Update the blocked status of the user in the backend
    axiosInstance
      .post(`/users/${userId}/block`)
      .then(() => {
        // Update the local state to reflect the change
        setUsers((users) =>
          users.map((u) => (u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u))
        );
      })
      .catch((error) => console.log(error));
  };

  return (
<Grid container >      
<Grid item xs={12}>
<Card sx={{ borderRadius: 5 ,p:5, m:2}} >
<Typography variant="h4" my={2}>Manage Users</Typography>
<TableContainer component={Paper}>
      <Table sx={{ minWidth: 450 }}>

<TableHead>
  <TableRow>
    <TableCell>
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>Full Name</Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>Email</Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>Picture</Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>Action</Typography>
    </TableCell>
  </TableRow>
</TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
              <TableCell>
                <Typography variant="body1">{user.firstName} {user.lastName}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{user.email}</Typography>
              </TableCell>
              <TableCell>
                <Avatar src={user.picture} />
              </TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => handleBlockClick(user)}>
                    {user.isBlocked ? 'Unblock' : 'Block'}
                </Button>
              </TableCell>
            </TableRow>
            
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        </Card>
      </Grid>

    </Grid>
  );
};
