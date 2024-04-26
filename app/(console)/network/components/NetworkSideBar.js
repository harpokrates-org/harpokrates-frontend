"use client";
import {
  Box,
  Button,
  FormControl,
  TextField,
} from "@mui/material";

import { useState } from "react";
import {
  changeGraphConfig,
  selectGraphConfig,
} from "@/store/HarpokratesUserSlice";
import { useDispatch, useSelector } from "react-redux";

export const drawerWidth = 180;

export default function NetworkSideBar() {
  const graphConfig = useSelector(selectGraphConfig);
  const [depth, setDepth] = useState(graphConfig.depth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    dispatch(
      changeGraphConfig({
        ...graphConfig,
        depth: depth,
      })
    );
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
          error={depth < 1 || depth > 3}
          helperText={depth < 1 || depth > 3 ? "Profunidad entre 1 y 3" : " "}
        />
        <Button type="submit" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </FormControl>
    </Box>
  );
}
