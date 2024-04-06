'use client';
import Image from 'next/image';
import {
  Box,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

const favoritesCountWidth = 100
const favoritesCountHeight = 25

export default function ImageInfo({ photo, favorites }) {
  const getFavoritosCount = () => {
    if (favorites.length === 10) return '+10'
    return favorites.length
  }

  return (
    <DialogContent>
      <DialogTitle fontSize={'30px'} maxWidth={photo.width + favoritesCountWidth}>{photo.title}</DialogTitle>
      <Box display='flex'>
        <Image
          src={photo.source}
          alt={photo.title}
          width={photo.width}
          height={photo.height}
          priority={true}
          style={{ maxWidth: photo.width, marginRight: '10px' }}
        />
        <Box>
          <Typography variant='h6' color={'primary'}> {getFavoritosCount()} Favoritos </Typography>
          <List 
            sx={{
              maxHeight: photo.height - favoritesCountHeight,
              overflowY: 'auto',
              maxWidth: '400px',
            }}
          >
            { favorites.map((user) => (
              <ListItem key={user} disablePadding={true}>
                <ListItemText
                  primary={user}
                  key={user}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </DialogContent>
  );
}
