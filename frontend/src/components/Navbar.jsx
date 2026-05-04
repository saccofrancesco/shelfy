import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  Avatar,
  IconButton,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const FIELDS = [
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
];

function Navbar({ searchQuery, onSearch, searchField, onFieldChange }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e8eaed",
        color: "#202124",
      }}
    >
      <Toolbar
        sx={{
          gap: 2,
          px: { xs: 2, sm: 3 },
          minHeight: "64px !important",
          flexWrap: "wrap",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
          <AutoStoriesIcon sx={{ color: "#1a73e8", fontSize: 26 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "1.15rem",
              letterSpacing: "-0.01em",
              color: "#202124",
              whiteSpace: "nowrap",
            }}
          >
            Shelfy
          </Typography>
        </Box>

        {/* Filter chips — Title / Author */}
        <Box sx={{ display: "flex", gap: 0.75, flexShrink: 0 }}>
          {FIELDS.map(({ value, label }) => {
            const active = searchField === value;
            return (
              <Chip
                key={value}
                label={label}
                onClick={() => onFieldChange(value)}
                size="small"
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  height: 28,
                  borderRadius: "8px",
                  cursor: "pointer",
                  // Active = filled blue, inactive = outlined grey
                  backgroundColor: active ? "#e8f0fe" : "transparent",
                  color: active ? "#1a73e8" : "#5f6368",
                  border: "1px solid",
                  borderColor: active ? "#c5d9fb" : "#dadce0",
                  transition: "all 0.15s",
                  "&:hover": {
                    backgroundColor: active ? "#d2e3fc" : "#f1f3f4",
                    borderColor: active ? "#a8c7f8" : "#bdc1c6",
                  },
                  "& .MuiChip-label": { px: 1.25 },
                }}
              />
            );
          })}
        </Box>

        {/* Search bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f1f3f4",
            borderRadius: "24px",
            px: 2,
            py: 0.75,
            flex: 1,
            maxWidth: 520,
            transition: "background-color 0.2s, box-shadow 0.2s",
            "&:focus-within": {
              backgroundColor: "#fff",
              boxShadow: "0 1px 6px rgba(32,33,36,0.18)",
            },
          }}
        >
          <SearchIcon
            sx={{ color: "#5f6368", fontSize: 20, mr: 1, flexShrink: 0 }}
          />
          <InputBase
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={`Search by ${searchField}…`}
            sx={{
              flex: 1,
              fontSize: "0.925rem",
              fontFamily: "'DM Sans', sans-serif",
              color: "#202124",
              "& input::placeholder": { color: "#80868b", opacity: 1 },
            }}
          />
          {searchQuery && (
            <IconButton
              size="small"
              onClick={() => onSearch("")}
              sx={{ p: 0.25, color: "#5f6368" }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ flex: 1 }} />

        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: "#1a73e8",
            fontSize: "0.85rem",
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
          }}
        >
          F
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
