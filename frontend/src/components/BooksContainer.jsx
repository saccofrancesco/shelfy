import { Box, Typography, CircularProgress } from "@mui/material";
import BookCard from "./BookCard";
import { useState, useEffect } from "react";
import axios from "axios";

function BooksContainer() {
  const [books, setBooks] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/books");
        setBooks(response.data);
        setErr(null);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [refresh]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={36} thickness={3} sx={{ color: "#1a73e8" }} />
      </Box>
    );
  }

  if (err) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography
          color="error"
          sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem" }}
        >
          Couldn't load your books. Try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: 3,
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 2.5,
        }}
      >
        {books.map((book, index) => (
          <BookCard key={book.id || index} book={book} />
        ))}
      </Box>
    </Box>
  );
}

export default BooksContainer;
