"use client"

import { Box, Toolbar } from "@mui/material";
import SideBar from "./components/SideBar";
import { notFound } from 'next/navigation';
import { useSelector } from "react-redux";
import { selectEmail } from "@/store/HarpokratesUserSlice";

export default function ConsoleLayout({ children }) {
  let email = useSelector(selectEmail);
  if (!email) {
    notFound()
  }

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
