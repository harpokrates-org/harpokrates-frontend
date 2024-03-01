"use client"

import { Box, Container, CssBaseline, Divider, Grid } from "@mui/material";
import dynamic from 'next/dynamic'
import SideBar from "./components/SideBar";

// Test
// const SideBar = dynamic(() => import("./components/SideBar"), {
//   ssr: false,
// })

export default function ConsoleLayout({ children }) {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        {children}
      </Box>
    </>
  );
}
