import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardMedia,
  Skeleton,
} from "@mui/material";

// Soft palette for genre chips — cycles through a small set
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

const coverCache = new Map(); // title → url string | null

function BookCard({ book }) {
  const [coverUrl, setCoverUrl] = useState(() =>
    coverCache.has(book.title) ? coverCache.get(book.title) : undefined,
  );
  const coverLoading = coverUrl === undefined;

  useEffect(() => {
    if (coverCache.has(book.title)) return;
    let cancelled = false;
    async function fetchCover() {
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}`,
        );
        const data = await res.json();
        const url = data.docs?.[0]?.cover_i
          ? `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`
          : null;
        coverCache.set(book.title, url);
        if (!cancelled) setCoverUrl(url);
      } catch {
        coverCache.set(book.title, null);
        if (!cancelled) setCoverUrl(null);
      }
    }
    fetchCover();
    return () => {
      cancelled = true;
    };
  }, [book.title]);

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
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(32,33,36,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Cover area */}
      {coverLoading ? (
        <Box sx={{ p: 1.5, pt: 1.5 }}>
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
            <Skeleton
              variant="rectangular"
              width="100%"
              height={220}
              animation="wave"
            />
          </Box>
        </Box>
      ) : coverUrl ? (
        <Box sx={{ p: 1.5, pt: 1.5 }}>
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
              image={coverUrl}
              alt={book.title}
              sx={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f1f3f4",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: "2rem" }}>📖</Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#80868b",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            No cover available
          </Typography>
        </Box>
      )}

      <CardContent sx={{ p: 2.5, pb: "20px !important" }}>
        {/* Title */}
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

        {/* Author */}
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

        {/* Chips */}
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

        {/* Description */}
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
    </Card>
  );
}

export default BookCard;
