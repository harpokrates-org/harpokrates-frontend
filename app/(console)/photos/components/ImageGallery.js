"use client";
import { classify, loadLowModel } from "@/app/libs/classifier";
import { selectName } from "@/store/FlickrUserSlice";
import { Box, ImageList, ImageListItem } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const pixels = require("image-pixels");
const R = require("ramda");
import { getUserPhotoSizes } from "@/app/api/UserAPI"

export default function ImageGallery() {
  const [photos, setPhotos] = useState([]);
  const [model, setModel] = useState(null);
  const username = useSelector(selectName);

  useEffect(() => {
    const getFilter = async (src) => {
      const pix = await pixels(src);
      const prediction = await classify(model, pix);
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
      if (res.status != '200') {
        toast.error('Error al cargar las fotos')
        return 
      }

      const _photos = await Promise.all(res.data.photos.map(async (p) => {
        const size = R.filter((e) => e.label == label, p.sizes)[0];
        return {
          id: p.id,
          title: p.title,
          source: size.source,
          height: size.height,
          width: size.width,
          filter: await getFilter(size.source)
        };
      }));
      setPhotos(_photos);
    };

    const fetchAll = async () => {
      await fetchModel();
      fetchUserPhotoSizes('Medium');
    };

    fetchAll();
  }, [username, model]);

  return (
    <Box>
      <ImageList cols={4}>
        {photos.map((photo) => (
          <ImageListItem key={photo.id}>
            <Image
              src={photo.source}
              alt={photo.title}
              width={photo.width}
              height={photo.height}
              style={{ height: 150, filter: photo.filter }}
              priority={true}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
