'use client'
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Input } from '@mui/joy';
import Person from '@mui/icons-material/Person';
import { useDispatch } from 'react-redux'
import { changeName, wasFound, wasNotFound } from '@/store/FlickrUserSlice';
import axios from 'axios';
import { close, open } from '@/store/SearchAlertSlice';


export default function UserSearcher() {
  const [flickrUserName, setFlickrUserName] = useState('');
  const dispatch = useDispatch()

  const updateNameHandler = (event) => {
    dispatch(close())
    setFlickrUserName(event.target.value)
  }

  const searchNameHandler = () => {
    dispatch(changeName(flickrUserName))
    axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user', {
      params: {
        username: flickrUserName
      },
    }).then((response) => {
      dispatch(wasFound())
    }).catch((error) => {
      dispatch(wasNotFound())
    }).finally(() => {
      dispatch(open())
    })
  }

  const enterKeyNameHandler = (event) => {
    if (event.key === "Enter") {
      searchNameHandler();
    }
  }

  return (
    <Input
      onChange={updateNameHandler}
      onKeyDown={enterKeyNameHandler}
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