import { User, UserProfileForm } from "@/models";
import { fetchCurrentUser } from "@/services/AuthenticationService";
import { updateCurrentUser } from "@/services/UserService";
import { useAppDispatch } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/snackbarSlice";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  position: Yup.string().required(),
  email: Yup.string().required(),
  phone: Yup.string().required(),
  changePassword: Yup.boolean(),
  newPassword: Yup.string().when("changePassword", {
    is: true,
    then(schema) {
      return schema.required();
    },
  }),
});

const Profile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const formik = useFormik<UserProfileForm>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      changePassword: false,
      newPassword: "",
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      const updatedUserProfile = await updateCurrentUser(values);
      if (updatedUserProfile) {
        await fetchData();
        dispatch(
          showSnackbar({
            isOpen: true,
            message: "Profil telah diperbarui",
            variant: "success",
          })
        );
      } else {
        dispatch(
          showSnackbar({
            isOpen: true,
            message: "Profil gagal diperbarui",
            variant: "error",
          })
        );
      }
    },
  });

  async function fetchData() {
    const user = await fetchCurrentUser();
    if (user) {
      setCurrentUser(currentUser);
      formik.setValues({
        name: user.name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        changePassword: false,
        newPassword: "",
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h1">Profile</Typography>
      </Grid>
      <Grid item md={5}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  label="Nama*"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  label="Posisi*"
                  name="position"
                  onChange={formik.handleChange}
                  value={formik.values.position}
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  label="Email*"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  label="No. Telepon"
                  name="phone"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
              </Grid>
              <Grid item md={12}>
                <FormControlLabel
                  label="Ubah password?"
                  control={
                    <Checkbox
                      name="changePassword"
                      onChange={formik.handleChange}
                      value={formik.values.changePassword}
                    />
                  }
                />
              </Grid>
              {formik.values.changePassword && (
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    label="Password baru*"
                    name="newPassword"
                    onChange={formik.handleChange}
                    value={formik.values.newPassword}
                  />
                </Grid>
              )}
            </Grid>
            <Grid item md={12} mt={2}>
              <LoadingButton
                variant="contained"
                loading={formik.isSubmitting}
                onClick={formik.submitForm}
              >
                Simpan
              </LoadingButton>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;
