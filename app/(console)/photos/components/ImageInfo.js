'use client';
import { getUserName } from '@/app/api/UserAPI';
import { userFound } from '@/store/FlickrUserSlice';
import {
  Box,
  DialogContent,
  DialogTitle,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const favoritesCountWidth = 100
const favoritesCountHeight = 25

export default function ImageInfo({ photo, favorites, onNameClick }) {
  const dispatch = useDispatch()

  const getFavoritosCount = () => {
    if (favorites.length === 10) return '+10'
    return favorites.length
  }

  const nameClickHandler = (event) => {
    const flickrUserName = event.target.innerText
    getUserName(flickrUserName)
    .then((response) => {
      onNameClick()
      dispatch(userFound({
        name: flickrUserName,
        id: response.data.id
      }))
    }).catch((error) => {
      toast.error("Usuario no encontrado");
    });
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
                <Link onClick={nameClickHandler} href="#" underline="hover" color={'inherit'}>
                  {user}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </DialogContent>
  );
}
