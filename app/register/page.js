'use client'
import { Input } from "@mui/joy";
import { Box, Button, Grid } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState('');

  const updateNameHandler = (event) => {
    setEmail(event.target.value)
  }

  const registerUserHandler = async () => {
    await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/register', { email })
  }

  return (
    <Box>
      <Grid container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
      >
        <Grid item>
          <h1 style={{ fontSize:30, textAlign: "center" }}>Registrate</h1>
          <p>Correo electrónico:</p>
          <Input
            onChange={updateNameHandler}
            placeholder="uncorreo@ejemplo.com"
            size='sm'
            style={{width: '400px'}}
            variant="soft"
            color="primary"
          ></Input>
          <Button 
            color="success"
            variant="contained"
            onClick={registerUserHandler}
            sx={{ marginTop: '10px', textAlign: 'center' }}
          >
            Registrate
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}