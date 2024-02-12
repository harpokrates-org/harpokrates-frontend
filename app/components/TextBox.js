import { Box, Grid, Typography } from "@mui/material";

export default function TextBox() {
  return (
    <Box>
      <Grid container spacing={2} p={7}>
        <Grid item xs={6} m="auto">
          <Grid item xs={12} m="auto">
            <Typography variant="h3" display="inline" fontWeight='bold'>
              Explora la esteganografía de imágenes con
            </Typography>
            <Typography variant="h3" color="primary" display="inline">
              &nbsp;
            </Typography>
            <Typography variant="h3" color="primary" display="inline" fontWeight='bold'>
              Harpokrates
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" display="inline">
              Recorre Flick en busqueda de comunidades, influencers y comunicación oculta por imagenes   
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Box
            component="img"
            src='imgs/graph2.png'
          />
        </Grid>
      </Grid>
    </Box >
  )
}