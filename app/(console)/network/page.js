'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { selectName } from '@/store/FlickrUserSlice';
import EmptyState from '../components/EmptyState';

const noGraphTitle = 'No encontramos una red'
const noGraphMessage = 'Para ver la red de un usuario de Flickr, necesitas ingresar a la sección de “Fotos” y buscar un usuario.'

export default function ClippedDrawer() {
  const Graph = dynamic(() => import('./components/Graph'), { ssr: false })
  const username = useSelector(selectName)

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          { username ? 
            <Graph /> :
            <EmptyState title={noGraphTitle} message={noGraphMessage} />
          }
        </Grid>
      </Grid>
    </Box>
  );
}
