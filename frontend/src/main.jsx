import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7c4d2b",
      dark: "#5e371e",
      light: "#a66c43",
    },
    secondary: {
      main: "#446d5b",
    },
    background: {
      default: "#f3ede3",
      paper: "#fffaf3",
    },
    text: {
      primary: "#24180f",
      secondary: "#665547",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Manrope', sans-serif",
    h1: { fontFamily: "'Fraunces', serif" },
    h2: { fontFamily: "'Fraunces', serif" },
    h3: { fontFamily: "'Fraunces', serif" },
    h4: { fontFamily: "'Fraunces', serif" },
    h5: { fontFamily: "'Fraunces', serif" },
    h6: { fontFamily: "'Fraunces', serif" },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(166,108,67,0.18), transparent 33%), radial-gradient(circle at top right, rgba(68,109,91,0.14), transparent 28%), linear-gradient(180deg, #f8f1e7 0%, #f3ede3 100%)",
          minHeight: "100vh",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
