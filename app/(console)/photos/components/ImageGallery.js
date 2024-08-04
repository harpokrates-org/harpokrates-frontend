"use client";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectId, selectPhotos, selectUserChanged, setPhotos, userWasEstablished } from "@/store/FlickrUserSlice";
const R = require("ramda");
import { getUserPhotoSizes } from "@/app/api/UserAPI"
import ImageDialog from "./ImageDialog";
import { photosUpdated, selectFilters } from "@/store/PhotosFilterSlice";
import { models } from "@/app/libs/modelIndex";

export default function ImageGallery() {
  const [clickedImage, setClickedImage] = useState({ id: '', source: '', title: '', width: 0, height: 0 });
  const [openImage, setOpenImage] = useState(false);
  const photos = useSelector(selectPhotos)
  const userID = useSelector(selectId);
  const filters = useSelector(selectFilters);
  const userChanged = useSelector(selectUserChanged);
  const dispatch = useDispatch();

  const imageClickHandler = (photo) => {
    setClickedImage(photo)
    setOpenImage(true);
  };

  const imageCloseHandler = () => {
    setOpenImage(false);
  };

  const getFilter = async (prediction) => {
    const stegoFilter =
      "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)";
    const filter = prediction >= filters.modelThreshold ? stegoFilter : "";
    return filter;
  };

  useEffect(() => {
    const fetchModel = async () => {
      const model = models[filters.modelName];
      await model.load();
      return model
    };

    const fetchUserPhotoSizes = async (label) => {
      if (!userID) return;
      const count = 12;
      const res = await getUserPhotoSizes(
        userID,
        count,
        Date.parse(filters.minDate),
        Date.parse(filters.maxDate),
      );
      if (res.status != "200") {
        toast.error("Error al cargar las fotos");
        return;
      }

      const _photos = await Promise.all(
        res.data.photos.map(async (p) => {
          const size = R.filter((e) => e.label == label, p.sizes)[0];
          const filter = await getFilter(0);
          return {
            id: p.id,
            title: p.title,
            source: size.source,
            height: size.height,
            width: size.width,
            filter
          };
        })
      );

      return _photos
    }

    const predict = async (model, photos) => {
      if (!model) return;
      const _photos = await Promise.all(
        photos.map(async (p) => {
          const prediction = await model.getPrediction(p.source);
          const filter = await getFilter(prediction);
          return {
            ...p,
            filter: filter,
            prediction: prediction,
          };
        })
      )
      dispatch(setPhotos(_photos));
      dispatch(photosUpdated());
      dispatch(userWasEstablished());
    }

    const modelPrediction = async () => {
      const model = await fetchModel();
      const updatedPhotos = (filters.shouldUpdatePhotos || userChanged) ? await fetchUserPhotoSizes("Medium") : photos
      predict(model, updatedPhotos);
    };

    modelPrediction()
  }, [userID, userChanged, filters, dispatch]);


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
