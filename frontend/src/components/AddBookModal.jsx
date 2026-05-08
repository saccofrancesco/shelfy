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
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useState } from "react";
import axios from "axios";
import { BOOK_GENRES } from "../constants/books";
import { createEmptyBookForm } from "../lib/bookForm";
import http from "../lib/http";
import { getModalSurfaceSx, inputSx, menuPaperSx } from "./bookModalStyles";

function AddBookModal({ open, onClose, onBookAdded }) {
  const [form, setForm] = useState(createEmptyBookForm());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);

  async function fetchCoverByTitle(title) {
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&fields=cover_i&limit=1`,
      );
      const data = res.data;
      return data.docs?.[0]?.cover_i
        ? `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`
        : null;
    } catch {
      return null;
    }
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!form.author.trim()) {
      nextErrors.author = "Author is required";
    }

    if (form.year) {
      const parsedYear = Number(form.year);
      const currentYear = new Date().getFullYear();

      if (
        !Number.isInteger(parsedYear) ||
        parsedYear < 1 ||
        parsedYear > currentYear
      ) {
        nextErrors.year = "Enter a valid year";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
      if (serverError) setServerError(null);
    };
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setServerError(null);

      const coverUrl = await fetchCoverByTitle(form.title.trim());
      const payload = {
        ...form,
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre.trim(),
        description: form.description.trim(),
        coverUrl,
      };

      const response = await http.post("/books", payload);
      onBookAdded?.(response.data);
      handleClose();
    } catch {
      setServerError("Failed to save the book. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setForm(createEmptyBookForm());
    setErrors({});
    setServerError(null);
    onClose();
  }

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
          <AutoStoriesIcon sx={{ color: "#1a73e8", fontSize: 22 }} />
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#202124",
              flex: 1,
            }}
          >
            Add new book
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: "#5f6368", "&:hover": { backgroundColor: "#f1f3f4" } }}
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
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            size="small"
            sx={inputSx}
          />

          <TextField
            label="Author"
            value={form.author}
            onChange={handleChange("author")}
            error={!!errors.author}
            helperText={errors.author}
            fullWidth
            size="small"
            sx={inputSx}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Year"
              value={form.year}
              onChange={handleChange("year")}
              error={!!errors.year}
              helperText={errors.year}
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
                <em style={{ color: "#80868b", fontStyle: "normal" }}>None</em>
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

export default AddBookModal;
