import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from "@mui/joy";
import { Button, Typography } from "@mui/material";
import ModelsTable from "./components/modelsTable";

export default function Models() {
  return (
    <Grid container spacing={2}>
      <Grid
        container
        xs={12}
        sx={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        <Grid item xs={8}>
          <Typography>Modelos del Usuario</Typography>
        </Grid>
        <Grid
          container
          xs={4}
          sx={{
            justifyContent: "flex-end",
          }}
          spacing={0.5}
        >
          <Grid item>
            <Button variant="contained" color="success" startIcon={<AddIcon />}>
              Agregar
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Quitar
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ModelsTable />
      </Grid>
    </Grid>
  );
}
