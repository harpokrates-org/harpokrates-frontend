'use client'

import { Button } from "@mui/material";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function LoginDialog() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const loginClickHandler = () => {
    setOpenLogin(true);
  };

  const loginCloseHandler = () => {
    setOpenLogin(false);
  };

  const registerClickHandler = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };

  const registerCloseHandler = () => {
    setOpenRegister(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={loginClickHandler}>Accedé a tu cuenta</Button>
      <Login open={openLogin} onClose={loginCloseHandler} registerClickHandler={registerClickHandler}/>
      <Register open={openRegister} onClose={registerCloseHandler}/>
    </>
  );
}