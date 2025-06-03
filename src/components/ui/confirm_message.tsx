import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";

interface ConfirmMessageProps {
  open: boolean;
  message: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmMessage({
  open,
  message,
  loading,
  onConfirm,
  onCancel,
}: ConfirmMessageProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      slotProps={{
        paper: {
          sx: {
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title">تأكيد</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirm-dialog-description"
          sx={{ whiteSpace: "pre-line", width: "400px" }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="gap-4 w-full">
        <Button onClick={onCancel} color="inherit">
          إلغاء
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
          {loading ? <CircularProgress size={20} color="inherit" /> : "تأكيد"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
