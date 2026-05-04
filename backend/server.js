// ============================================================================
// server.js - punto di ingresso dell'applicazione
//
// Compito unico: orchestrare l'avvio.
//   1. carica le variabili da .env
//   2. apre la connessione al DB
//   3. avvia il server Express in ascolto sulla porta indicata
//
// La logica vera (rotte, controller) sta nei file dentro src/.
// ============================================================================

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Funzione di avvio asincrona
async function start() {
  try {
    await connectDB();              // 1. prima connetti al DB
    app.listen(PORT, () => {        // 2. poi avvia il server
      console.log(`Server in ascolto su http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Impossibile avviare il server:', err.message);
    process.exit(1);                // esce con codice di errore
  }
}

start();
