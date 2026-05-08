import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import http from "../lib/http";

function DeleteBookModal({ open, onClose, book, onBookDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [serverError, setServerError] = useState(null);

  async function handleDelete() {
    try {
      setDeleting(true);
      setServerError(null);

      await http.delete(`/books/${book._id}`);

      onBookDeleted?.(book._id);
      handleClose();
    } catch {
      setServerError("Failed to delete the book. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  function handleClose() {
    if (deleting) return;

    setServerError(null);
    onClose();
  }

  if (!book) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "calc(100% - 32px)", sm: 440 },
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
          outline: "none",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 3,
            py: 2.25,
            borderBottom: "1px solid #e8eaed",
          }}
        >
          <DeleteIcon
            sx={{
              color: "#c5221f",
              fontSize: 22,
            }}
          />

          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#202124",
              flex: 1,
            }}
          >
            Delete book
          </Typography>

          <IconButton
            size="small"
            onClick={handleClose}
            disabled={deleting}
            sx={{
              color: "#5f6368",
              "&:hover": {
                backgroundColor: "#f1f3f4",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Body */}
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.92rem",
              color: "#3c4043",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                color: "#202124",
              }}
            >
              {" "}
              "{book.title}"
            </Box>
            ?
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem",
              color: "#80868b",
              lineHeight: 1.5,
            }}
          >
            This action cannot be undone.
          </Typography>

          {serverError && (
            <Typography
              sx={{
                mt: 2,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#c5221f",
              }}
            >
              {serverError}
            </Typography>
          )}

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.25,
              mt: 4,
            }}
          >
            <Button
              onClick={handleClose}
              disabled={deleting}
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                color: "#5f6368",
                borderRadius: "8px",
                px: 2,
                "&:hover": {
                  backgroundColor: "#f1f3f4",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="contained"
              disableElevation
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
                backgroundColor: "#c5221f",
                "&:hover": {
                  backgroundColor: "#a50e0e",
                },
                "&:disabled": {
                  backgroundColor: "#f3c7c5",
                  color: "#fff",
                },
                minWidth: 92,
              }}
            >
              {deleting ? (
                <CircularProgress
                  size={16}
                  thickness={4}
                  sx={{ color: "#fff" }}
                />
              ) : (
                "Delete"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteBookModal;
