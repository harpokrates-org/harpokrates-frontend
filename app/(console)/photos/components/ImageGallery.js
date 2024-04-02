"use client";
import { classify, loadLowModel } from "@/app/libs/classifier";
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectName, selectPhotos, setPhotos } from "@/store/FlickrUserSlice";
const pixels = require("image-pixels");
const R = require("ramda");
import { getUserPhotoSizes } from "@/app/api/UserAPI";

export default function ImageGallery() {
  const [model, setModel] = useState(null);
  const photos = useSelector(selectPhotos);
  const username = useSelector(selectName);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPrediction = async (src) => {
      const pix = await pixels(src);
      const prediction = await classify(model, pix);
      return prediction
    }

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
      const res = await getUserPhotoSizes(username, count);
      if (res.status != "200") {
        toast.error("Error al cargar las fotos");
        return;
      }

      const _photos = await Promise.all(
        res.data.photos.map(async (p) => {
          const size = R.filter((e) => e.label == label, p.sizes)[0];
          const prediction = await getPrediction(size.source);
          const filter = await getFilter(prediction);
          return {
            id: p.id,
            title: p.title,
            source: size.source,
            height: size.height,
            width: size.width,
            filter: filter,
            prediction: prediction
          };
        })
      );
      dispatch(setPhotos(_photos));
    };

    const fetchAll = async () => {
      await fetchModel();
      fetchUserPhotoSizes("Medium");
    };

    fetchAll();
  }, [username, model, dispatch]);

  return (
    <Box>
      <ImageList cols={4}>
        {photos.map((photo) => (
          <ImageListItem key={photo.id}>
            <img
              src={photo.source}
              alt={photo.title}
              style={{ height: 150, filter: photo.filter }}
              loading="lazy"
            />
            {  
              photo.prediction > 0.5 ? <ImageListItemBar subtitle={photo.prediction.toFixed(2)} /> : null
            }
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
