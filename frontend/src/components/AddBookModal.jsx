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
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
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

    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.author.trim()) nextErrors.author = "Author is required";

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
    if (!validateForm()) return;

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
              "linear-gradient(135deg, rgba(124,77,43,0.06), rgba(68,109,91,0.04))",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "14px",
              display: "grid",
              placeItems: "center",
              backgroundColor: "rgba(124,77,43,0.10)",
              border: "1px solid rgba(124,77,43,0.12)",
            }}
          >
            <LibraryAddIcon sx={{ color: "#7c4d2b", fontSize: 22 }} />
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
              Add a book
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.82rem",
                color: "#7b6757",
              }}
            >
              We’ll try to find a cover automatically after you save.
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
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
            placeholder="A line or two about the themes, mood, or why it matters to you."
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
                  "linear-gradient(135deg, #7c4d2b 0%, #9a6944 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #6d4124 0%, #8a5b38 100%)",
                },
                "&:disabled": {
                  backgroundColor: "#d8c1b1",
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

export default AddBookModal;
