'use client';
import { getUserFavorites } from '@/app/api/UserAPI';
import { selectName } from '@/store/FlickrUserSlice';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog, IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ImageInfo from './ImageInfo';
import ImageLoading from './ImageLoading';


export default function ImageDialog({ photo, open, onClose }) {
  const [favorites, setFavorites] = useState(null);
  const username = useSelector(selectName);
  
  const closeHandler = () => {
    onClose()
    setFavorites(null)
  };

  useEffect(() => {
    const getFavorites = async () => {
      if (!photo.id) return
      const depth = 1
      const photosPerFavorite = 0
      const response = await getUserFavorites(username, [photo.id], photosPerFavorite, depth);
      const withoutMainUser = response.data.nodes.filter((node) => node !== username)
      setFavorites(withoutMainUser)
    };

    setFavorites(null)
    getFavorites();
  }, [username, photo, setFavorites]);

  return (
    <Dialog
      open={open}
      onClose={closeHandler}
      PaperProps={{
        sx: {
          maxWidth: '100vw',
        }
      }}
    >
      { favorites === null && <ImageLoading  />
        || <>
            <IconButton
              onClick={closeHandler}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <ImageInfo photo={photo} favorites={favorites} onNameClick={closeHandler} />
          </>
      }
    </Dialog>
  );
}
