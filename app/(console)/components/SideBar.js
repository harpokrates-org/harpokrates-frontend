"use client";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import HubIcon from "@mui/icons-material/Hub";
import GrainIcon from "@mui/icons-material/Grain";
import { usePathname } from "next/navigation";

const PATHNAMES = {
  PHOTOS: "/photos",
  NETWORK: "/network",
  MODELS: "/models",
};

export const drawerWidth = 180;
const text = {
  textDecorationLine: "underline",
  textDecorationThickness: "3px",
  textDecorationColor: "#757575", // gris oscuro
};

export default function SideBar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem key="ImageGallery" disablePadding>
            <ListItemButton href={PATHNAMES.PHOTOS}>
              <ListItemIcon>
                <PhotoLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={
                  pathname === PATHNAMES.PHOTOS ? { style: text } : {}
                }
                primary="Fotos"
              />
            </ListItemButton>
          </ListItem>
          <ListItem key="Network" disablePadding>
            <ListItemButton href={PATHNAMES.NETWORK}>
              <ListItemIcon>
                <HubIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={
                  pathname === PATHNAMES.NETWORK ? { style: text } : {}
                }
                primary="Red"
              />
            </ListItemButton>
          </ListItem>
          <ListItem key="Models" disablePadding>
            <ListItemButton href={PATHNAMES.MODELS}>
              <ListItemIcon>
                <GrainIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={
                  pathname === PATHNAMES.MODELS ? { style: text } : {}
                }
                primary="Modelos"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
