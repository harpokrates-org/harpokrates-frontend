"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import { Input } from "@mui/joy";
import Person from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import {
  changeName,
  changeId,
  reset,
  selectName,
} from "@/store/FlickrUserSlice";
import { toast } from "react-hot-toast";
import { getUserName } from "@/app/api/UserAPI";

export default function UserSearcher() {
  const [flickrUserName, setFlickrUserName] = useState(useSelector(selectName));
  const dispatch = useDispatch();

  const updateNameHandler = (event) => {
    setFlickrUserName(event.target.value);
  };

  const searchNameHandler = () => {
    dispatch(changeName(flickrUserName));
    getUserName(flickrUserName)
      .then((response) => {
        dispatch(changeId(response.data.id));
      })
      .catch((error) => {
        console.log('user searcher')
        console.log(error)
        toast.error("Usuario no encontrado");
        dispatch(reset());
      });
  };

  const enterKeyNameHandler = (event) => {
    if (event.key === "Enter") {
      searchNameHandler();
    }
  };

  return (
    <Input
      onChange={updateNameHandler}
      onKeyDown={enterKeyNameHandler}
      startDecorator={<Person />}
      placeholder="Ingrese un nombre de usuario..."
      endDecorator={<Button onClick={searchNameHandler}>Buscar</Button>}
      size="sm"
      style={{ width: "400px" }}
      value={flickrUserName}
    ></Input>
  );
}
