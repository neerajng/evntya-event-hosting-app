import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const users = [
  { id: 1, name: 'Can Handle Users' },
  { id: 2, name: 'Can handle Events' },
  { id: 3, name: 'Can Hanadle Tickets' },
];

export const AdminDashboard = () => {
  return (
    <div>
      <Typography variant="h3">Admin Dashboard</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
