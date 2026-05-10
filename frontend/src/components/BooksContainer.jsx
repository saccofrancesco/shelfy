import { Box, Typography, CircularProgress, Stack, Paper } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import EditBookModal from "./EditBookModal";
import DeleteBookModal from "./DeleteBookModal";
import useDebouncedValue from "../hooks/useDebouncedValue";
import http from "../lib/http";
import { uiTokens } from "../theme";

function BooksContainer({ searchQuery, searchField, refreshKey }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const debouncedQuery = useDebouncedValue(searchQuery, 350);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchBooks() {
      try {
        setLoading(true);
        setErr(null);
        const response = await http.get("/books", {
          params: { q: debouncedQuery, field: searchField },
          signal: controller.signal,
        });
        setBooks(response.data);
      } catch (e) {
        if (!axios.isCancel(e)) setErr(e);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
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
    setBooks((prev) => prev.map((b) => (b._id === updatedBook._id ? updatedBook : b)));
  }

  function handleBookDeleted(bookId) {
    setBooks((prev) => prev.filter((book) => book._id !== bookId));
  }

  const hasQuery = Boolean(debouncedQuery);

  return (
    <>
      <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: `${uiTokens.radius.lg}px`,
            border: `1px solid ${uiTokens.border.subtle}`,
            background:
              "linear-gradient(135deg, rgba(255,252,247,0.96), rgba(247,238,228,0.92))",
            boxShadow: uiTokens.shadow.soft,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
              alignItems: "end",
            }}
          >
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.05rem", md: "3.1rem" },
                  lineHeight: 0.98,
                  letterSpacing: "-0.04em",
                  mb: 1.2,
                }}
              >
                Build a shelf that feels lived in.
              </Typography>
              <Typography
                sx={{
                  maxWidth: 640,
                  fontSize: { xs: "0.98rem", md: "1.03rem" },
                  lineHeight: 1.7,
                  color: uiTokens.color.muted,
                }}
              >
                Search by {searchField}, add a new title, or shape the archive into a collection that feels personal instead of procedural.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2} justifyContent={{ xs: "flex-start", md: "flex-end" }} flexWrap="wrap">
              <Box sx={{ px: 2, py: 1.2, borderRadius: "18px", backgroundColor: "rgba(124,77,43,0.08)", border: `1px solid ${uiTokens.border.subtle}`, minWidth: 132 }}>
                <Typography sx={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: uiTokens.color.soft, mb: 0.35 }}>
                  Books
                </Typography>
                <Typography sx={{ fontFamily: "'Fraunces', serif", fontSize: "1.7rem", lineHeight: 1 }}>
                  {books.length}
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 1.2, borderRadius: "18px", backgroundColor: "rgba(68,109,91,0.08)", border: `1px solid rgba(68,109,91,0.12)`, minWidth: 132 }}>
                <Typography sx={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: uiTokens.color.accent2, mb: 0.35 }}>
                  Filter
                </Typography>
                <Typography sx={{ fontFamily: "'Fraunces', serif", fontSize: "1.05rem", lineHeight: 1.2 }}>
                  {searchField === "title" ? "Titles" : "Authors"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={42} thickness={3.5} sx={{ color: uiTokens.color.accent }} />
          </Box>
        )}

        {!loading && err && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography sx={{ fontSize: "0.98rem", color: uiTokens.color.danger }}>
              We couldn&apos;t load your shelf right now. Check your connection and try again.
            </Typography>
          </Box>
        )}

        {!loading && !err && books.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: `${uiTokens.radius.lg}px`,
              border: `1px solid ${uiTokens.border.subtle}`,
              background:
                "linear-gradient(160deg, rgba(255,252,247,0.95), rgba(242,230,214,0.84))",
              boxShadow: uiTokens.shadow.soft,
              p: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ display: "grid", placeItems: "center", textAlign: "center", gap: 1.4, py: 3 }}>
              <Box sx={{ width: 72, height: 72, borderRadius: "24px", display: "grid", placeItems: "center", background: "linear-gradient(135deg, rgba(124,77,43,0.12), rgba(68,109,91,0.12))", border: `1px solid ${uiTokens.border.subtle}` }}>
                <SearchOffIcon sx={{ fontSize: 34, color: uiTokens.color.accent }} />
              </Box>
              <Typography variant="h2" sx={{ fontSize: "1.8rem", letterSpacing: "-0.03em" }}>
                {hasQuery ? "Nothing matched this search." : "Your shelf is empty."}
              </Typography>
              <Typography sx={{ maxWidth: 520, fontSize: "0.97rem", lineHeight: 1.7, color: uiTokens.color.muted }}>
                {hasQuery
                  ? `No ${searchField} matched "${debouncedQuery}". Try clearing the search or switching the filter.`
                  : "Add your first book and let the shelf start taking shape. Covers can be discovered automatically when possible."}
              </Typography>
              <Typography sx={{ mt: 1, fontSize: "0.84rem", color: uiTokens.color.soft }}>
                Use the Add book button in the header to place the first title.
              </Typography>
            </Box>
          </Paper>
        )}

        {!loading && !err && books.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))",
              gap: { xs: 2, md: 2.5 },
              alignItems: "stretch",
            }}
          >
            {books.map((book) => (
              <BookCard key={book._id} book={book} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
            ))}
          </Box>
        )}
      </Box>

      <EditBookModal
        key={`${selectedBook?._id ?? "edit-empty"}-${editOpen ? "open" : "closed"}`}
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
