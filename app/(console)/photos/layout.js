"use client"

import { Box, Container, CssBaseline, Divider, Grid, Toolbar } from "@mui/material";
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
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  );
}
