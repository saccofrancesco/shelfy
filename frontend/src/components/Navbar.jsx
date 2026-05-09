import {
  Typography,
  Box,
  InputBase,
  IconButton,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useState } from "react";
import AddBookModal from "./AddBookModal";
import { SEARCH_FIELDS } from "../constants/books";

function Navbar({
  searchQuery,
  onSearch,
  searchField,
  onFieldChange,
  onBookAdded,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(18px)",
          background:
            "linear-gradient(180deg, rgba(248,241,231,0.92) 0%, rgba(248,241,231,0.72) 100%)",
          borderBottom: "1px solid rgba(124,77,43,0.12)",
        }}
      >
        <Box
          sx={{
            maxWidth: 1320,
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, rgba(124,77,43,0.16), rgba(68,109,91,0.14))",
                  border: "1px solid rgba(124,77,43,0.14)",
                }}
              >
                <AutoStoriesIcon sx={{ color: "#7c4d2b", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    letterSpacing: "-0.02em",
                    color: "#24180f",
                    lineHeight: 1,
                  }}
                >
                  Shelfy
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.78rem",
                    color: "#7b6757",
                    mt: 0.35,
                  }}
                >
                  A quiet shelf for the books you keep coming back to
                </Typography>
              </Box>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                borderColor: "rgba(124,77,43,0.14)",
              }}
            />

            <Box sx={{ display: "flex", gap: 0.9, flexWrap: "wrap" }}>
              {SEARCH_FIELDS.map(({ value, label }) => {
                const active = searchField === value;
                return (
                  <Chip
                    key={value}
                    label={label}
                    onClick={() => onFieldChange(value)}
                    size="small"
                    sx={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      height: 32,
                      borderRadius: "999px",
                      cursor: "pointer",
                      px: 0.4,
                      backgroundColor: active
                        ? "rgba(124,77,43,0.12)"
                        : "rgba(255,250,243,0.72)",
                      color: active ? "#5e371e" : "#6e5d4f",
                      border: "1px solid",
                      borderColor: active
                        ? "rgba(124,77,43,0.24)"
                        : "rgba(124,77,43,0.12)",
                      boxShadow: active
                        ? "0 8px 20px rgba(124,77,43,0.08)"
                        : "none",
                      transition:
                        "transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        backgroundColor: active
                          ? "rgba(124,77,43,0.16)"
                          : "rgba(255,250,243,1)",
                        borderColor: "rgba(124,77,43,0.2)",
                      },
                      "& .MuiChip-label": { px: 1.25 },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.5,
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255,250,243,0.86)",
                borderRadius: "18px",
                px: 2,
                py: 1,
                flex: 1,
                minWidth: { xs: "100%", md: 340 },
                maxWidth: 640,
                border: "1px solid rgba(124,77,43,0.12)",
                boxShadow: "0 10px 28px rgba(69,48,30,0.06)",
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                "&:focus-within": {
                  transform: "translateY(-1px)",
                  borderColor: "rgba(124,77,43,0.22)",
                  boxShadow: "0 16px 34px rgba(69,48,30,0.10)",
                },
              }}
            >
              <SearchIcon
                sx={{ color: "#8a755f", fontSize: 20, mr: 1, flexShrink: 0 }}
              />
              <InputBase
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={`Search by ${searchField}...`}
                sx={{
                  flex: 1,
                  fontSize: "0.96rem",
                  fontFamily: "'Manrope', sans-serif",
                  color: "#24180f",
                  "& input::placeholder": { color: "#947e6f", opacity: 1 },
                }}
              />
              {searchQuery && (
                <IconButton
                  size="small"
                  onClick={() => onSearch("")}
                  sx={{
                    p: 0.35,
                    color: "#7b6757",
                    borderRadius: "10px",
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: "14px",
                px: 2.25,
                py: 1.05,
                background:
                  "linear-gradient(135deg, #7c4d2b 0%, #9a6944 100%)",
                color: "#fffaf3",
                boxShadow: "0 12px 24px rgba(124,77,43,0.24)",
                flexShrink: 0,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #6d4124 0%, #8a5b38 100%)",
                  boxShadow: "0 16px 28px rgba(124,77,43,0.28)",
                },
              }}
            >
              Add book
            </Button>
          </Box>
        </Box>
      </Box>

      <AddBookModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onBookAdded={onBookAdded}
      />
    </>
  );
}

export default Navbar;
