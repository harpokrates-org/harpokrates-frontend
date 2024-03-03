'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import dynamic from 'next/dynamic';

export default function ClippedDrawer() {
  const Graph = dynamic(() => import('./components/Graph'), { ssr: false })
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <Graph />
        </Grid>
      </Grid>
    </Box>
  );
}
