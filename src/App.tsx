import React from 'react'
import { useRoutes } from 'react-router-dom'
import router from './routers/Router'
import "./assets/styles/App.scss"
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

function App() {
  const Routes = () => useRoutes(router)

  return (
      <React.Suspense
        fallback={
          <Grid container justifyContent="center" >
            <CircularProgress />
          </Grid>
        }>
        <Routes/>
      </React.Suspense>
  )
}

export default App
