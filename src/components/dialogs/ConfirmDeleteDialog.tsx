import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleDialogConfirmDelete } from '@/store/slices/confirmDeleteSlice'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog: React.FC = () => {
  // const selector = useAppSelector(state => state.confirmDeleteSlice)
  const dispatch = useAppDispatch()

  return (
    <Dialog
        open={false}
        onClose={() => dispatch(toggleDialogConfirmDelete())}
      >
        <DialogTitle>
          Hapus story ?
        </DialogTitle>
        <DialogContent>
          Apakah anda yaking untuk menghapusnya?
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary">Batal</Button>
          <Button variant="contained" color="error">Hapus</Button>
        </DialogActions>
      </Dialog>
  )
}

export default ConfirmDeleteDialog;
