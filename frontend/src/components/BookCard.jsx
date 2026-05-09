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
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const chipColors = [
  { bg: "rgba(124,77,43,0.12)", color: "#6d4124" },
  { bg: "rgba(68,109,91,0.12)", color: "#446d5b" },
  { bg: "rgba(163,96,51,0.12)", color: "#8d5630" },
  { bg: "rgba(143,61,47,0.12)", color: "#8f3d2f" },
  { bg: "rgba(93,76,153,0.12)", color: "#5d4c99" },
];

function hashIndex(str = "", len) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % len;
  return h;
}

function BookCard({ book, onEditClick, onDeleteClick }) {
  const genreColor = chipColors[hashIndex(book.genre, chipColors.length)];
  const hasCover = Boolean(book.coverUrl);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "24px",
        border: "1px solid rgba(124,77,43,0.10)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(255,250,243,0.98), rgba(245,236,225,0.92))",
        boxShadow: "0 16px 34px rgba(69,48,30,0.08)",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 22px 44px rgba(69,48,30,0.13)",
          borderColor: "rgba(124,77,43,0.18)",
        },
      }}
    >
      <Box sx={{ p: 2.2, pb: 1.3 }}>
        <Box
          sx={{
            position: "relative",
            height: 238,
            borderRadius: "18px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(160deg, rgba(124,77,43,0.08), rgba(68,109,91,0.08))",
            border: "1px solid rgba(124,77,43,0.10)",
          }}
        >
          {hasCover ? (
            <CardMedia
              component="img"
              image={book.coverUrl}
              alt={book.title}
              loading="lazy"
              sx={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#8a755f",
                gap: 1.1,
                background:
                  "linear-gradient(180deg, rgba(255,250,243,0.7), rgba(239,227,213,0.96))",
              }}
            >
              <Box
                sx={{
                  width: 78,
                  height: 100,
                  borderRadius: "18px 18px 12px 12px",
                  border: "1px solid rgba(124,77,43,0.16)",
                  background:
                    "linear-gradient(180deg, rgba(124,77,43,0.12), rgba(68,109,91,0.08))",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 10px 20px rgba(69,48,30,0.08)",
                }}
              >
                <AutoStoriesIcon sx={{ fontSize: 28, color: "#7c4d2b" }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                No cover yet
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <CardContent sx={{ px: 2.2, pb: 2, pt: 0.1, flexGrow: 1 }}>
        <Typography
          sx={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 700,
            fontSize: "1.22rem",
            color: "#24180f",
            lineHeight: 1.08,
            mb: 0.7,
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
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.9rem",
            color: "#6b5847",
            mb: 1.3,
          }}
        >
          by {book.author}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 1.25 }}>
          {book.year && (
            <Chip
              label={book.year}
              size="small"
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                bgcolor: "rgba(124,77,43,0.08)",
                color: "#6d4124",
                borderRadius: "999px",
                height: 26,
              }}
            />
          )}
          {book.genre && (
            <Chip
              label={book.genre}
              size="small"
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                bgcolor: genreColor.bg,
                color: genreColor.color,
                borderRadius: "999px",
                height: 26,
              }}
            />
          )}
        </Box>

        {book.description && (
          <Typography
            sx={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.9rem",
              color: "#6f6052",
              lineHeight: 1.65,
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {book.description}
          </Typography>
        )}
      </CardContent>

      <Divider sx={{ borderColor: "rgba(124,77,43,0.10)" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 1.2,
          py: 0.9,
          gap: 0.75,
        }}
      >
        <Tooltip title="Edit" placement="top" arrow>
          <IconButton
            size="small"
            onClick={() => onEditClick(book)}
            sx={{
              color: "#6b5847",
              borderRadius: "12px",
              transition: "background 0.18s, color 0.18s, transform 0.18s",
              "&:hover": {
                backgroundColor: "rgba(124,77,43,0.10)",
                color: "#6d4124",
                transform: "translateY(-1px)",
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
              color: "#6b5847",
              borderRadius: "12px",
              transition: "background 0.18s, color 0.18s, transform 0.18s",
              "&:hover": {
                backgroundColor: "rgba(143,61,47,0.10)",
                color: "#8f3d2f",
                transform: "translateY(-1px)",
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
