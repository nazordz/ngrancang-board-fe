import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSnackbar } from "@/store/slices/snackbarSlice";
import { Alert, Snackbar } from "@mui/material";

const SnackbarApp: React.FC = () => {
  const snackbarState = useAppSelector((state) => state.snackbar);
  const dispatch = useAppDispatch();

  return (
    <Snackbar
      open={snackbarState.isOpen}
      autoHideDuration={6000}
      onClose={() => dispatch(closeSnackbar())}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
    >
      <Alert
        onClose={() => dispatch(closeSnackbar())}
        severity={snackbarState.variant}
        sx={{ width: "100%" }}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarApp;
