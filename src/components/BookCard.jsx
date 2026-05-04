import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

function BookCard({ book }) {
  return (
    <Card sx={{ maxWidth: 320, borderRadius: 3 }}>
      <CardContent>
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          {book.title}
        </Typography>

        {/* Author */}
        <Typography variant="subtitle2" color="text.secondary">
          {book.author}
        </Typography>

        {/* Meta info */}
        <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
          <Chip label={book.year} size="small" />
          <Chip label={book.genre} size="small" />
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary">
          {book.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default BookCard;
