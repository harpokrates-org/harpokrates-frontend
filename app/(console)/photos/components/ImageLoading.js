'use client';
import {
  Box,
  CircularProgress,
} from '@mui/material';

const height = 200
const width = 200

export default function ImageLoading() {
  return (
    <Box sx={{ height, width, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
      <CircularProgress  /> 
    </Box>
  );
}
