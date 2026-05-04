// ============================================================================
// src/routes/booksRoutes.js
//
// Definisce gli URL relativi a /books e li collega ai controller.
// Nota: il prefisso /books e' aggiunto in app.js con app.use('/books', ...).
// Quindi qui scriviamo solo cio' che viene DOPO /books.
// ============================================================================

const express = require('express');
const router = express.Router();

const booksController = require('../controllers/booksController');

// GET /books -> lista completa
router.get('/', booksController.getAllBooks);

// Prossime rotte (le aggiungeremo agli step successivi):
// router.get('/search', booksController.searchBooks);
// router.get('/:id', booksController.getBookById);

module.exports = router;
