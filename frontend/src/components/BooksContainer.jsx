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
      } catch (e) {
        console.log(e);
        setErr(e);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, refresh);
}

export default BookContainer;
