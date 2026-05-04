import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Shelfy
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.15)",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <IconButton size="small">
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search…"
            sx={{ ml: 1, flex: 1, color: "inherit" }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
