import { AppBar, Avatar, Box, Button, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react'
import logo from "@/assets/images/ngrancang-logo.png"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const YourWork: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const toggleMenu = () => {
    setOpen(!open);
  }
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant='h5'>
          Pekerjaan mu
        </Typography>
        <Box>
          <Typography variant='h6' >
            Baru dibuka
          </Typography>

        </Box>
    </Box>
  )
  // return (
  //   <Box sx={{ display: "flex" }}>
  //     <AppBar
  //       position="fixed"
  //       sx={{
  //         zIndex: (theme) => theme.zIndex.drawer + 1,
  //         backgroundColor: 'white'
  //       }}
  //     >
  //       <Toolbar>
  //         <Grid container flexGrow={1} spacing={2} alignItems="center">
  //           <Grid item>
  //           <Box
  //             className="button-logo"
  //             onClick={() => {
  //               navigate('/backoffice')
  //             }}
  //           >
  //             <Box component="img" src={logo} alt="image" sx={{height: "50px"}} />
  //           </Box>
  //           </Grid>
  //           <Grid item>
  //             <Button variant="text" color="secondary" endIcon={<ExpandMoreIcon />}>
  //               Project
  //             </Button>
  //           </Grid>
  //           <Grid item>
  //             <Button variant="contained">
  //               Buat
  //             </Button>
  //           </Grid>
  //         </Grid>
  //         <Box sx={{ flexGrow: 1 }} />
  //         <IconButton
  //           size="large"
  //           aria-label="account of current user"
  //           aria-controls="menu-appbar"
  //           aria-haspopup="true"
  //           color="inherit"
  //           onClick={(event) => {
  //             setAnchorEl(event.currentTarget);
  //             toggleMenu()
  //           }}
  //         >
  //           <AccountCircleIcon color="action" />
  //         </IconButton>
  //         <Menu
  //           anchorEl={anchorEl}
  //           id="account-menu"
  //           open={open}
  //           onClose={() => setOpen(false)}
  //           onClick={toggleMenu}
  //           PaperProps={{
  //             elevation: 0,
  //             sx: {
  //               overflow: "visible",
  //               filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
  //               mt: 1.5,
  //               "& .MuiAvatar-root": {
  //                 width: 32,
  //                 height: 32,
  //                 ml: -0.5,
  //                 mr: 1,
  //               },
  //               "&:before": {
  //                 content: '""',
  //                 display: "block",
  //                 position: "absolute",
  //                 top: 0,
  //                 right: 14,
  //                 width: 10,
  //                 height: 10,
  //                 bgcolor: "background.paper",
  //                 transform: "translateY(-50%) rotate(45deg)",
  //                 zIndex: 0,
  //               },
  //             },
  //           }}
  //           transformOrigin={{ horizontal: "right", vertical: "top" }}
  //           anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
  //         >
  //           <MenuItem>
  //             <Avatar /> Profile
  //           </MenuItem>
  //           <MenuItem>
  //             <Avatar /> My account
  //           </MenuItem>
  //           <Divider />
  //           <MenuItem>
  //             <ListItemIcon>
  //               <SettingsIcon fontSize="small" />
  //             </ListItemIcon>
  //             Settings
  //           </MenuItem>
  //           <MenuItem>
  //             <ListItemIcon>
  //               <LogoutIcon fontSize="small" />
  //             </ListItemIcon>
  //             Logout
  //           </MenuItem>
  //         </Menu>
  //       </Toolbar>
  //     </AppBar>
  //     <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
  //       <Toolbar></Toolbar>
  //       <Typography variant='h5'>
  //         Pekerjaan mu
  //       </Typography>
  //       <Box>
  //         <Typography variant='h6' >
  //           Baru dibuka
  //         </Typography>

  //       </Box>
  //     </Box>
  //   </Box>
  // )
}

export default YourWork;
