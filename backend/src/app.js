// ============================================================================
// src/app.js
//
// Configurazione di Express:
//   - middleware globali (CORS, JSON parser, log delle richieste)
//   - rotta di health check su GET /
//   - montaggio delle rotte dei libri su /books
//   - gestione 404 e gestione errori
// ============================================================================

const express = require('express');
const cors = require('cors');

const booksRoutes = require('./routes/booksRoutes');

const app = express();

// --- Middleware globali ---
app.use(cors());
app.use(express.json());

// Log semplice di ogni richiesta
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Rotte ---

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Shelfy API attiva',
    time: new Date().toISOString(),
  });
});

// Rotte dei libri: tutte le richieste che iniziano con /books vengono
// gestite dal router definito in booksRoutes.js
app.use('/books', booksRoutes);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: `Rotta non trovata: ${req.method} ${req.url}` });
});

// --- Error handler globale ---
app.use((err, req, res, next) => {
  console.error('Errore non gestito:', err);
  res.status(500).json({
    error: 'Errore interno del server',
    detail: err.message,
  });
});

module.exports = app;
