import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField
} from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { createSprint } from '@/services/SprintService';
import { CreateSprintRequest } from '@/models';
import { getUser } from '@/services/AuthenticationService';
import { useAppSelector } from '@/store/hooks';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface IInitialValues {
  sprint_name: string;
  sprint_goal: string;
  start_date: dayjs.Dayjs;
  end_date: dayjs.Dayjs;
}

const validationSchema = Yup.object().shape({
  sprint_name: Yup.string().required("Harus diisi"),
  sprint_goal: Yup.string().required("Harus diisi"),
  start_date: Yup.string().required("Harus diisi"),
  end_date: Yup.string().required("Harus diisi"),
})

const FormSprintDialog: React.FC<IProps> = (props) => {

  const currentProject = useAppSelector(state => state.navbarSlice.selectedProject)

  const formik = useFormik<IInitialValues>({
    initialValues: {
      sprint_name: '',
      sprint_goal: '',
      start_date: dayjs(),
      end_date: dayjs().add(2, 'weeks')
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      const currentUser = getUser()!
      const data: CreateSprintRequest = {
        user_id: currentUser.id,
        project_id: currentProject!.id,
        sprint_name: values.sprint_name,
        sprint_goal: values.sprint_goal,
        start_date: values.start_date.format("YYYY-MM-DD"),
        end_date: values.end_date.format("YYYY-MM-DD")
      }
      const req = await createSprint(data)
      if (req) {
        props.onSuccess();
        formik.resetForm();
      }
    },
  })

  return  (
    <Dialog open={props.isOpen} onClose={props.onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        Form Sprint
        <IconButton
          aria-label="close"
          onClick={() => props.onClose()}
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
        <Grid sx={{ minWidth: { lg: 500 } }} container spacing={2}>
          <Grid item md={12}>
            <TextField
              label="Nama Sprint*"
              name='sprint_name'
              placeholder='Masukan nama sprint'
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.sprint_name}
              error={formik.touched.sprint_name && Boolean(formik.errors.sprint_name)}
              helperText={formik.touched.sprint_name && Boolean(formik.errors.sprint_name) ? formik.errors.sprint_name : ''}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Sprint Goal*"
              name='sprint_goal'
              fullWidth
              placeholder='Masukan tunjuan sprint'
              onChange={formik.handleChange}
              value={formik.values.sprint_goal}
              error={formik.touched.sprint_goal && Boolean(formik.errors.sprint_goal)}
              helperText={formik.touched.sprint_goal && Boolean(formik.errors.sprint_goal) ? formik.errors.sprint_goal : ''}
            />
          </Grid>
          <Grid item md={12}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <DatePicker
                format="DD-MM-YYYY"
                label="Tanggal mulai*"
                value={formik.values.start_date}
                onChange={(value) => {
                  formik.setFieldValue('start_date', value)
                }}
                slotProps={{
                  textField: {
                    error: formik.touched.start_date && Boolean(formik.errors.start_date),
                    helperText: formik.touched.start_date && Boolean(formik.errors.start_date) ? 'Harus diisi' : undefined
                  }
                }}
              />
              <DatePicker
                format="DD-MM-YYYY"
                label="Tanggal berakhir*"
                value={formik.values.end_date}
                onChange={value => {
                  formik.setFieldValue('end_date', value)
                }}
                slotProps={{
                  textField: {
                    error: formik.touched.end_date && Boolean(formik.errors.end_date),
                    helperText: formik.touched.end_date && Boolean(formik.errors.end_date) ? 'Harus diisi' : undefined
                  }
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={() => props.onClose()}>
          Batal
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={formik.isSubmitting}
          onClick={() => formik.submitForm()}
        >
          Simpan
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default FormSprintDialog;
