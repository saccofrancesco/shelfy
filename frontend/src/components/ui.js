import { alpha } from "@mui/material/styles";
import { uiTokens } from "../theme";

export const surfaceSx = {
  background: uiTokens.surface.paper,
  border: `1px solid ${uiTokens.border.subtle}`,
  borderRadius: `${uiTokens.radius.lg}px`,
  boxShadow: uiTokens.shadow.soft,
  backdropFilter: "blur(18px)",
};

export const sectionShellSx = {
  ...surfaceSx,
  overflow: "hidden",
};

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: `${uiTokens.radius.sm}px`,
    backgroundColor: "rgba(255,250,243,0.92)",
    transition: "box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease",
    "& fieldset": { borderColor: uiTokens.border.subtle },
    "&:hover fieldset": { borderColor: uiTokens.border.strong },
    "&.Mui-focused": {
      boxShadow: `0 0 0 4px ${alpha(uiTokens.color.accent, 0.08)}`,
      "& fieldset": { borderColor: uiTokens.color.accent, borderWidth: 1.5 },
    },
  },
  "& .MuiInputLabel-root": {
    color: uiTokens.color.soft,
    "&.Mui-focused": { color: uiTokens.color.accent },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    fontSize: "0.78rem",
  },
};

export const menuPaperSx = {
  borderRadius: `${uiTokens.radius.md}px`,
  boxShadow: uiTokens.shadow.medium,
  border: `1px solid ${uiTokens.border.subtle}`,
  backgroundColor: uiTokens.color.paper,
  "& .MuiMenuItem-root": {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.875rem",
  },
};

export function getModalSurfaceSx(width) {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width,
    maxHeight: "min(88vh, 900px)",
    background:
      "linear-gradient(180deg, rgba(255,252,247,0.98), rgba(247,238,228,0.98))",
    borderRadius: `${uiTokens.radius.lg}px`,
    boxShadow: uiTokens.shadow.strong,
    outline: "none",
    overflow: "auto",
    border: `1px solid ${uiTokens.border.subtle}`,
  };
}
