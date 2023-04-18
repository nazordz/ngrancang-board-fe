import { ThemeProvider } from '@mui/material'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import theme from './theme'
import ReactDOM from 'react-dom/client'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
