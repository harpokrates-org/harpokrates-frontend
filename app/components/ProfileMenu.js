"use client";
import { useDispatch, useSelector } from "react-redux";
import { reset, selectEmail } from "@/store/HarpokratesUserSlice";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@mui/icons-material";

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  let email = useSelector(selectEmail);
  const dispatch = useDispatch();
  const router = useRouter();

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    dispatch(reset());
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={openMenu} color="inherit">
        {email}
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem component={"a"} href={"/"} onClick={logout}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
