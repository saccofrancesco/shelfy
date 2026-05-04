import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardMedia,
} from "@mui/material";

function BookCard({ book }) {
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    async function fetchCover() {
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}`,
        );
        const data = await res.json();

        if (data.docs && data.docs.length > 0) {
          const coverId = data.docs[0].cover_i;

          if (coverId) {
            setCoverUrl(`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`);
          } else {
            setCoverUrl(null);
          }
        }
      } catch (err) {
        console.error(err);
        setCoverUrl(null);
      }
    }

    fetchCover();
  }, [book.title]);

  return (
    <Card sx={{ maxWidth: 320, borderRadius: 3 }}>
      {/* Cover */}
      {coverUrl ? (
        <CardMedia
          component="img"
          height="180"
          image={coverUrl}
          alt={book.title}
        />
      ) : (
        <Box
          sx={{
            height: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.200",
          }}
        >
          <Typography variant="body2">No cover</Typography>
        </Box>
      )}

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {book.title}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary">
          {book.author}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
          <Chip label={book.year} size="small" />
          <Chip label={book.genre} size="small" />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {book.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default BookCard;
