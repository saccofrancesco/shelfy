// ============================================================================
// src/controllers/booksController.js
//
// Funzioni che gestiscono le richieste verso /books.
// Per ora implementiamo solo getAllBooks.
// Le altre due (getBookById, searchBooks) le aggiungeremo nei prossimi step.
// ============================================================================

const Book = require('../models/Book');

// ----------------------------------------------------------------------------
// GET /books
// Restituisce tutti i libri ordinati per titolo (alfabetico).
// ----------------------------------------------------------------------------
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    res.status(200).json(books);
  } catch (err) {
    next(err); // delega all'error handler globale in app.js
  }
};
