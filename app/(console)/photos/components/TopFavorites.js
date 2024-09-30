"use client";

import { selectFavorites } from "@/store/FlickrUserSlice";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useSelector } from "react-redux";


export default function TopFavorites() {
  const favorites = useSelector(selectFavorites)

  return (
    <Box>
        <Box marginBottom={2}>
          <Box marginLeft={2}>
            <Typography variant="h6">
              Top Favoritos en Imágenes Estegográficas
            </Typography>

            {
              Object.keys(favorites).length === 0 && (
                <Typography variant="subtitle1" color="textSecondary">
                  Aún no hay favoritos.
                </Typography>
              )
            }

            <List dense={true}>
            {
              Object.keys(favorites).sort((favoriteX, favoriteY) => 
                        favorites[favoriteY] - favorites[favoriteX])
                    .slice(0, 10)
                    .map((favorite) => (
                      <ListItem key={favorites}>
                      <ListItemText
                        primary={favorite}
                        secondary={favorites[favorite] + ' Favoritos'}
                      />
                      </ListItem>
                    ))
            }
            </List>
          </Box>
        </Box>
    </Box>
  );
}
