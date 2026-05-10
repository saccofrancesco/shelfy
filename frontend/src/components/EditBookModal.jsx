import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { BOOK_GENRES } from "../constants/books";
import { bookToForm } from "../lib/bookForm";
import http from "../lib/http";
import { getModalSurfaceSx, inputSx, menuPaperSx } from "./ui";
import { uiTokens } from "../theme";

function EditBookModal({ open, onClose, book, onBookUpdated }) {
  const [form, setForm] = useState(() => bookToForm(book));
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);

  function validateForm() {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.author.trim()) nextErrors.author = "Author is required";
    return nextErrors;
  }

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (serverError) setServerError(null);
    };
  }

  async function handleSubmit() {
    if (!book) return;
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setServerError("Title and author cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setServerError(null);
      const response = await http.put(`/books/${book._id}`, {
        title: form.title.trim(),
        author: form.author.trim(),
        year: form.year,
        genre: form.genre.trim(),
        description: form.description.trim(),
      });
      onBookUpdated?.(response.data.book);
      handleClose();
    } catch {
      setServerError("Failed to update the book. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) return;
    setServerError(null);
    onClose();
  }

  if (!book) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={getModalSurfaceSx({ xs: "calc(100% - 24px)", sm: 560 })}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: { xs: 2, sm: 3 },
            py: 2.25,
            borderBottom: `1px solid ${uiTokens.border.subtle}`,
            background:
              "linear-gradient(135deg, rgba(68,109,91,0.06), rgba(124,77,43,0.04))",
          }}
        >
          <Box sx={{ width: 40, height: 40, borderRadius: "14px", display: "grid", placeItems: "center", backgroundColor: "rgba(68,109,91,0.10)", border: `1px solid ${uiTokens.border.subtle}` }}>
            <EditIcon sx={{ color: uiTokens.color.accent2, fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.15rem", color: uiTokens.color.ink, lineHeight: 1.05 }}>
              Edit book
            </Typography>
            <Typography sx={{ mt: 0.4, fontSize: "0.82rem", color: uiTokens.color.soft }}>
              Refine the record without losing the book’s place on the shelf.
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose} disabled={saving} sx={{ color: uiTokens.color.muted, "&:hover": { backgroundColor: "rgba(124,77,43,0.10)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Title" value={form.title} onChange={handleChange("title")} sx={inputSx} />
          <TextField label="Author" value={form.author} onChange={handleChange("author")} sx={inputSx} />
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1.4fr" } }}>
            <TextField label="Year" value={form.year} onChange={handleChange("year")} type="number" sx={inputSx} inputProps={{ min: 1, max: new Date().getFullYear() }} />
            <TextField select label="Genre" value={form.genre} onChange={handleChange("genre")} sx={inputSx} SelectProps={{ MenuProps: { PaperProps: { sx: menuPaperSx } } }}>
              <MenuItem value="">
                <em style={{ color: uiTokens.color.soft, fontStyle: "normal" }}>None</em>
              </MenuItem>
              {BOOK_GENRES.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField label="Description" value={form.description} onChange={handleChange("description")} multiline rows={4} sx={inputSx} placeholder="What should future-you remember about this book?" />

          {serverError && <Typography sx={{ fontSize: "0.82rem", color: uiTokens.color.danger }}>{serverError}</Typography>}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, mt: 0.5, flexWrap: "wrap" }}>
            <Button onClick={handleClose} disabled={saving} sx={{ fontWeight: 800, color: uiTokens.color.muted, borderRadius: "12px" }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving} variant="contained" disableElevation sx={{ fontWeight: 800, borderRadius: "12px", background: "linear-gradient(135deg, #446d5b 0%, #5e8875 100%)", minWidth: 92 }}>
              {saving ? <CircularProgress size={16} thickness={4} sx={{ color: "#fff" }} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditBookModal;
