"use client";
import { deleteModel, getUserModels } from "@/app/api/UserAPI";
import { changeModels, selectEmail } from "@/store/HarpokratesUserSlice";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from "@mui/joy";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AddModelDialog from "./components/AddModelDialog";
import ModelsTable from "./components/ModelsTable";
const R = require("ramda");

export default function Models() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState();
  const email = useSelector(selectEmail);
  const dispatch = useDispatch();

  const handleClickAddModel = (value) => {
    setOpenAddDialog(true);
  };

  const onCloseHandle = () => {
    setOpenAddDialog(false);
  };

  const handleClickDeleteModel = async (value) => {
    const res = await Promise.all(
      selectedRows.map(async (modelID) => {
        try {
          await deleteModel(email, modelID);
          return 0;
        } catch (err) {
          toast.error(`No se puedo eliminar al modelo de ID: ${modelID}`);
          return 1;
        }
      })
    );

    const responesesWithErrors = R.sum(res);
    if (responesesWithErrors > 0) {
      toast.error("Algunos modelos no pudieron ser eliminados");
    } else {
      toast.success("Modelos eliminados con exito");
    }

    const data = await getUserModels(email);
    const _models = data.models.map((model) => {
      return {
        id: model._id,
        name: model.name,
        imageSize: model.imageSize,
        threshold: model.threshold,
        url: model.url,
      };
    });
    dispatch(changeModels(_models));
  };

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
              onClick={handleClickDeleteModel}
            >
              Quitar
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <ModelsTable setSelectedRows={setSelectedRows} />
      </Grid>
    </Grid>
  );
}
