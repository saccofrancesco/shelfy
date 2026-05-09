export const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.92rem",
    borderRadius: "14px",
    backgroundColor: "rgba(255,250,243,0.9)",
    transition: "background-color 0.15s, transform 0.15s, box-shadow 0.15s",
    "& fieldset": { borderColor: "rgba(124,77,43,0.14)" },
    "&:hover fieldset": { borderColor: "rgba(124,77,43,0.28)" },
    "&.Mui-focused": {
      backgroundColor: "#fffaf3",
      boxShadow: "0 0 0 4px rgba(124,77,43,0.08)",
      "& fieldset": { borderColor: "#7c4d2b", borderWidth: "1.5px" },
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.88rem",
    color: "#8a755f",
    "&.Mui-focused": { color: "#7c4d2b" },
  },
  "& .MuiFormHelperText-root": {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.75rem",
    marginLeft: 0,
  },
};

export const menuPaperSx = {
  borderRadius: "16px",
  boxShadow: "0 20px 40px rgba(69,48,30,0.12)",
  border: "1px solid rgba(124,77,43,0.12)",
  backgroundColor: "#fffaf3",
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
      "linear-gradient(180deg, rgba(255,250,243,0.98), rgba(247,238,228,0.98))",
    borderRadius: "24px",
    boxShadow: "0 28px 70px rgba(69,48,30,0.24)",
    outline: "none",
    overflow: "hidden",
    border: "1px solid rgba(124,77,43,0.12)",
  };
}
