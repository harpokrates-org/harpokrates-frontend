'use client'
import { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { close } from '@/store/SearchAlertSlice';

export default function SearchAlert() {
  let found = useSelector((store) => store.flickrUser.found)
  let open = useSelector((store) => store.searchAlert.open)
  const dispatch = useDispatch()

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={found !== null && open}>
        <Alert
          severity={found ? 'success' : 'error'}
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                dispatch(close())
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {found ? 'Usuario encontrado!' : 'No hemos encontramos el usuario ingresado.'}
        </Alert>
      </Collapse>
    </Box>
  );
}