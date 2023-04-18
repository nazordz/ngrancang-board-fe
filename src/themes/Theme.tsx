import { ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { LinkProps } from "@mui/material/Link";
import { green } from "@mui/material/colors";

type Props = {
  children: React.ReactNode;
};

export const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

function Theme({ children }: Props) {
  const theme = createTheme({
    // palette: {
    //   primary: {
    //     main: "#33CC99",
    //     contrastText: "#fff",
    //   },
    //   secondary: {
    //     main: "#64748B",
    //     contrastText: "#fff",
    //   },
    // },
    // typography: {
    //   fontFamily: "Public Sans",
    // },

    components: {
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
    },
  });
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default Theme;
