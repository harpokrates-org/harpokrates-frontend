'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import ImageGallery from './components/ImageGallery';
import UserSearcher from './components/UserSearcher';
import { Grid } from '@mui/material';

export default function ClippedDrawer() {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <UserSearcher />
        </Grid>
        <Grid item>
          <ImageGallery />
        </Grid>
      </Grid>
    </Box>
  );
}
