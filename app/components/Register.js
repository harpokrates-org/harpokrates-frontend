"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

const emailAleadyExistsMessage = "Este correo ya fue registrado";

export default function Register({ open, onClose }) {
  const [emailExists, setEmailExists] = useState(false);

  const registerUserHandler = async (email, name, surname) => {
    try {
      return await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/register",
        { email, name, surname }
      );
    } catch (error) {
      if (
        error.response.status === 409 &&
        error.response.data.code === "EMAIL_ALREADY_EXISTS"
      )
        setEmailExists(true);
      return null;
    }
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
          if (
            !(await registerUserHandler(
              formJson.email,
              formJson.name,
              formJson.surname
            ))
          )
            return;
          toast.success("Cuenta registrada");
          onClose();
        },
      }}
    >
      <DialogTitle>Registrate</DialogTitle>
      <DialogContent>
        <TextField
          required
          id="name"
          name="email"
          label="Correo electrónico"
          type="email"
          fullWidth
          variant="standard"
          helperText={emailExists ? emailAleadyExistsMessage : null}
          error={emailExists}
          margin="normal"
        />
        <TextField
          required
          id="name"
          name="name"
          label="Nombre"
          fullWidth
          variant="standard"
          margin="normal"
        />
        <TextField
          required
          id="name"
          name="surname"
          label="Apellido"
          fullWidth
          variant="standard"
          margin="normal"
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
