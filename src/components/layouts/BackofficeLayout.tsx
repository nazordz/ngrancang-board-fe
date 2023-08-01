import {
  AppBar,
  Avatar,
  Box,
  Button,
  CSSObject,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import BackofficeTopNavigation from "../global/BackofficeTopNavigation";
import '@/assets/styles/Backoffice.scss'
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import { IMenu } from "@/models";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FormProjectDialog from "../dialogs/FormProjectDialog";
import { useAppSelector } from "@/store/hooks";
import { LinkBehavior } from "@/theme";
import { menuList } from "@/utils/menuList";
import { getUser } from "@/services/AuthenticationService";

const drawerWidth = 240;


export function isMenuActive(
  to: string,
  pathname: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return pathname == to;
  }
  return pathname.includes(to);
}

const BackofficeLayout: React.FC = () => {
  const location = useLocation();
  const project = useAppSelector(state => state.navbarSlice.selectedProject)
  const currentUser = getUser()

  return (
    <Box sx={{ display: "flex" }}>
      <FormProjectDialog />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white'
        }}
      >
        <BackofficeTopNavigation />
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={project?.name || "Project name"} secondary="Software Project" />
            </ListItem>
          </List>
          <Divider/>
          <List>
            {menuList.map((menu, index) => {
              if (currentUser?.roles.some(x => menu.roles.some(y => y == x.name))) {
                return (
                  <ListItem key={index} disablePadding href={menu.link} component={LinkBehavior}>
                    <ListItemButton selected={isMenuActive(menu.link, location.pathname, true)} >
                      <ListItemIcon>
                        <menu.icon />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{color: 'black'}} primary={menu.title} />
                    </ListItemButton>
                  </ListItem>
                )
              }
              return
            })}

          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default BackofficeLayout;
