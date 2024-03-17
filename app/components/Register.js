'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";

export default function Register({open, onClose}) {
  const registerUserHandler = async (email) => {
    await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/register', { email })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          await registerUserHandler(formJson.email);
          onClose();
        },
      }}
    >
      <DialogTitle>Registrate</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          id="name"
          name="email"
          label="Correo electrónico"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" sx={{ width: '100%' }} variant="contained">Aceptar</Button>
      </DialogActions>
    </Dialog>
  );
}