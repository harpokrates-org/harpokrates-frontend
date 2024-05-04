"use client";
import { getPrediction, loadLowModel } from "@/app/libs/classifier";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectName, selectPhotos, setPhotos } from "@/store/FlickrUserSlice";
const R = require("ramda");
import { getUserPhotoSizes } from "@/app/api/UserAPI"
import ImageDialog from "./ImageDialog";
import { selectMaxDate, selectMinDate } from "@/store/PhotosFilterSlice";

export default function ImageGallery() {
  const [model, setModel] = useState(null);
  const [clickedImage, setClickedImage] = useState({ id: '', source: '', title: '', width: 0, height: 0 });
  const [openImage, setOpenImage] = useState(false);
  const photos = useSelector(selectPhotos)
  const username = useSelector(selectName);
  const minDate = useSelector(selectMinDate);
  const maxDate = useSelector(selectMaxDate);
  const dispatch = useDispatch();

  const imageClickHandler = (photo) => {
    setClickedImage(photo)
    setOpenImage(true);
  };

  const imageCloseHandler = () => {
    setOpenImage(false);
  };

  useEffect(() => {
    const getFilter = async (prediction) => {
      const stegoFilter =
        "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)";
      const filter = prediction > 0.5 ? stegoFilter : "";
      return filter;
    };

    const fetchModel = async () => {
      if (model) return;
      const _model = await loadLowModel();
      setModel(_model);
    };

    const fetchUserPhotoSizes = async (label) => {
      if (!username | !model) return;
      const count = 12;
      const res = await getUserPhotoSizes(
        username,
        count,
        Date.parse(minDate),
        Date.parse(maxDate),
      );
      if (res.status != "200") {
        toast.error("Error al cargar las fotos");
        return;
      }

      const _photos = await Promise.all(
        res.data.photos.map(async (p) => {
          const size = R.filter((e) => e.label == label, p.sizes)[0];
          const prediction = await getPrediction(model, size.source);
          const filter = await getFilter(prediction);
          return {
            id: p.id,
            title: p.title,
            source: size.source,
            height: size.height,
            width: size.width,
            filter: filter,
            prediction: prediction,
          };
        })
      );
      dispatch(setPhotos(_photos));
    };

    const fetchAll = async () => {
      await fetchModel();
      fetchUserPhotoSizes("Medium");
    };

    setOpenImage(false)
    fetchAll();
  }, [username, model, minDate, maxDate, dispatch]);

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
            {photo.prediction > 0.5 ? (
              <ImageListItemBar subtitle={photo.prediction.toFixed(2)} />
            ) : null}
          </ImageListItem>
        ))}
      </ImageList>
      <ImageDialog photo={clickedImage} open={openImage} onClose={imageCloseHandler} />
    </Box>
  );
}
