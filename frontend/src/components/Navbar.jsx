import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

function Navbar() {
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
        sx={{ gap: 2, px: { xs: 2, sm: 3 }, minHeight: "64px !important" }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
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
            maxWidth: 560,
            transition: "background-color 0.2s, box-shadow 0.2s",
            "&:focus-within": {
              backgroundColor: "#fff",
              boxShadow: "0 1px 6px rgba(32,33,36,0.18)",
            },
          }}
        >
          <SearchIcon sx={{ color: "#5f6368", fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="Search books, authors…"
            sx={{
              flex: 1,
              fontSize: "0.925rem",
              fontFamily: "'DM Sans', sans-serif",
              color: "#202124",
              "& input::placeholder": { color: "#80868b", opacity: 1 },
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
