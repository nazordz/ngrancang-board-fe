import React from 'react'
import { useRoutes } from 'react-router-dom'
import router from './routers/Router'
import "./assets/styles/App.scss"
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import AppRouter from './routers/Router'
import SnackbarApp from './components/global/SnackbarApp'
import 'dayjs/locale/id'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  const Routes = () => useRoutes(router)
  dayjs.locale('id')

  return (
      <React.Suspense
        fallback={
          <Grid container justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Grid>
        }>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackbarApp />
          <Routes/>
        </LocalizationProvider>
      </React.Suspense>
  )
}

export default App
