import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardMedia,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const chipColors = [
  { bg: "#e8f0fe", color: "#1a73e8" },
  { bg: "#fce8e6", color: "#c5221f" },
  { bg: "#e6f4ea", color: "#137333" },
  { bg: "#fef7e0", color: "#b06000" },
  { bg: "#f3e8fd", color: "#7b1fa2" },
];

function hashIndex(str = "", len) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % len;
  return h;
}

function BookCard({ book, onEditClick, onDeleteClick }) {
  const genreColor = chipColors[hashIndex(book.genre, chipColors.length)];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e8eaed",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            height: 220,
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardMedia
            component="img"
            image={book.coverUrl}
            alt={book.title}
            sx={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5, pb: "12px !important", flexGrow: 1 }}>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.975rem",
            color: "#202124",
            lineHeight: 1.35,
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {book.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.825rem",
            color: "#5f6368",
            mb: 1.5,
          }}
        >
          {book.author}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 1.5 }}>
          {book.year && (
            <Chip
              label={book.year}
              size="small"
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                bgcolor: "#f1f3f4",
                color: "#5f6368",
                borderRadius: "8px",
                height: 24,
              }}
            />
          )}
          {book.genre && (
            <Chip
              label={book.genre}
              size="small"
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                bgcolor: genreColor.bg,
                color: genreColor.color,
                borderRadius: "8px",
                height: 24,
              }}
            />
          )}
        </Box>

        {book.description && (
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.825rem",
              color: "#80868b",
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {book.description}
          </Typography>
        )}
      </CardContent>

      <Divider sx={{ borderColor: "#f1f3f4" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 1.5,
          py: 0.75,
          gap: 0.5,
        }}
      >
        <Tooltip title="Edit" placement="top" arrow>
          <IconButton
            size="small"
            onClick={() => onEditClick(book)}
            sx={{
              color: "#5f6368",
              borderRadius: "8px",
              transition: "background 0.15s, color 0.15s",
              "&:hover": {
                backgroundColor: "#e8f0fe",
                color: "#1a73e8",
              },
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete" placement="top" arrow>
          <IconButton
            size="small"
            onClick={() => onDeleteClick(book)}
            sx={{
              color: "#5f6368",
              borderRadius: "8px",
              transition: "background 0.15s, color 0.15s",
              "&:hover": {
                backgroundColor: "#fce8e6",
                color: "#c5221f",
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}

export default BookCard;
