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
import { getModalSurfaceSx, inputSx, menuPaperSx } from "./ui";
import { uiTokens } from "../theme";

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
              border: `1px solid ${uiTokens.border.subtle}`,
            }}
          >
            <LibraryAddIcon
              sx={{ color: uiTokens.color.accent, fontSize: 22 }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: uiTokens.color.ink,
                lineHeight: 1.05,
              }}
            >
              Add a book
            </Typography>
            <Typography
              sx={{ mt: 0.4, fontSize: "0.82rem", color: uiTokens.color.soft }}
            >
              We’ll try to find a cover automatically after you save.
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: uiTokens.color.muted,
              "&:hover": { backgroundColor: "rgba(124,77,43,0.10)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: { xs: 2, sm: 3 },
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
            sx={inputSx}
          />
          <TextField
            label="Author"
            value={form.author}
            onChange={handleChange("author")}
            error={!!errors.author}
            helperText={errors.author}
            sx={inputSx}
          />
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1.4fr" },
            }}
          >
            <TextField
              label="Year"
              value={form.year}
              onChange={handleChange("year")}
              error={!!errors.year}
              helperText={errors.year}
              type="number"
              sx={inputSx}
              inputprops={{ min: 1, max: new Date().getFullYear() }}
            />
            <TextField
              select
              label="Genre"
              value={form.genre}
              onChange={handleChange("genre")}
              sx={inputSx}
              selectprops={{ MenuProps: { PaperProps: { sx: menuPaperSx } } }}
            >
              <MenuItem value="">
                <em style={{ color: uiTokens.color.soft, fontStyle: "normal" }}>
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
            rows={4}
            sx={inputSx}
            placeholder="A line or two about the themes, mood, or why it matters to you."
          />

          {serverError && (
            <Typography
              sx={{ fontSize: "0.82rem", color: uiTokens.color.danger }}
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
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={handleClose}
              disabled={saving}
              sx={{
                fontWeight: 800,
                color: uiTokens.color.muted,
                borderRadius: "12px",
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
                fontWeight: 800,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #7c4d2b 0%, #9a6944 100%)",
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
