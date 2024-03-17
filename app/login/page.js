import { Box, Grid, Link } from "@mui/material";

export default function Page() {
  return (
    <Box>
      <Grid container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
      >
        <Grid item>
          <h1 style={{ fontSize:30, textAlign: "center" }}>Inicia sesión aquí:</h1>
          <p style={{ textAlign: "center" }}>
            ¿Aún no tienes cuenta? 
            <Link href="/register" style={{ textAlign: "center", paddingLeft: '5px' }}>Registrate</Link>
          </p>
        </Grid>
      </Grid>
    </Box>
  )
}