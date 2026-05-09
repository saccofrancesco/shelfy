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
import { getModalSurfaceSx, inputSx, menuPaperSx } from "./bookModalStyles";

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
      <Box sx={getModalSurfaceSx({ xs: "calc(100% - 32px)", sm: 560 })}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 3,
            py: 2.25,
            borderBottom: "1px solid rgba(124,77,43,0.10)",
            background:
              "linear-gradient(135deg, rgba(68,109,91,0.06), rgba(124,77,43,0.04))",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "14px",
              display: "grid",
              placeItems: "center",
              backgroundColor: "rgba(68,109,91,0.10)",
              border: "1px solid rgba(68,109,91,0.12)",
            }}
          >
            <EditIcon sx={{ color: "#446d5b", fontSize: 22 }} />
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
              Edit book
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.82rem",
                color: "#7b6757",
              }}
            >
              Refine the record without losing the book’s place on the shelf.
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            disabled={saving}
            sx={{
              color: "#6b5847",
              "&:hover": { backgroundColor: "rgba(124,77,43,0.10)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: 3,
            pt: 2.5,
            pb: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange("title")}
            fullWidth
            size="small"
            sx={inputSx}
          />
          <TextField
            label="Author"
            value={form.author}
            onChange={handleChange("author")}
            fullWidth
            size="small"
            sx={inputSx}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Year"
              value={form.year}
              onChange={handleChange("year")}
              type="number"
              size="small"
              sx={{ ...inputSx, flex: 1 }}
              inputProps={{ min: 1, max: new Date().getFullYear() }}
            />
            <TextField
              select
              label="Genre"
              value={form.genre}
              onChange={handleChange("genre")}
              size="small"
              sx={{ ...inputSx, flex: 2 }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: menuPaperSx,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em style={{ color: "#8a755f", fontStyle: "normal" }}>None</em>
              </MenuItem>
              {BOOK_GENRES.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
            multiline
            rows={3}
            fullWidth
            size="small"
            sx={inputSx}
            placeholder="What should future-you remember about this book?"
          />

          {serverError && (
            <Typography
              sx={{
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
              mt: 0.5,
            }}
          >
            <Button
              onClick={handleClose}
              disabled={saving}
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
              onClick={handleSubmit}
              disabled={saving}
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
                  "linear-gradient(135deg, #446d5b 0%, #5e8875 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #34584a 0%, #4f7563 100%)",
                },
                "&:disabled": {
                  backgroundColor: "#c9d8d1",
                  color: "#fff",
                },
                minWidth: 92,
              }}
            >
              {saving ? (
                <CircularProgress size={16} thickness={4} sx={{ color: "#fff" }} />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditBookModal;
