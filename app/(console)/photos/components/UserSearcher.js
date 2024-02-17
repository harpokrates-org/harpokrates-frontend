'use client'
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Input } from '@mui/joy';
import Person from '@mui/icons-material/Person';
import { useDispatch } from 'react-redux'
import { changeName, wasFound, wasNotFound, changeId } from '@/store/FlickrUserSlice';
import axios from 'axios';
import { close, open } from '@/store/SearchAlertSlice';
import { toast } from 'react-hot-toast';

export default function UserSearcher() {
  const [flickrUserName, setFlickrUserName] = useState('');
  const dispatch = useDispatch()

  const updateNameHandler = (event) => {
    dispatch(close())
    setFlickrUserName(event.target.value)
  }

  const searchNameHandler = () => {
    dispatch(changeName(flickrUserName))
    const user_url = process.env.NEXT_PUBLIC_BACKEND_URL + '/user'
    axios.get(user_url, {
      params: {
        username: flickrUserName
      },
    }).then((response) => {
      console.log(response.data.id)
      dispatch(changeId(response.data.id))
      dispatch(wasFound())
    }).catch((error) => {
      toast.error('Usuario no encontrado')
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
      style={{width: '400px'}}
    ></Input>
  );
}