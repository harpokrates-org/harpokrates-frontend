'use client'
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Input } from '@mui/joy';
import Person from '@mui/icons-material/Person';
import { useDispatch } from 'react-redux'
import { changeName } from '@/store/FlickrUserSlice';


export default function UserSearcher() {
  const [flickrUserName, setFlickrUserName] = useState('');
  const dispatch = useDispatch()

  const updateNameHandler = (event) => {
    setFlickrUserName(event.target.value)
  }

  const searchNameHandler = () => {
    dispatch(changeName(flickrUserName))
  }

  return (
    <Input
      onChange={updateNameHandler}
      startDecorator={<Person/>}
      placeholder="Ingrese un nombre de usuario..."
      endDecorator={<Button onClick={searchNameHandler}>Buscar</Button>}
      size='sm'
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px'
      }}
    ></Input>
  );
}