"use client";
import { collectModels } from "@/app/libs/ModelCollection";
import {
  fetchModel,
  fetchUserFavorites,
  fetchUserPhotoSizes,
  predict,
} from "@/app/libs/utils";
import {
  selectId,
  selectName,
  selectPhotos,
  selectPhotosAreUpdated,
  setFavorites,
  setPhotos,
} from "@/store/FlickrUserSlice";
import { selectModels } from "@/store/HarpokratesUserSlice";
import { selectFilters } from "@/store/PhotosFilterSlice";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageDialog from "./ImageDialog";
const R = require("ramda");

const downloadStegoImages = async (stegoPhotos) => {
  const zip = new JSZip();
  const images = stegoPhotos.map(async (photo) => {
    const response = await fetch(photo.source);
    const data = await response.blob();
    const name = photo.title.replaceAll(" ", "_");
    const type = photo.source.split(".").pop();
    zip.file(`${name}.${type}`, data);

    return data;
  });

  Promise.all(images).then(() => {
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "detecciones.zip");
    });
  });
};

export default function ImageGallery() {
  const [clickedImage, setClickedImage] = useState({
    id: "",
    source: "",
    title: "",
    width: 0,
    height: 0,
  });
  const [openImage, setOpenImage] = useState(false);
  const [stegoPhotos, setStegoPhotos] = useState([]);
  const photos = useSelector(selectPhotos);
  const userID = useSelector(selectId);
  const username = useSelector(selectName);
  const filters = useSelector(selectFilters);
  const photosAreUpdated = useSelector(selectPhotosAreUpdated);
  const dispatch = useDispatch();
  const userModels = useSelector(selectModels);

  const imageClickHandler = (photo) => {
    setClickedImage(photo);
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
      const updatedPhotos = photosAreUpdated
        ? photos
        : await fetchUserPhotoSizes(
            userID,
            filters.minDate,
            filters.maxDate,
            "Medium"
          );
      const _photos = await predict(
        model,
        filters.modelThreshold,
        updatedPhotos
      );
      const stegoPhotosAux = _photos.filter(
        (photo) => photo.prediction >= filters.modelThreshold
      );
      const stegoPhotoIDs = stegoPhotosAux.map((photo) => photo.id);
      fetchUserFavorites(username, stegoPhotoIDs).then((favorites) =>
        dispatch(setFavorites(favorites))
      );
      setStegoPhotos(stegoPhotosAux);
      dispatch(setPhotos(_photos));
    };

    modelPrediction();
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
                style={{
                  width: "100%",
                  height: "20vh",
                  filter: photo.filter,
                  objectFit: 'cover'
                }}
                loading="lazy"
              />
            </Button>
            {photo.prediction >= filters.modelThreshold ? (
              <ImageListItemBar
                subtitle={photo.prediction.toFixed(2)}
              />
            ) : null}
          </ImageListItem>
        ))}
      </ImageList>
      {stegoPhotos.length > 0 && (
        <Button
          onClick={() => downloadStegoImages(stegoPhotos)}
          variant="outlined"
          sx={{ margin: `20px` }}
        >
          Descargar detecciones
        </Button>
      )}
      <ImageDialog
        photo={clickedImage}
        open={openImage}
        onClose={imageCloseHandler}
      />
    </Box>
  );
}
