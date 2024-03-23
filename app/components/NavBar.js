"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import LoginDialog from "./LoginDialog";
import { useSelector } from "react-redux";
import { selectEmail } from "@/store/HarpokratesUserSlice";
import ProfileMenu from "./ProfileMenu";

export default function NavBar() {
  let email = useSelector(selectEmail);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }} variant="dense">
          <Button color="inherit" href="/">
            Harpokrates
          </Button>
          {email ? <ProfileMenu /> : <LoginDialog />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
