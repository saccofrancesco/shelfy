import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import http from "../lib/http";
import { getModalSurfaceSx, inputSx } from "./ui";
import { uiTokens } from "../theme";

function AuthModal({ open, onClose, onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      setError(null);
      const response = await http.post("/auth/login", form);
      onLogin?.(response.data);
      onClose();
    } catch {
      setError("Login failed. Check your username and password.");
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    if (loading) return;
    setForm({ username: "", password: "" });
    setError(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleDismiss}>
      <Box sx={getModalSurfaceSx({ xs: "calc(100% - 24px)", sm: 460 })}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: { xs: 2, sm: 3 },
            py: 2.25,
            borderBottom: `1px solid ${uiTokens.border.subtle}`,
            background:
              "linear-gradient(135deg, rgba(124,77,43,0.06), rgba(68,109,91,0.04))",
          }}
        >
          <Box sx={{ width: 40, height: 40, borderRadius: "14px", display: "grid", placeItems: "center", backgroundColor: "rgba(124,77,43,0.10)", border: `1px solid ${uiTokens.border.subtle}` }}>
            <PersonIcon sx={{ color: uiTokens.color.accent, fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.15rem", color: uiTokens.color.ink, lineHeight: 1.05 }}>
              Admin login
            </Typography>
            <Typography sx={{ mt: 0.4, fontSize: "0.82rem", color: uiTokens.color.soft }}>
              Sign in to manage books.
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleDismiss} disabled={loading} sx={{ color: uiTokens.color.muted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Username" value={form.username} onChange={handleChange("username")} sx={inputSx} />
          <TextField label="Password" type="password" value={form.password} onChange={handleChange("password")} sx={inputSx} />
          {error && <Typography sx={{ fontSize: "0.82rem", color: uiTokens.color.danger }}>{error}</Typography>}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, mt: 0.5 }}>
            <Button onClick={handleDismiss} disabled={loading} sx={{ fontWeight: 800, color: uiTokens.color.muted, borderRadius: "12px" }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} variant="contained" disableElevation sx={{ fontWeight: 800, borderRadius: "12px", background: "linear-gradient(135deg, #7c4d2b 0%, #9a6944 100%)", minWidth: 92 }}>
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default AuthModal;
