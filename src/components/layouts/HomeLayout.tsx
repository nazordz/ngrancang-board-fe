import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Outlet } from "react-router-dom"
import logo from '../../assets/images/logo.svg'
import Button from '@mui/material/Button'

function Home() {
  return (
    <Box>
      <AppBar position="static" color='transparent'>
        <Container maxWidth="xl">
          <Toolbar >
            <img src={logo} alt="logo" style={{ width: 60 }} />
            <Typography
              variant='h1'
              component="div"
              color="secondary"
              sx={{ display: {xs: 'none', lg: 'block', xl: 'block'} }}
            >
              Ngrancang Board
            </Typography>
            <Box display="flex" justifyContent="end" flexGrow={1}>
              <Button
                sx={{mx: 2}}
                variant="contained"
                color="primary"
              >
                  Login
              </Button>
              <Button
                sx={{mx: 2}}
                variant="contained"
                color='secondary'
              >
                  Daftar
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container disableGutters sx={{margin: 0}} maxWidth={false}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default Home
