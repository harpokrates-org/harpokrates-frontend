'use client'
import { selectName } from '@/store/FlickrUserSlice';
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import EmptyState from '../components/EmptyState';
import ImageGallery from './components/ImageGallery';
import PhotosTopBar, { barHeight, margin, titleHeight } from './components/PhotosTopBar';
import UserProfile from './components/UserProfile';
import TopFavorites from './components/TopFavorites';
import { selectFilters } from '@/store/PhotosFilterSlice';

const noPhotosTitle = 'Busca un usuario'
const noPhotosMessage = 'Para analizar las imágines subidas por un usuario, necesitas ingresar su nombre en el buscador superior.'

export default function ClippedDrawer() {
  const topMargin = barHeight - titleHeight - margin
  const username = useSelector(selectName)
  const filters = useSelector(selectFilters);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Fotos</Typography>
          <PhotosTopBar />
          { username ? 
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: 3/4 }}>
                  <UserProfile />
                  <ImageGallery />
                </Box>
                { filters.modelName != 'Sin Modelo' &&
                  <TopFavorites />
                }
              </Box> :
            <EmptyState title={noPhotosTitle} message={noPhotosMessage} topMargin={topMargin} />
          }
        </Grid>
      </Grid>
    </Box> 
  );
}
