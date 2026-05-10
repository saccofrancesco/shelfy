import { useState } from "react";
import Navbar from "./components/Navbar";
import BooksContainer from "./components/BooksContainer";
import { Box } from "@mui/material";
import { uiTokens } from "./theme";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title"); // "title" | "author"
  const [refreshKey, setRefreshKey] = useState(0);

  function handleBookAdded() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        color: uiTokens.color.ink,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.38) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.03) 45%, transparent 100%)",
          opacity: 0.35,
        }}
      />
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        searchField={searchField}
        onFieldChange={setSearchField}
        onBookAdded={handleBookAdded}
      />
      <BooksContainer
        searchQuery={searchQuery}
        searchField={searchField}
        refreshKey={refreshKey}
      />
    </Box>
  );
}

export default App;
