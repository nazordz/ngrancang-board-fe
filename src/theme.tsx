import React from 'react';
import { createTheme } from '@mui/material/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';

export const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: 'Roboto'
    // body1: {
    //   fontWeight: 400,
    //   fontSize: 12,
    // },
    // h1: {
    //   fontWeight: 600,
    //   fontSize: 24,
    // },
    // h2: {
    //   fontWeight: 600,
    //   fontSize: 18,
    // },
    // h3: {
    //   fontWeight: 400,
    //   fontSize: 18,
    // }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2ecc71',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f1c40f',
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize'
        }
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  }
});

export default theme;
