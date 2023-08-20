import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface IconfirmDialog {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: React.FC<IconfirmDialog> = (props) => {
  return (
    <Dialog open={props.isOpen}>
      <DialogTitle>
        {props.title}
      </DialogTitle>
      <DialogContent>
        <Typography>{props.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onCancel()} variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => props.onConfirm()} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ConfirmDialog);
