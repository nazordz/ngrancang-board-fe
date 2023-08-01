import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from 'yup';
import { useFormik } from "formik";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import { SignIn } from "@/services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { userLogged } from "@/store/slices/authenticateSlice";
import jwtDecode from "jwt-decode";
import { JwtPayload } from "@/models";
import { SnackbarState, showSnackbar } from "@/store/slices/snackbarSlice";

interface Values {
  email: string
  password: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Format tidak sesuai").required('Email harus diisi'),
  password: Yup.string()
    .required("Password harus diisi")
    .min(8, "Password minimal 8 karakter"),
})

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const formik = useFormik<Values>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      const request = await SignIn(values.email, values.password);
      if (request) {
        dispatch(userLogged(jwtDecode<JwtPayload>(request.access_token).user))
        navigate('/projects')
      } else {
        const snackbarState: SnackbarState = {
          isOpen: true,
          message: "Password salah / user nonaktif",
          variant: "warning",
        };
        dispatch(showSnackbar(snackbarState));
      }
    },
  });
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      height="100vh"
    >
      <Container maxWidth="xs" >
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography textAlign="center" variant="h4">Login</Typography>
              <TextField
                variant="standard"
                label="Email*"
                name="email"
                placeholder="Masukan email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={Boolean(formik.errors.email) && formik.touched.email}
                onBlur={formik.handleBlur}
                helperText={(formik.touched.email) && formik.errors.email}
              />
              <TextField
                variant="standard"
                label="Password*"
                name="password"
                type={showPassword ? 'text' : "password"}
                placeholder="Masukan password"
                onChange={formik.handleChange}
                value={formik.values.password}
                error={Boolean(formik.errors.password) && formik.touched.password}
                onBlur={formik.handleBlur}
                helperText={(formik.touched.password) && formik.errors.password}
                onKeyDown={e => e.key == 'Enter' && formik.submitForm()}
                InputProps={{
                  endAdornment: <>
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  </>
                }}
              />
              <LoadingButton
                loading={formik.isSubmitting}
                variant="contained"
                color="primary"
                onClick={() => formik.submitForm()}
              >
                Login
              </LoadingButton>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
