import { LoadingButton } from "@mui/lab";
import {
  Box,
  Container,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import http from "@/utils/http";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { SnackbarState } from "@/store/slices/snackbarSlice";
import { showSnackbar } from "@/store/slices/snackbarSlice";
import { register } from "@/services/AuthenticationService";
import { ISignupRequest } from "@/models";
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Nama harus diisi"),
  email: Yup.string()
    .email("Format tidak sesuai")
    .required("Email harus diisi"),
  phone: Yup.string()
    .required("Nomor telepon harus diisi")
    .min(6, "Telepon minimal 6 karakter")
    .max(35, "Telepon maksimal 35 karakter")
    .matches(/^[^.]*$/, {
      message: "No period",
    })
    .matches(/^[^!@#$%^&*+=<>:;|~]*$/, {
      message: "Tidak boleh simbol",
    })
    .matches(/^[\s\d)(-]+$/, {
      message: "Format tidak sesuai",
    }),
  position: Yup.string().required("Posisi harus diisi"),
  password: Yup.string()
    .required("Password harus diisi")
    .min(8, "Password minimal 8 karakter"),
});

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik<ISignupRequest>({
    initialValues: {
      email: "",
      name: "",
      password: "",
      phone: "",
      position: "",
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      const user = await register(values);
      if (user != null) {
        const snackbarState: SnackbarState = {
          isOpen: true,
          message: "User berhasil didaftarkan. Mohon tunggu konfirmasi",
          variant: "success",
        };
        dispatch(showSnackbar(snackbarState));
        navigate("/login");
      } else {
        const snackbarState: SnackbarState = {
          isOpen: true,
          message: "Terdapat kesalahan",
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
      <Container maxWidth="xs">
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography textAlign="center" variant="h4">
                Register
              </Typography>
              <TextField
                variant="standard"
                label="Nama*"
                name="name"
                placeholder="Masukan nama"
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.errors.name}
              />
              <TextField
                variant="standard"
                label="Email*"
                name="email"
                placeholder="Masukan email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.errors.email}
              />
              <TextField
                variant="standard"
                label="Nomor Telepon*"
                name="phone"
                type="tel"
                placeholder="Masukan nomor telepon"
                onChange={formik.handleChange}
                value={formik.values.phone}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.errors.phone}
              />
              <TextField
                variant="standard"
                label="Posisi*"
                name="position"
                placeholder="Masukan posisi"
                onChange={formik.handleChange}
                value={formik.values.position}
                error={formik.touched.position && Boolean(formik.errors.position)}
                helperText={formik.errors.position}
              />
              <TextField
                variant="standard"
                label="Password*"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukan password"
                onChange={formik.handleChange}
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <>
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
                  ),
                }}
              />
              <LoadingButton
                loading={formik.isSubmitting}
                variant="contained"
                color="primary"
                onClick={() => formik.submitForm()}
              >
                Register
              </LoadingButton>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
