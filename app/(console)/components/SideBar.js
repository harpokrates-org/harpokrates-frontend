'use client'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import HubIcon from '@mui/icons-material/Hub';

export const drawerWidth = 180;

export default function SideBar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem key='ImageGallery' disablePadding>
            <ListItemButton href="/photos">
              <ListItemIcon>
                <PhotoLibraryIcon />
              </ListItemIcon>
              <ListItemText primary='Fotos' />
            </ListItemButton>
          </ListItem>
          <ListItem key='Network' disablePadding>
            <ListItemButton href="/network">
              <ListItemIcon>
                <HubIcon />
              </ListItemIcon>
              <ListItemText primary='Red' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}