"use client";
import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";

import { useState } from "react";
import {
  changeColor,
  changeDepth,
  changeSize,
  changeSpanningTreeK,
  selectColor,
  selectDepth,
  selectSize,
  selectSpanningTreeK,
} from "@/store/NetworkSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { mustUpdateNetwork } from "@/store/FlickrUserSlice";

export const drawerWidth = 180;

export default function NetworkSideBar() {
  const currentDepth = useSelector(selectDepth);
  const [depth, setDepth] = useState(useSelector(selectDepth));
  const [size, setSize] = useState(useSelector(selectSize));
  const [color, setColor] = useState(useSelector(selectColor));
  const [spanningTreeK, setSpanningTreeK] = useState(useSelector(selectSpanningTreeK));
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const mustUpdate = depth != currentDepth
    dispatch(changeDepth(depth));
    dispatch(changeColor(color));
    dispatch(changeSize(size));
    dispatch(changeSpanningTreeK(spanningTreeK));
    if (mustUpdate) dispatch(mustUpdateNetwork())
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <TextField
          label="Profundidad"
          variant="outlined"
          type="number"
          value={depth}
          onChange={(e) => {
            setDepth(parseInt(e.target.value));
          }}
          error={depth < 0 || depth > 3}
          helperText={depth < 0 || depth > 3 ? "Profunidad entre 0 y 3" : " "}
        />
        <TextField
          select
          label="Tamaño"
          variant="outlined"
          value={size}
          helperText="Tamaño del vertice"
          onChange={(e) => {
            setSize(e.target.value);
          }}
        >
          <MenuItem value={"no-size"}>Sin Tamaño</MenuItem>
          <MenuItem value={"degree"}>Grado</MenuItem>
          <MenuItem value={"popularity"}>Popularidad</MenuItem>
          <MenuItem value={"follower"}>Favoritos dados</MenuItem>
        </TextField>
        <TextField
          select
          label="Color"
          variant="outlined"
          value={color}
          helperText="Color del vertice"
          onChange={(e) => {
            setColor(e.target.value);
          }}
        >
          <MenuItem value={"no-color"}>Sin Color</MenuItem>
          <MenuItem value={"community"}>Comunidad</MenuItem>
          <MenuItem value={"spanning_tree"}>K Spanning Tree</MenuItem>
        </TextField>
        { color == "spanning_tree" &&
          <TextField
            label="K"
            variant="outlined"
            type="number"
            value={spanningTreeK}
            onChange={(e) => {
              setSpanningTreeK(parseInt(e.target.value));
            }}
            error={spanningTreeK <= 1}
            helperText={spanningTreeK <= 1 ? "K mayor a 1" : "Numero de comunidades"}
          />
        }
        <Button type="submit" onClick={handleSubmit}>
          APLICAR
        </Button>
      </FormControl>
    </Box>
  );
}
