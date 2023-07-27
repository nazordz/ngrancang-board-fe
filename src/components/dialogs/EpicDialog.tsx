import React, { useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '@/store/hooks';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from '@mui/lab';
import { fetchEpicsByProjectId, storeEpics } from '@/services/EpicService';
import { Epic, EpicForm } from '@/models';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IInitialValues {
  formEpics: EpicForm[]
}

const validationSchema = Yup.object().shape({
  formEpics: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required(),
      project_id: Yup.string().required(),
      summary: Yup.string().required()
    })
  ).required()
})

const EpicDialog: React.FC<IProps> = (props) => {
  const currentProject = useAppSelector(state => state.navbarSlice.selectedProject);
  const [epics, setEpics] = useState<Epic[]>([]);

  const formik = useFormik<IInitialValues>({
    initialValues: {
      formEpics: []
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      await storeEpics(values.formEpics);
      fetchData();
      formik.resetForm();

    },
  })

  useEffect(() => {
    if (props.isOpen) {
      fetchData();
    }
  }, [props.isOpen]);

  async function fetchData() {
    if (currentProject) {
      var response = await fetchEpicsByProjectId(currentProject?.id)
      setEpics(response);
    }
  }

  function handleClose() {
    props.onClose();
    formik.resetForm();
  }

  function addEpicForm() {
    if (currentProject) {
      const newForm = {key: '', project_id: currentProject?.id, summary: ''}
      formik.setValues({
        formEpics: [
          ...formik.values.formEpics, newForm
        ]
      })
    }
  }

  function removeEpicForm(index: number) {
    var epcs = [...formik.values.formEpics];
    epcs.splice(index, 1);
    formik.setValues({
      formEpics: epcs
    })
  }

  return (
    <Dialog open={props.isOpen} onClose={handleClose} maxWidth="md" fullWidth={true}>
      <DialogTitle>
        Epics
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
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
        <TableContainer>
          <Table sx={{ minWidth: 650 }} >
            <TableHead>
              <TableRow>
                <TableCell>
                  Key
                </TableCell>
                <TableCell>
                  Summary
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {epics.map((epic, k) => (
                <TableRow key={k}>
                  <TableCell>{epic.key}</TableCell>
                  <TableCell>{epic.summary}</TableCell>
                </TableRow>
              ))}
              {(formik.values.formEpics.length > 0 && currentProject) &&
                formik.values.formEpics.map((ep, k) => (
                  <TableRow key={k}>
                    <TableCell>
                      <TextField
                        fullWidth
                        onChange={e => {
                          formik.setFieldValue(`formEpics[${k}]['key']`, e.target.value)
                        }}
                        name="key"
                        value={formik.values.formEpics[k].key}
                        label='Key*'
                        size='small'
                        helperText="Harus diisi & unik"
                      />
                    </TableCell>
                    <TableCell>
                      <Grid container>
                        <Grid item md={11}>
                          <TextField
                            fullWidth
                            onChange={e => {
                              formik.setFieldValue(`formEpics[${k}]['summary']`, e.target.value)
                            }}
                            name="summary"
                            value={formik.values.formEpics[k].summary}
                            label='Ringkasan*'
                            helperText="Harus diisi"
                            size='small' />
                        </Grid>
                        <Grid item md={1}>
                          <IconButton onClick={() => removeEpicForm(k)}>
                            <CloseIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))
              }

              <TableRow >
                <TableCell colSpan={2}>
                  <Stack direction="row" spacing={2}>
                    <Button variant='outlined' onClick={() => addEpicForm()}>
                      Tambah Epic
                    </Button>
                    {(formik.values.formEpics.length > 0 && currentProject) && (
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={formik.isSubmitting}
                        onClick={() => formik.submitForm()}
                      >
                        Simpan
                      </LoadingButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={() => handleClose()}>
          Tutup
        </Button>

      </DialogActions>
    </Dialog>
  )
}

export default React.memo(EpicDialog)
