// ============================================================================
// src/config/db.js
//
// Funzione che apre la connessione a MongoDB usando Mongoose.
// La esportiamo per essere chiamata da server.js all'avvio.
// ============================================================================

const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI non definita nel file .env');
  }

  // mongoose.connect ritorna una Promise: con await aspettiamo
  // che la connessione sia effettivamente stabilita prima di procedere.
  await mongoose.connect(uri);

  console.log('MongoDB connesso al database:', mongoose.connection.name);
}

module.exports = connectDB;
