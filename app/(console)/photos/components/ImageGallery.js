'use client'
import { classify, loadLowModel } from "@/app/libs/classifier"
import { selectId, setPhotos } from "@/store/FlickrUserSlice"
import { Box, ImageList, ImageListItem } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
const pixels = require('image-pixels')
const R = require('ramda');

const filterSizeByLabel = (sizes, label) => {
  return sizes.map(size => {
    const r = R.filter((e) => e.label == label, size.sizes)[0]
    return r
  })
}

const getPhotos = async (userId) => {
  return await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/photos', {
    params: { user_id: userId, per_page: 12 }
  })
}

const getSizes = async (photoId) => {
  return await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/sizes', {
    params: { photo_id: photoId }
  })
}

export default function ImageGallery() {
  const [sizes, setSizes] = useState([])
  const [model, setModel] = useState(null)
  const userId = useSelector(selectId)
  const dispatch = useDispatch()

  useEffect(() => {
    const getFilter = async (src) => {
      const pix = await pixels(src);
      const prediction = await classify(model, pix);
      const stegoFilter = " grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)";
      const filter = prediction > 0.5 ? stegoFilter : "";
      return filter;
    }

    const fetchModel = async () => {
      if (model) return;
      const m = await loadLowModel()
      setModel(m)
    }

    const fetchPhotos = async () => {
      if (!userId) {
        setSizes([])
        return;
      }
      const photos_res = await getPhotos(userId)
      if (photos_res.status != '200') {
        toast.error('Error al cargar las fotos')
      }
      dispatch(setPhotos(photos_res.data.photos))

      const sizes_res = await Promise.all(photos_res.data.photos.map(async (photo) => {
        const r = await getSizes(photo.id)
        return r.data
      }))

      const mediums = filterSizeByLabel(sizes_res, 'Medium');
      const siz = mediums.map(async m => {
        return { source: m.source, filter: await getFilter(m.source) }
      })

      setSizes(await Promise.all(siz))
    }

    const fetchAll = async () => {
      await fetchModel();
      fetchPhotos()
    }

    fetchAll();
  }, [userId, model])

  return (
    <Box>
      <ImageList cols={4}>
        {
          sizes.map((photo) => (
            <ImageListItem key={photo.source}>
              <img
                srcSet={photo.source}
                src={photo.source}
                alt={photo.source}
                style={{ height: 150, filter: photo.filter }}
              />
            </ImageListItem>
          ))
        }
      </ImageList>
    </Box>
  )
}
