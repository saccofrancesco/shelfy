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
import { uiTokens } from "../theme";

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
            "linear-gradient(180deg, rgba(248,241,231,0.92) 0%, rgba(248,241,231,0.76) 100%)",
          borderBottom: `1px solid ${uiTokens.border.subtle}`,
        }}
      >
        <Box
          sx={{
            maxWidth: 1320,
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1.75, md: 2.25 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "linear-gradient(135deg, rgba(124,77,43,0.14), rgba(68,109,91,0.12))",
                    border: `1px solid ${uiTokens.border.subtle}`,
                    boxShadow: uiTokens.shadow.soft,
                  }}
                >
                  <AutoStoriesIcon
                    sx={{ color: uiTokens.color.accent, fontSize: 22 }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    Shelfy
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: uiTokens.color.soft,
                      mt: 0.35,
                    }}
                  >
                    A calm shelf for books worth keeping close
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                disableElevation
                startIcon={<AddIcon />}
                onClick={() => setModalOpen(true)}
                sx={{
                  fontWeight: 800,
                  borderRadius: `${uiTokens.radius.sm}px`,
                  background:
                    "linear-gradient(135deg, #7c4d2b 0%, #9a6944 100%)",
                  boxShadow: uiTokens.shadow.soft,
                }}
              >
                Add book
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                {SEARCH_FIELDS.map(({ value, label }) => {
                  const active = searchField === value;
                  return (
                    <Chip
                      key={value}
                      label={label}
                      onClick={() => onFieldChange(value)}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        height: 32,
                        borderRadius: "999px",
                        cursor: "pointer",
                        backgroundColor: active
                          ? "rgba(124,77,43,0.12)"
                          : "rgba(255,250,243,0.82)",
                        color: active ? uiTokens.color.accentDark : uiTokens.color.muted,
                        border: `1px solid ${
                          active ? "rgba(124,77,43,0.22)" : uiTokens.border.subtle
                        }`,
                        transition: "transform 180ms ease, background-color 180ms ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          backgroundColor: active
                            ? "rgba(124,77,43,0.16)"
                            : "rgba(255,250,243,1)",
                        },
                      }}
                    />
                  );
                })}
              </Box>

              <Divider
                flexItem
                sx={{ display: { xs: "none", md: "block" }, borderColor: uiTokens.border.subtle }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: 1,
                  minWidth: { xs: "100%", md: 340 },
                  px: 1.75,
                  py: 1,
                  borderRadius: "18px",
                  backgroundColor: "rgba(255,250,243,0.86)",
                  border: `1px solid ${uiTokens.border.subtle}`,
                  boxShadow: uiTokens.shadow.soft,
                  transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                  "&:focus-within": {
                    transform: "translateY(-1px)",
                    borderColor: uiTokens.border.strong,
                    boxShadow: uiTokens.shadow.medium,
                  },
                }}
              >
                <SearchIcon sx={{ color: uiTokens.color.soft, fontSize: 20 }} />
                <InputBase
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder={`Search by ${searchField}...`}
                  sx={{
                    flex: 1,
                    fontSize: "0.96rem",
                    color: uiTokens.color.ink,
                    "& input::placeholder": {
                      color: uiTokens.color.soft,
                      opacity: 1,
                    },
                  }}
                />
                {searchQuery && (
                  <IconButton
                    size="small"
                    aria-label="Clear search"
                    onClick={() => onSearch("")}
                    sx={{
                      p: 0.35,
                      color: uiTokens.color.muted,
                      borderRadius: "10px",
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
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
