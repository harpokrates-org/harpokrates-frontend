import { Box, ImageList, ImageListItem } from "@mui/material"
import { getUserID } from '@/api/flickr/users'
export default async function ImageGallery() {
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

  const userID = await getUserID('eugefranx')
  console.log(userID)

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