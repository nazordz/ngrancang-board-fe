import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeProjectDialog, setFormProjectId, toggleDialogProject } from "@/store/slices/formProjectSlice";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { getAcronym } from "@/utils/helper";
import ImageIcon from "@mui/icons-material/Image";
import { FormProjectRequest } from "@/models";
import { fetchProjectById, saveProject } from "@/services/ProjectService";
import { showSnackbar } from "@/store/slices/snackbarSlice";

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

interface IProps {
  isOpen: boolean
  onSuccess: () => void
}

const ProjectDialog: React.FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(state => state.formProjectDialog.id)
  const isOpen = useAppSelector(state => state.formProjectDialog.isOpen)
  const [profilePicture, setProfilePicture] = React.useState('');

  const initialValues: FormProjectRequest = {
    name: "",
    description: "",
    key: "",
    avatar: null,
  };

  async function fetchProject(id: string) {
    var myProject = await fetchProjectById(id)
    if (myProject) {
      formik.setValues({
        key: myProject.key,
        name: myProject.name,
        description: myProject.description,
        avatar: null
      })
      setProfilePicture(myProject.avatar)

    }
  }

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProject(projectId)
    }
  }, [isOpen, projectId])

  const formik = useFormik({
    initialValues,
    validationSchema,
    async onSubmit(values, formikHelpers) {
      var prj = await saveProject(values)
      if (prj) {
        dispatch(showSnackbar({
          isOpen: true,
          message: 'Project berhasil disimpan',
          variant: 'success'
        }))
        props.onSuccess()
        formik.resetForm();
      } else {
        dispatch(showSnackbar({
          isOpen: true,
          message: 'Project gagal disimpan',
          variant: 'warning'
        }))
      }
      dispatch(closeProjectDialog())
      setProfilePicture('')
    },
  });

  function closeDialog() {
    dispatch(closeProjectDialog())
    setProfilePicture('')
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={() => closeDialog()}
    >
      <DialogTitle>Form Project</DialogTitle>
      <DialogContent>
        <Box>
          <Grid sx={{ minWidth: { lg: 500 } }} container spacing={2} my={2}>
            <Grid item md={12}>
              <TextField
                label="Nama*"
                name="name"
                placeholder="Masukan Nama"
                value={formik.values.name}
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
                <label htmlFor="icon-button-file">
                  <InputHidden
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={(event) => {
                      console.log(event.target.files);

                      formik.setFieldValue("avatar", event.target.files![0]);
                    }}
                  />
                  <Button variant="outlined" component="span">
                    Ganti icon
                  </Button>
                </label>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => dispatch(toggleDialogProject())}
        >
          Batal
        </Button>
        <LoadingButton
          variant="contained"
          loading={formik.isSubmitting}
          onClick={formik.submitForm}
        >
          Simpan
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;
