import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UserSearcher from '../(console)/photos/components/UserSearcher';


export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }} variant="dense">
          <Button color="inherit" href="/">Harpokrates</Button>
          <Button color="inherit" href="/register">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}