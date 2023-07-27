import { FormProjectRequest } from "@/models";
import { fetchProjectById, saveProject, updateProject } from "@/services/ProjectService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/navbarSlice";
import { showSnackbar } from "@/store/slices/snackbarSlice";
import { getAcronym } from "@/utils/helper";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import ImageIcon from "@mui/icons-material/Image";
import { LoadingButton } from "@mui/lab";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Nama harus diisi")
    .min(2, "Terlalu pendek")
    .max(100, "Terlalu panjang"),
  key: Yup.string().required("Key harus diisi"),
  description: Yup.string().nullable(),
  files: Yup.mixed().nullable(),
});

const InputHidden = styled("input")({
  display: "none",
});

const Setting: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedProject = useAppSelector(state => state.navbarSlice.selectedProject)
  const [profilePicture, setProfilePicture] = React.useState('');
  useEffect(() => {
    onReady()
  }, [])

  async function onReady() {
    if (selectedProject) {
      const prj = await fetchProjectById(selectedProject.id)
      if (prj) {
        formik.setFieldValue('name', prj.name)
        formik.setFieldValue('key', prj.key)
        formik.setFieldValue('description', prj.description)
        setProfilePicture(prj.avatar)
      }
    }
  }

  const initialValues: FormProjectRequest = {
    name: "",
    description: "",
    key: "",
    avatar: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    async onSubmit(values, formikHelpers) {
      var prj = await updateProject(values, selectedProject!.id);
      if (prj) {
        dispatch(
          showSnackbar({
            isOpen: true,
            message: "Project berhasil disimpan",
            variant: "success",
          })
        );
        dispatch(fetchProjects());
        // formik.resetForm();
        // onReady()

      } else {
        dispatch(
          showSnackbar({
            isOpen: true,
            message: "Project gagal disimpan",
            variant: "warning",
          })
        );
      }
    },
  });

  return (
    <Card sx={{ maxWidth: { lg: 500 } }}>
      <CardContent>
        <Grid container spacing={2} my={2}>
          <Grid item md={12}>
            <TextField
              label="Nama*"
              name="name"
              placeholder="Masukan Nama"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue("name", event.target.value);
                if (event.target.value) {
                  formik.setFieldValue("key", getAcronym(event.target.value));
                }
              }}
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Key*"
              name="key"
              fullWidth
              value={formik.values.key}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item md={12}>
            <TextField
              value={formik.values.description}
              onChange={formik.handleChange}
              label="Deskripsi"
              name="description"
              placeholder="Masukan Deskripsi"
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid
            container
            item
            md={12}
            direction="column"
            alignContent="center"
            spacing={1}
          >
            <Grid item>
              <Typography textAlign="center">Upload icon</Typography>
            </Grid>
            <Grid item justifyContent="center">
              {formik.values.avatar ? (
                <Avatar
                  src={URL.createObjectURL(formik.values.avatar)}
                  sx={{
                    width: 128,
                    height: 128,
                  }}
                />
              ) : profilePicture ? (
                <Avatar
                  src={import.meta.env.VITE_IMAGE_BASE + profilePicture}
                  sx={{
                    width: 128,
                    height: 128,
                  }}
                />
              ) : (
                <ImageIcon sx={{ fontSize: 128 }} color="action" />
              )}
            </Grid>
            <Grid item display="flex" justifyContent="center">
              <label htmlFor="icon-profile-picture">
                <InputHidden
                  accept="image/*"
                  id="icon-profile-picture"
                  type="file"
                  onChange={(event) => {
                    formik.setFieldValue("avatar", event.target.files![0]);
                  }}
                />
                <Button variant="outlined" component="span">
                  Ganti icon
                </Button>
              </label>
            </Grid>
          </Grid>
          <Divider  />
          <Grid item md={12} mt={2} >
            <LoadingButton
              variant="contained"
              loading={formik.isSubmitting}
              onClick={formik.submitForm}
            >
              Simpan
            </LoadingButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Setting;
