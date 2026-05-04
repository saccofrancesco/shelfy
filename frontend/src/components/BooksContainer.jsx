import { Box, Typography, CircularProgress } from "@mui/material";
import BookCard from "./BookCard";
import { useState, useEffect } from "react";
import axios from "axios";

function BookContainer() {
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
        console.log(e);
        setErr(e);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [refresh]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (err) {
    return <Typography color="error">Error loading books</Typography>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 2,
        p: 2,
      }}
    >
      {books.map((book, index) => (
        <BookCard key={book.id || index} book={book} />
      ))}
    </Box>
  );
}

export default BookContainer;
