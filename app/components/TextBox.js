'use client'
import { Box, Button, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectEmail } from "@/store/HarpokratesUserSlice";
import LoginDialog from "./LoginDialog";

export default function TextBox() {
  let email = useSelector(selectEmail);

  return (
    <Box>
      <Grid container spacing={2} p={7}>
        <Grid item xs={6} m="auto">
          <Grid item xs={12} m="auto">
            <Typography variant="h3" display="inline" fontWeight="bold">
              Explorá la esteganografía de imágenes con
            </Typography>
            <Typography variant="h3" color="primary" display="inline">
              &nbsp;
            </Typography>
            <Typography
              variant="h3"
              color="primary"
              display="inline"
              fontWeight="bold"
            >
              Harpokrates
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              Recorré Flick en busqueda de comunidades, influencers y
              comunicación oculta por imagenes
            </Typography>
            {email ? (
              <Button variant="contained" color="secondary" href="/photos">
                Probá acá
              </Button>
            ) : (
              <LoginDialog />
            )}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <img src="imgs/graph.png" loading="lazy" />
        </Grid>
      </Grid>
    </Box>
  );
}
