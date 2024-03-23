"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  TextField,
} from "@mui/material";
import { postLogin } from "@/app/api/UserAPI";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { changeEmail, reset } from "@/store/HarpokratesUserSlice";

const emailDoesNotExistMessage = "Email no encontrado";

export default function Login({ open, onClose, registerClickHandler }) {
  const [emailDoesNotExist, setEmailDoesNotExist] = useState(false);
  const dispatch = useDispatch();

  const loginUserHandler = async (email) => {
    try {
      const res = await postLogin(email);
      dispatch(changeEmail(email));
      return res;
    } catch (error) {
      if (
        error.response.status === 401 &&
        error.response.data.code === "USER_DOESNT_EXIST"
      ) {
        dispatch(reset());
        setEmailDoesNotExist(true);
      }
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
          if (!(await loginUserHandler(formJson.email))) return;
          toast.success("Login exitoso");
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
          helperText={emailDoesNotExist ? emailDoesNotExistMessage : null}
          error={emailDoesNotExist}
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" sx={{ width: "100%" }} variant="contained">
          Aceptar
        </Button>
      </DialogActions>
      <DialogContent>
        <DialogContentText>
          ¿Aún no tienes cuenta?
          <Link
            style={{ textAlign: "center", paddingLeft: "5px" }}
            onClick={registerClickHandler}
          >
            Registrate
          </Link>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
