"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectName } from "@/store/FlickrUserSlice";
import EmptyState from "../components/EmptyState";
import NetworkSideBar from "./components/NetworkSideBar";

const noGraphTitle = "Busca un usuario";
const noGraphMessage =
  "Para ver una red, necesitas ingresar un nombre de usuario en el buscador superior.";

export default function ClippedDrawer() {
  const Graph = dynamic(() => import("./components/Graph"), { ssr: false });
  const username = useSelector(selectName);
  const topMargin = 0

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          { username ? 
            <Graph /> :
            <EmptyState title={noGraphTitle} message={noGraphMessage} topMargin={topMargin} />
          }
        </Grid>
        <Grid item xs={3}>
          <NetworkSideBar />
        </Grid>
      </Grid>
    </Box>
  );
}
