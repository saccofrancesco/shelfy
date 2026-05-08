export const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    transition: "background-color 0.15s",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#bdc1c6" },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#1a73e8", borderWidth: "1.5px" },
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.875rem",
    color: "#80868b",
    "&.Mui-focused": { color: "#1a73e8" },
  },
  "& .MuiFormHelperText-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.75rem",
  },
};

export const menuPaperSx = {
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
  "& .MuiMenuItem-root": {
    fontFamily: "'DM Sans', sans-serif",
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
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
    outline: "none",
    overflow: "hidden",
  };
}
