'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import ImageGallery from './components/ImageGallery';
import { Grid, Typography } from '@mui/material';
import EmptyState from '../components/EmptyState';
import { useSelector } from 'react-redux';
import { selectName } from '@/store/FlickrUserSlice';
import UserProfile from './components/UserProfile';
import PhotosTopBar, { barHeight, margin, titleHeight } from './components/PhotosTopBar';

const noPhotosTitle = 'Busca un usuario'
const noPhotosMessage = 'Para analizar las imágines subidas por un usuario, necesitas ingresar su nombre en el buscador superior.'

export default function ClippedDrawer() {
  const username = useSelector(selectName)
  const topMargin = barHeight - titleHeight - margin

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Fotos</Typography>
          <PhotosTopBar />
          { username ? 
            <>
              <UserProfile />
              <ImageGallery />
            </> :
            <EmptyState title={noPhotosTitle} message={noPhotosMessage} topMargin={topMargin} />
          }
        </Grid>
      </Grid>
    </Box> 
  );
}
