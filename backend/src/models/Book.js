// ============================================================================
// src/models/Book.js
//
// Schema Mongoose per la collection "books".
// I nomi dei campi DEVONO combaciare esattamente con il dump:
//   title, author, year, genre, description
//
// Convenzione Mongoose: il nome del modello e' singolare e con la prima
// maiuscola (Book). La collection in MongoDB diventa il plurale minuscolo
// (books). Combacia gia' con il nome del dump, quindi non serve override.
// ============================================================================

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    author:      { type: String, required: true, trim: true },
    year:        { type: Number, required: true },
    genre:       { type: String, required: true, trim: true },
    description: { type: String, trim: true }, // opzionale
  },
  {
    // Niente timestamps: il dump non li ha. Se li volessi (createdAt,
    // updatedAt automatici) imposteresti `timestamps: true` qui.
    versionKey: false, // rimuove il campo __v che Mongoose aggiungerebbe
  }
);

// Esportiamo il modello, pronto per essere usato nei controller
module.exports = mongoose.model('Book', bookSchema);
