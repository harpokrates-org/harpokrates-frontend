'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, TextField } from "@mui/material";

export default function Login({open, onClose, registerClickHandler}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          onClose();
        },
      }}
    >
      <DialogTitle>Inicia sesión</DialogTitle>
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
      <DialogContent>
        <DialogContentText>
          ¿Aún no tienes cuenta?
          <Link style={{ textAlign: "center", paddingLeft: '5px' }} onClick={registerClickHandler}>
            Registrate
          </Link>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}