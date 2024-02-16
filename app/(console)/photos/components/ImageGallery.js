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
          Array.from(PHOTOS.entries()).map((e) => (
            <ImageListItem key={e[0]}>
              <img
                srcSet={e[1]}
                src={e[1]}
                alt={e[1]}
              />
            </ImageListItem>
          ))
        }
      </ImageList>
    </Box>
  )
}