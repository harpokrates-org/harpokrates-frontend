"use client";
import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";

import { useState } from "react";
import {
  changeColor,
  changeDepth,
  selectColor,
  selectDepth,
  selectSize,
} from "@/store/NetworkSlice.js";
import { useDispatch, useSelector } from "react-redux";

export const drawerWidth = 180;

export default function NetworkSideBar() {
  const [depth, setDepth] = useState(useSelector(selectDepth));
  const [size, setSize] = useState(useSelector(selectSize));
  const [color, setColor] = useState(useSelector(selectColor));
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changeDepth(depth));
    dispatch(changeColor(color));
    dispatch(changeSize(size));
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
        </TextField>
        <Button type="submit" onClick={handleSubmit}>
          APLICAR
        </Button>
      </FormControl>
    </Box>
  );
}
