"use client";
import { postModel } from "@/app/api/UserAPI";
import { changeModels, selectEmail } from "@/store/HarpokratesUserSlice";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function AddModelDialog({ open, onClose, setRows }) {
  const dispatch = useDispatch();
  const email = useSelector(selectEmail);

  const postModelHandler = async (
    email,
    modelName,
    modelURL,
    modelImageSize,
    modelThreshold
  ) => {
    try {
      const data = await postModel(
        email,
        modelName,
        modelURL,
        modelImageSize,
        modelThreshold
      );
      const _models = data.models.map((model) => {
        return {
          id: model._id,
          name: model.name,
          url: model.url,
          imageSize: model.imageSize,
          threshold: model.threshold
        };
      });
      console.log("data", data);
      dispatch(changeModels(_models));
      toast.success("Modelo agregado");
    } catch (err) {
      toast.error("No fue posible agregar el modelo");
      console.log(err);
    }
    onClose();
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
          if (
            !(await postModelHandler(
              email,
              formJson.modelName,
              formJson.modelURL,
              formJson.modelImageSize,
              formJson.modelThreshold
            ))
          )
            return;
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
          autoFocus
          required
          id="modelImageSize"
          name="modelImageSize"
          label="Tamaño de la Imagen"
          fullWidth
          type="number"
          variant="standard"
        />
      </DialogContent>
      <DialogContent>
        <TextField
          autoFocus
          required
          id="modelThreshold"
          name="modelThreshold"
          label="Umbral"
          fullWidth
          type="number"
          variant="standard"
          inputProps={{
            maxLength: 1,
            step: "0.1"
          }}
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
