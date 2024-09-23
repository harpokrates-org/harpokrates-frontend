"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";

export default function AddModelDialog({ open, onClose }) {
  const addModelHandler = async (model) => {
    console.log("Modelo agregado");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          console.log(formJson);
          toast.success("Modelo agregado");
          onClose();
        },
      }}
    >
      <DialogTitle>Agregá un nuevo modelo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          id="modelName"
          name="modelName"
          label="Nombre del Modelo"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogContent>
        <TextField
          required
          id="modelURL"
          name="modelURL"
          label="URL del Modelo"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" sx={{ width: "100%" }} variant="contained">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
