import { createTheme, alpha } from "@mui/material/styles";

export const uiTokens = {
  radius: {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 32,
  },
  shadow: {
    soft: "0 10px 30px rgba(50, 35, 24, 0.08)",
    medium: "0 18px 44px rgba(50, 35, 24, 0.12)",
    strong: "0 28px 70px rgba(50, 35, 24, 0.18)",
  },
  surface: {
    paper: "rgba(255, 250, 243, 0.92)",
    elevated: "rgba(255, 252, 247, 0.98)",
  },
  border: {
    subtle: "rgba(124, 77, 43, 0.12)",
    strong: "rgba(124, 77, 43, 0.18)",
  },
  color: {
    ink: "#24180f",
    muted: "#665547",
    soft: "#8a755f",
    accent: "#7c4d2b",
    accentDark: "#5e371e",
    accent2: "#446d5b",
    danger: "#8f3d2f",
    dangerDark: "#7b3126",
    background: "#f3ede3",
    paper: "#fffaf3",
  },
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: uiTokens.color.accent,
      dark: uiTokens.color.accentDark,
      light: "#a66c43",
    },
    secondary: {
      main: uiTokens.color.accent2,
    },
    background: {
      default: uiTokens.color.background,
      paper: uiTokens.color.paper,
    },
    text: {
      primary: uiTokens.color.ink,
      secondary: uiTokens.color.muted,
    },
  },
  shape: {
    borderRadius: uiTokens.radius.md,
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
        html: {
          colorScheme: "light",
        },
        body: {
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(166,108,67,0.16), transparent 30%), radial-gradient(circle at top right, rgba(68,109,91,0.12), transparent 26%), linear-gradient(180deg, #f8f1e7 0%, #f3ede3 100%)",
          color: uiTokens.color.ink,
        },
        "*::selection": {
          backgroundColor: alpha(uiTokens.color.accent, 0.18),
        },
        "*": {
          boxSizing: "border-box",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: uiTokens.radius.sm,
          paddingInline: "1rem",
          transition: "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined",
        size: "small",
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: uiTokens.radius.lg,
          boxShadow: uiTokens.shadow.strong,
        },
      },
    },
  },
});
