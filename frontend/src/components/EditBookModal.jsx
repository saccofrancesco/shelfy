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
import { useEffect, useState } from "react";
import axios from "axios";

const GENRES = [
  "Adventure",
  "Coming-of-age",
  "Drama",
  "Dystopian",
  "Fantasy",
  "Fairy Tale",
  "Historical",
  "Novel",
  "Philosophical",
  "Post-apocalyptic",
  "Psychological",
  "Satire",
  "Science Fiction",
  "Thriller",
  "Other",
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    transition: "background-color 0.15s",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#bdc1c6" },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "#1a73e8",
        borderWidth: "1.5px",
      },
    },
  },

  "& .MuiInputLabel-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.875rem",
    color: "#80868b",
    "&.Mui-focused": { color: "#1a73e8" },
  },

  "& .MuiFormHelperText-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.75rem",
  },
};

function EditBookModal({ open, onClose, book, onBookUpdated }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        author: book.author || "",
        year: book.year || "",
        genre: book.genre || "",
        description: book.description || "",
      });
    }
  }, [book]);

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
    try {
      setSaving(true);
      setServerError(null);

      const response = await axios.put(
        `http://localhost:3000/books/${book._id}`,
        {
          ...book,
          ...form,
        },
      );
      onBookUpdated?.(response.data.book);

      handleClose();
    } catch (err) {
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
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "calc(100% - 32px)", sm: 520 },
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

        {/* Body */}
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
              inputprops={{
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
              selectprops={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: "10px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                      "& .MuiMenuItem-root": {
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.875rem",
                      },
                    },
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

              {GENRES.map((g) => (
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

          {/* Actions */}
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
