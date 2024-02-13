import { Box, ImageList, ImageListItem } from "@mui/material"

export default function ImageGallery() {
  const PHOTOS = [
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg"
  ]
  return (
    <Box>
      <ImageList cols={4}>
        {
          PHOTOS.map((photo) => (
            <ImageListItem key={photo}>
              <img
                srcSet={photo}
                src={photo}
                alt={photo}
              />
            </ImageListItem>
          ))
        }
      </ImageList>
    </Box>
  )
}