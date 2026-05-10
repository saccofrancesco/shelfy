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
import { getModalSurfaceSx } from "./ui";
import { uiTokens } from "../theme";

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
      <Box sx={getModalSurfaceSx({ xs: "calc(100% - 24px)", sm: 460 })}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: { xs: 2, sm: 3 },
            py: 2.25,
            borderBottom: `1px solid ${uiTokens.border.subtle}`,
            background:
              "linear-gradient(135deg, rgba(143,61,47,0.06), rgba(124,77,43,0.04))",
          }}
        >
          <Box sx={{ width: 40, height: 40, borderRadius: "14px", display: "grid", placeItems: "center", backgroundColor: "rgba(143,61,47,0.10)", border: `1px solid ${uiTokens.border.subtle}` }}>
            <DeleteIcon sx={{ color: uiTokens.color.danger, fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.15rem", color: uiTokens.color.ink, lineHeight: 1.05 }}>
              Remove from shelf?
            </Typography>
            <Typography sx={{ mt: 0.4, fontSize: "0.82rem", color: uiTokens.color.soft }}>
              This will delete the record for this copy.
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose} disabled={deleting} sx={{ color: uiTokens.color.muted, "&:hover": { backgroundColor: "rgba(124,77,43,0.10)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 3 }}>
          <Typography sx={{ fontSize: "0.95rem", color: "#3d3025", lineHeight: 1.7 }}>
            Remove <Box component="span" sx={{ fontWeight: 800, color: uiTokens.color.ink }}>“{book.title}”</Box> from Shelfy? You can add it again later, but this entry will leave the shelf.
          </Typography>

          <Typography sx={{ mt: 1, fontSize: "0.82rem", color: uiTokens.color.soft }}>
            This action cannot be undone.
          </Typography>

          {serverError && <Typography sx={{ mt: 2, fontSize: "0.82rem", color: uiTokens.color.danger }}>{serverError}</Typography>}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, mt: 4, flexWrap: "wrap" }}>
            <Button onClick={handleClose} disabled={deleting} sx={{ fontWeight: 800, color: uiTokens.color.muted, borderRadius: "12px" }}>
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={deleting} variant="contained" disableElevation sx={{ fontWeight: 800, borderRadius: "12px", px: 2.5, background: "linear-gradient(135deg, #8f3d2f 0%, #b05746 100%)", minWidth: 104 }}>
              {deleting ? <CircularProgress size={16} thickness={4} sx={{ color: "#fff" }} /> : "Delete"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteBookModal;
