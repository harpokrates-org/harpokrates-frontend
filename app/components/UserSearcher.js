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
    console.log(`NEXT_PUBLIC_BACKEND_URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}`)
    const user_url = process.env.NEXT_PUBLIC_BACKEND_URL + '/user'
    console.log(`user-url: ${user_url}`)
    axios.get(user_url, {
      params: {
        username: flickrUserName
      },
    }).then((response) => {
      console.log(response)
      dispatch(wasFound())
    }).catch((error) => {
      console.log(error)
      dispatch(wasNotFound())
    }).finally(() => {
      dispatch(open())
    })
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