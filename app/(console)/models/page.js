"use client";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from "@mui/joy";
import { Button, Typography } from "@mui/material";
import ModelsTable from "./components/ModelsTable";
import { useState } from "react";
import AddModelDialog from "./components/AddModelDialog";

export default function Models() {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleClickAddModel = (value) => {
    setOpenAddDialog(true);
  };

  const onCloseHandle = () => {
    setOpenAddDialog(false)
  }

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
        <Grid xs={8}>
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
          <Grid>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={handleClickAddModel}
            >
              Agregar
            </Button>
            <AddModelDialog open={openAddDialog} onClose={onCloseHandle} />
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
      <Grid container xs={12}>
        <ModelsTable />
      </Grid>
    </Grid>
  );
}
