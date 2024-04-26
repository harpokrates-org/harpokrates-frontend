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
  changeGraphDepth,
  selectGraphConfig,
  selectGraphDepth,
} from "@/store/HarpokratesUserSlice";
import { useDispatch, useSelector } from "react-redux";

export const drawerWidth = 180;

export default function NetworkSideBar() {
  const userDepth = useSelector(selectGraphDepth);
  const [depth, setDepth] = useState(userDepth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changeGraphDepth(depth));
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
        <Button type="submit" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </FormControl>
    </Box>
  );
}
