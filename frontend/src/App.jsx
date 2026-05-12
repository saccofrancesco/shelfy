import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import BooksContainer from "./components/BooksContainer";
import { Box } from "@mui/material";
import { uiTokens } from "./theme";
import {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
  http,
} from "./lib/http";
import { jwtDecode } from "jwt-decode";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title"); // "title" | "author"
  const [refreshKey, setRefreshKey] = useState(0);
  const [authState, setAuthState] = useState(() => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) return { isAuthenticated: false, user: null };
    try {
      const decoded = jwtDecode(accessToken);
      const expired = decoded.exp && decoded.exp * 1000 <= Date.now();
      if (expired) return { isAuthenticated: false, user: null };
      return {
        isAuthenticated: true,
        user: { username: decoded.username, role: decoded.role },
      };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  });

  useEffect(() => {
    async function hydrateAuth() {
      const accessToken = getStoredAccessToken();
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken || authState.isAuthenticated) return;

      try {
        if (accessToken) {
          const decoded = jwtDecode(accessToken);
          if (!decoded.exp || decoded.exp * 1000 > Date.now()) return;
        }
        const response = await http.post("/auth/refresh", { refreshToken });
        setStoredTokens({
          accessToken: response.data.accessToken,
          refreshToken,
        });
        setAuthState({
          isAuthenticated: true,
          user: response.data.user ?? null,
        });
      } catch {
        clearStoredTokens();
      }
    }

    hydrateAuth();
  }, [authState.isAuthenticated]);

  function handleBookAdded() {
    setRefreshKey((k) => k + 1);
  }

  function handleLogin({ accessToken, refreshToken, user }) {
    setStoredTokens({ accessToken, refreshToken });
    setAuthState({
      isAuthenticated: true,
      user: user ?? null,
    });
    setRefreshKey((k) => k + 1);
  }

  function handleLogout() {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      http.post("/auth/logout", { refreshToken }).catch(() => {});
    }
    clearStoredTokens();
    setAuthState({ isAuthenticated: false, user: null });
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
        isAuthenticated={authState.isAuthenticated}
        user={authState.user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <BooksContainer
        searchQuery={searchQuery}
        searchField={searchField}
        refreshKey={refreshKey}
        isAuthenticated={authState.isAuthenticated}
      />
    </Box>
  );
}

export default App;
