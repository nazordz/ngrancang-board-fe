import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

function ConfirmDeleteStoryDialog(showConfirmDeleteDialog: boolean, setShowConfirmDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>, toggleDeleteDialog: () => void, handleDeleteStory: () => Promise<void>) {
  return <Dialog
    open={showConfirmDeleteDialog}
    onClose={() => setShowConfirmDeleteDialog(false)}
  >
    <DialogTitle>
      Hapus story ?
    </DialogTitle>
    <DialogContent>
      Apakah anda yaking untuk menghapusnya?
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" color="secondary" onClick={() => toggleDeleteDialog()}>Batal</Button>
      <Button variant="contained" color="error" onClick={() => handleDeleteStory()}>Hapus</Button>
    </DialogActions>
  </Dialog>;
}

export default ConfirmDeleteStoryDialog;
