import { Box, Typography, CircularProgress } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import BookCard from "./BookCard";
import EditBookModal from "./EditBookModal";
import DeleteBookModal from "./DeleteBookModal";
import { useState, useEffect } from "react";
import axios from "axios";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function BooksContainer({ searchQuery, searchField, refreshKey }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const debouncedQuery = useDebounce(searchQuery, 350);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchBooks() {
      try {
        setLoading(true);
        setErr(null);
        const response = await axios.get("http://localhost:3000/books", {
          params: {
            q: debouncedQuery,
            field: searchField,
          },
          signal: controller.signal,
        });
        setBooks(response.data);
      } catch (e) {
        if (!axios.isCancel(e)) {
          setErr(e);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    fetchBooks();
    return () => controller.abort();
  }, [debouncedQuery, searchField, refreshKey]);

  function handleEditClick(book) {
    setSelectedBook(book);
    setEditOpen(true);
  }

  function handleDeleteClick(book) {
    setSelectedBook(book);
    setDeleteOpen(true);
  }

  function handleBookUpdated(updatedBook) {
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? updatedBook : b)),
    );
  }

  function handleBookDeleted(bookId) {
    setBooks((prev) => prev.filter((book) => book._id !== bookId));
  }

  return (
    <>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 3,
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 8,
            }}
          >
            <CircularProgress
              size={36}
              thickness={3}
              sx={{ color: "#1a73e8" }}
            />
          </Box>
        )}

        {!loading && err && (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                color: "#c5221f",
              }}
            >
              Couldn't load books. Try again later.
            </Typography>
          </Box>
        )}

        {!loading && !err && books.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 10,
              gap: 1.5,
            }}
          >
            <SearchOffIcon
              sx={{
                fontSize: 48,
                color: "#dadce0",
              }}
            />

            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#5f6368",
              }}
            >
              No books found
            </Typography>

            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.875rem",
                color: "#9aa0a6",
              }}
            >
              {debouncedQuery
                ? `No ${searchField} matched "${debouncedQuery}"`
                : "Your library is empty"}
            </Typography>
          </Box>
        )}

        {!loading && !err && books.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 2.5,
            }}
          >
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </Box>
        )}
      </Box>

      <EditBookModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        book={selectedBook}
        onBookUpdated={handleBookUpdated}
      />

      <DeleteBookModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        book={selectedBook}
        onBookDeleted={handleBookDeleted}
      />
    </>
  );
}

export default BooksContainer;
