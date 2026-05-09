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
import { getModalSurfaceSx } from "./bookModalStyles";

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
      <Box sx={getModalSurfaceSx({ xs: "calc(100% - 32px)", sm: 460 })}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 3,
            py: 2.25,
            borderBottom: "1px solid rgba(124,77,43,0.10)",
            background:
              "linear-gradient(135deg, rgba(143,61,47,0.06), rgba(124,77,43,0.04))",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "14px",
              display: "grid",
              placeItems: "center",
              backgroundColor: "rgba(143,61,47,0.10)",
              border: "1px solid rgba(143,61,47,0.14)",
            }}
          >
            <DeleteIcon sx={{ color: "#8f3d2f", fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#24180f",
                lineHeight: 1.05,
              }}
            >
              Remove from shelf?
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.82rem",
                color: "#7b6757",
              }}
            >
              This will delete the record for this copy.
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            disabled={deleting}
            sx={{
              color: "#6b5847",
              "&:hover": { backgroundColor: "rgba(124,77,43,0.10)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ px: 3, pt: 3, pb: 3 }}>
          <Typography
            sx={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.95rem",
              color: "#3d3025",
              lineHeight: 1.7,
            }}
          >
            Remove{" "}
            <Box component="span" sx={{ fontWeight: 800, color: "#24180f" }}>
              “{book.title}”
            </Box>{" "}
            from Shelfy? You can add it again later, but this entry will leave
            the shelf.
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.82rem",
              color: "#7b6757",
            }}
          >
            This action cannot be undone.
          </Typography>

          {serverError && (
            <Typography
              sx={{
                mt: 2,
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.8rem",
                color: "#8f3d2f",
              }}
            >
              {serverError}
            </Typography>
          )}

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
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "0.875rem",
                textTransform: "none",
                color: "#6b5847",
                borderRadius: "12px",
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(124,77,43,0.08)",
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
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: "12px",
                px: 2.5,
                background:
                  "linear-gradient(135deg, #8f3d2f 0%, #b05746 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7b3126 0%, #a04839 100%)",
                },
                "&:disabled": {
                  backgroundColor: "#dfb7af",
                  color: "#fff",
                },
                minWidth: 104,
              }}
            >
              {deleting ? (
                <CircularProgress size={16} thickness={4} sx={{ color: "#fff" }} />
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
