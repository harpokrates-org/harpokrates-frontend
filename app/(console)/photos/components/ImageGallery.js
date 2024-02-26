'use client'
import { selectId } from "@/store/FlickrUserSlice"
import { Box, ImageList, ImageListItem } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
const R = require('ramda');
// Import @tensorflow/tfjs or @tensorflow/tfjs-core
const tf = require('@tensorflow/tfjs');
// Add the WASM backend to the global backend registry.
require('@tensorflow/tfjs-backend-wasm');
 
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

  useEffect(() => {
    const fetchModel = async () => {
      if (model) return;
      const m = await tf.loadLayersModel('model/low/model.json')
      m.summary()
      setModel(m)
    }

    const fetchPhotos = async () => {
      if (!userId) return;
      const photos_res = await getPhotos(userId)
      if (photos_res.status != '200') {
        toast.error('Error al cargar las fotos')
      }

      const sizes_res = await Promise.all(photos_res.data.photos.map(async (photo) => {
        const r = await getSizes(photo.id)
        return r.data
      }))
      setSizes(sizes_res)
    }

    const fetchAll = async () => {
      fetchModel()
      fetchPhotos()
    }

    fetchAll();
  }, [userId, model])

  return (
    <Box>
      <ImageList cols={4}>
        {
          filterSizeByLabel(sizes, 'Medium').map((photo) => (
            <ImageListItem key={photo.source}>
              <img
                srcSet={photo.source}
                src={photo.source}
                alt={photo.source}
                style={{ height: 150 }}
              />
            </ImageListItem>
          ))
        }
      </ImageList>
    </Box>
  )
}
