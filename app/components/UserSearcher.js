import * as React from 'react';
import Button from '@mui/material/Button';
import { Input } from '@mui/joy';
import Person from '@mui/icons-material/Person';


export default function UserSearcher() {

  return (
    <Input
      startDecorator={<Person/>}
      placeholder="Ingrese un nombre de usuario..."
      endDecorator={<Button>Buscar</Button>}
      size='sm'
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px'
      }}
    ></Input>
  );
}