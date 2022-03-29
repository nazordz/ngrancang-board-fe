import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  typography: {
    body1: {
      fontWeight: 400,
      fontSize: 12,
    },
    h1: {
      fontWeight: 700,
      fontSize: 24,
    },
    h2: {
      fontWeight: 600,
      fontSize: 18,
    },
    h3: {
      fontWeight: 400,
      fontSize: 18,
    }
  },
  palette: {
    primary: {
      main: '#4A69BD'
    },
    secondary: {
      main: '#0A3D62'
    }
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            textTransform: 'capitalize'
          }
        }
      ]
    }
  }
});

export default theme;
