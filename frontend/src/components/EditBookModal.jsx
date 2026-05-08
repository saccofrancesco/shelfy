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

    if (!form.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!form.author.trim()) {
      nextErrors.author = "Author is required";
    }

    return nextErrors;
  }

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (serverError) setServerError(null);
    };
  }

  async function handleSubmit() {
    if (!book) {
      return;
    }

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
      <Box sx={getModalSurfaceSx({ xs: "calc(100% - 32px)", sm: 520 })}>
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
          <EditIcon sx={{ color: "#1a73e8", fontSize: 22 }} />

          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#202124",
              flex: 1,
            }}
          >
            Edit book
          </Typography>

          <IconButton
            size="small"
            onClick={handleClose}
            disabled={saving}
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
              inputProps={{
                min: 1,
                max: new Date().getFullYear(),
              }}
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
                <em
                  style={{
                    color: "#80868b",
                    fontStyle: "normal",
                  }}
                >
                  None
                </em>
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
          />

          {serverError && (
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#c5221f",
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
              onClick={handleSubmit}
              disabled={saving}
              variant="contained"
              disableElevation
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
                backgroundColor: "#1a73e8",
                "&:hover": {
                  backgroundColor: "#1765cc",
                },
                "&:disabled": {
                  backgroundColor: "#c5d9fb",
                  color: "#fff",
                },
                minWidth: 92,
              }}
            >
              {saving ? (
                <CircularProgress
                  size={16}
                  thickness={4}
                  sx={{ color: "#fff" }}
                />
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
