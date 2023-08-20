import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ISignupRequest, User } from "@/models";
import { useAppDispatch } from "@/store/hooks";
import { register } from "@/services/AuthenticationService";
import { SnackbarState, showSnackbar } from "@/store/slices/snackbarSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { fetchUserByid, updateUser } from "@/services/UserService";

interface IProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const FormUserDialog: React.FC<IProps> = (props) => {
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
      // .required("Password harus diisi")
      .when([], {
        is() {
          return !props.id
        },
        then(schema) {
          return schema.required("Password harus diisi")
        }
      })
      .min(8, "Password minimal 8 karakter"),
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  function onClose() {
    setSelectedUser(null);
    props.onClose();
  }

  async function fetchSelectedUser(id: string) {
    const fetchedUser = await fetchUserByid(id);
    setSelectedUser(fetchedUser);
    if (fetchedUser){
      formik.setValues({
        email: fetchedUser?.email,
        name: fetchedUser.name,
        password: '',
        phone: fetchedUser.phone,
        position: fetchedUser.position
      })
    }
  }

  useEffect(() => {
    if (props.id && props.isOpen) {
      fetchSelectedUser(props.id);
    }
  }, [props.id, props.isOpen]);

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
      var user = null;
      var snackbarState: SnackbarState = {
        isOpen: true,
        message: "User berhasil diperbarui",
        variant: "success",
      };
      if (props.id) {
        user = await updateUser(props.id, {
          email: values.email,
          name: values.name,
          phone: values.phone,
          position: values.position
        })
        snackbarState.message = 'User berhasil diperbarui';
      } else {
        user = await register(values);
        snackbarState.message = 'User berhasil dibuat';
      }
      if (user != null) {

        dispatch(showSnackbar(snackbarState));
        props.onSaved();
        onClose();
      } else {
        snackbarState = {
          isOpen: true,
          message: "Terdapat kesalahan",
          variant: "warning",
        };
        dispatch(showSnackbar(snackbarState));
      }
    },
  });

  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={props.isOpen}
      onClose={props.onClose}
    >
      <DialogTitle>
        Form User
        <IconButton
          aria-label="close"
          onClick={() => onClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack direction="column" spacing={2}>
          <TextField
            variant="outlined"
            label="Nama*"
            name="name"
            placeholder="Masukan nama"
            onChange={formik.handleChange}
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.errors.name}
          />
          <TextField
            variant="outlined"
            label="Email*"
            name="email"
            placeholder="Masukan email"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.errors.email}
          />
          <TextField
            variant="outlined"
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
            variant="outlined"
            label="Posisi*"
            name="position"
            placeholder="Masukan posisi"
            onChange={formik.handleChange}
            value={formik.values.position}
            error={formik.touched.position && Boolean(formik.errors.position)}
            helperText={formik.errors.position}
          />
          {!props.id && (
            <TextField
              variant="outlined"
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
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => props.onClose()}>
          Batal
        </Button>
        <LoadingButton
          loading={formik.isSubmitting}
          variant="contained"
          color="primary"
          onClick={() => formik.submitForm()}
        >
          Simpan
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default FormUserDialog;
