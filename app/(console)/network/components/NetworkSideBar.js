"use client";
import { modelNames } from "@/app/libs/AppModelIndex";
import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";

import { mustUpdateNetwork } from "@/store/FlickrUserSlice";
import {
  changeColor,
  changeDepth,
  changeSize,
  changeModelName,
  changeSpanningTreeK,
  selectColor,
  selectDepth,
  selectModelName,
  selectSize,
  selectSpanningTreeK,
  selectTopStegoUsersCounter,
  changeTopStegoUsersCounter,
} from "@/store/NetworkSlice.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collectModelNames, collectModels } from "@/app/libs/ModelCollection";
import { selectModels } from "@/store/HarpokratesUserSlice";

export const drawerWidth = 180;

export default function NetworkSideBar() {
  const dispatch = useDispatch();
  const currentDepth = useSelector(selectDepth);
  const [depth, setDepth] = useState(useSelector(selectDepth));
  const [size, setSize] = useState(useSelector(selectSize));
  const [color, setColor] = useState(useSelector(selectColor));
  const [spanningTreeK, setSpanningTreeK] = useState(
    useSelector(selectSpanningTreeK)
  );
  const [modelName, setModelName] = useState(useSelector(selectModelName));
  const userModels = useSelector(selectModels);
  const [topStegoUsersCounter, setTopStegoUsersCounter] = useState(useSelector(selectTopStegoUsersCounter))

  const modelNames = collectModelNames(userModels);
  const models = collectModels(userModels);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mustUpdate = depth != currentDepth;
    dispatch(changeDepth(depth));
    dispatch(changeColor(color));
    dispatch(changeSize(size));
    dispatch(changeSpanningTreeK(spanningTreeK));
    dispatch(changeModelName(modelName));
    dispatch(changeTopStegoUsersCounter(topStegoUsersCounter));
    if (mustUpdate) dispatch(mustUpdateNetwork());
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
          <MenuItem value={"stego-count"} disabled={color == "stego-count"}>
            Esteganografía compartida
          </MenuItem>
        </TextField>
        {color != "stego-count" && size == "stego-count" && (
          <TextField
            select
            label="Modelo"
            variant="outlined"
            value={modelName}
            helperText="Modelo de esteganalisis"
            onChange={(e) => {
              setModelName(e.target.value);
            }}
          >
            {modelNames.map((name) => {
              return (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              );
            })}
          </TextField>
        )}

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
          <MenuItem value={"stego-count"} disabled={size == "stego-count"}>
            Esteganografía compartida
          </MenuItem>
        </TextField>
        {color == "spanning_tree" && (
          <TextField
            label="K"
            variant="outlined"
            type="number"
            value={spanningTreeK}
            onChange={(e) => {
              setSpanningTreeK(parseInt(e.target.value));
            }}
            error={spanningTreeK <= 1}
            helperText={
              spanningTreeK <= 1 ? "K mayor a 1" : "Numero de comunidades"
            }
          />
        )}
        {color == "stego-count" && size != "stego-count" && (
          <TextField
            select
            label="Modelo"
            variant="outlined"
            value={modelName}
            helperText="Modelo de esteganalisis"
            onChange={(e) => {
              setModelName(e.target.value);
            }}
          >
           {modelNames.map((name) => {
              return (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              );
            })}
          </TextField>
        )}
        {(color == "stego-count" || size == "stego-count") && (
          <TextField
            label="Cantidad usuarios a analizar"
            variant="outlined"
            type="number"
            value={topStegoUsersCounter}
            onChange={(e) => {
              setTopStegoUsersCounter(parseInt(e.target.value));
            }}
            error={topStegoUsersCounter <= 1}
            helperText={
              topStegoUsersCounter <= 1 ? "Debe ser mayor a 1" : "Numero de usuarios a analizar"
            }
          />
        )}
        <Button type="submit" onClick={handleSubmit}>
          APLICAR
        </Button>
      </FormControl>
    </Box>
  );
}
