import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Outlet } from "react-router-dom"
import logo from '../../assets/images/logo.svg'
import Button from '@mui/material/Button'
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
function Home() {
  return (
    <Box>
      <AppBar position="static" color='default'>
        <Container maxWidth="xl">
          <Toolbar >
            <Typography
              variant='h5'
              sx={{ display: {xs: 'none', lg: 'block', xl: 'block'} }}
            >
              Ngrancang Board
            </Typography>
            <Box display="flex" justifyContent="end" flexGrow={1}>
              <Button
                sx={{mx: 2}}
                href="/login"
                variant='contained'
              >
                Login
              </Button>
              <Button
                sx={{mx: 2}}
                variant="contained"
                color='secondary'
                href="/register"
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
