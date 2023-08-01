import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
} from "@mui/material";
import React from "react";
import logo from "@/assets/images/ngrancang-logo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccountCircle,
  Logout,
  PersonAdd,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SignOut, getUser } from "@/services/AuthenticationService";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDialogProject } from "@/store/slices/formProjectSlice";
import { fetchProjects, selectProject } from "@/store/slices/navbarSlice";
import { userLogout } from "@/store/slices/authenticateSlice";
import { LinkBehavior } from "@/theme";

const BackofficeTopNavigation: React.FC = () => {
  const [anchorElAccount, setAnchorElAccount] =
    React.useState<null | HTMLElement>(null);
  const [openAccount, setOpenAccount] = React.useState(false);
  const [anchorElProject, setAnchorElProject] =
    React.useState<null | HTMLElement>(null);
  const [openProject, setOpenProject] = React.useState(false);
  const projects = useAppSelector((state) => state.navbarSlice.projects);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = getUser();

  const toggleMenuAccount = () => {
    setOpenAccount(!openAccount);
  };

  const toggleMenuProject = () => {
    setOpenProject(!openProject);
  };

  function logout() {
    dispatch(userLogout());
    SignOut();
    navigate("/");
    setOpenAccount(false);
    setAnchorElAccount(null);
  }

  React.useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  return (
    <Toolbar>
      <Stack spacing={2} direction="row" alignItems="center">
        <Box
          className="button-logo"
          onClick={() => {
            navigate("/active-sprint");
          }}
        >
          <Box component="img" src={logo} alt="image" sx={{ height: "50px" }} />
        </Box>
        {/* <Box>
          <Button
            variant="text"
            color="primary"
            endIcon={<ExpandMoreIcon />}
          >
            Your Work
          </Button>
        </Box> */}
        <Box>
          <Button
            variant="text"
            color="secondary"
            endIcon={<ExpandMoreIcon />}
            onClick={(event) => {
              setAnchorElProject(event.currentTarget);
              toggleMenuProject();
            }}
          >
            Project
          </Button>
          <Menu
            open={openProject}
            anchorEl={anchorElProject}
            transformOrigin={{ horizontal: "center", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            onClick={toggleMenuProject}
            PaperProps={{
              sx(theme) {
                return {
                  width: 280,
                };
              },
            }}
          >
            {projects ? (
              projects.content?.map((project, index) => (
                <MenuItem
                  key={index}
                  onClick={() => dispatch(selectProject(project))}
                >
                  <ListItemIcon>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={project.name}
                    secondary="Software Project"
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem>
                <ListItemText>Tidak ada project</ListItemText>
              </MenuItem>
            )}
            <Divider />
            <MenuItem component={LinkBehavior} href="/projects">
              Lihat semua project
            </MenuItem>
            <MenuItem onClick={() => dispatch(toggleDialogProject())}>
              Buat Project
            </MenuItem>
          </Menu>
        </Box>
        {/* <Box>
          <Button variant="contained">Buat</Button>
        </Box> */}
      </Stack>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={(event) => {
          setAnchorElAccount(event.currentTarget);
          toggleMenuAccount();
        }}
      >
        <AccountCircle color="action" />
      </IconButton>
      <Menu
        anchorEl={anchorElAccount}
        id="account-menu"
        open={openAccount}
        onClose={() => setOpenAccount(false)}
        onClick={toggleMenuAccount}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            setOpenAccount(false);
            navigate("/profile");
          }}
        >
          <Avatar /> {user?.name}
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Toolbar>
  );
};

export default React.memo(BackofficeTopNavigation);
