"use client";
import { fetchModel, fetchUserFavorites, fetchUserPhotoSizes, predict } from "@/app/libs/utils";
import { selectId, selectName, selectPhotos, selectPhotosAreUpdated, setFavorites, setPhotos } from "@/store/FlickrUserSlice";
import { selectFilters } from "@/store/PhotosFilterSlice";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageDialog from "./ImageDialog";
import { collectModels } from "@/app/libs/ModelCollection";
import { selectModels } from "@/store/HarpokratesUserSlice";
const R = require("ramda");

export default function ImageGallery() {
  const [clickedImage, setClickedImage] = useState({ id: '', source: '', title: '', width: 0, height: 0 });
  const [openImage, setOpenImage] = useState(false);
  const photos = useSelector(selectPhotos)
  const userID = useSelector(selectId);
  const username = useSelector(selectName);
  const filters = useSelector(selectFilters);
  const photosAreUpdated = useSelector(selectPhotosAreUpdated);
  const dispatch = useDispatch();
  const userModels = useSelector(selectModels);

  const imageClickHandler = (photo) => {
    setClickedImage(photo)
    setOpenImage(true);
  };

  const imageCloseHandler = () => {
    setOpenImage(false);
  };

  useEffect(() => {
    const modelPrediction = async () => {
      // if (!userID) return
      const modelCollection = collectModels(userModels);
      const model = await fetchModel(modelCollection, filters.modelName);
      const updatedPhotos = photosAreUpdated ? photos: await fetchUserPhotoSizes(userID, filters.minDate, filters.maxDate, 'Medium')
      const _photos = await predict(model, filters.modelThreshold, updatedPhotos);
      const stegoPhotoIDs = _photos.filter((photo) => photo.prediction >= filters.modelThreshold)
                                    .map((photo) => photo.id)
      fetchUserFavorites(username, stegoPhotoIDs).then(favorites => dispatch(setFavorites(favorites)))
      dispatch(setPhotos(_photos));
    };

    modelPrediction()
  }, [userID, photosAreUpdated, filters, dispatch]);


  return (
    <Box>
      <ImageList cols={4}>
        {photos.map((photo) => (
          <ImageListItem key={photo.id}>
            <Button onClick={() => imageClickHandler(photo)}>
              <img
                src={photo.source}
                alt={photo.title}
                style={{ height: 150, filter: photo.filter }}
                loading="lazy"
              />
            </Button>
            {photo.prediction >= filters.modelThreshold ? (
              <ImageListItemBar subtitle={photo.prediction.toFixed(2)} />
            ) : null}
          </ImageListItem>
        ))}
      </ImageList>
      <ImageDialog photo={clickedImage} open={openImage} onClose={imageCloseHandler} />
    </Box>
  );
}
