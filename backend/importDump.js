// ============================================================================
// importDump.js - script una tantum per caricare il dump nel DB
//
// Cosa fa, passo per passo:
//   1. Legge il file books.bson dal dump
//   2. Lo "spacchetta" in oggetti JavaScript usando il parser BSON
//   3. Si connette a MongoDB con Mongoose (legge MONGO_URI da .env)
//   4. Svuota la collection "books" (per evitare duplicati se rilanciato)
//   5. Inserisce tutti i documenti
//
// Esegui con: node importDump.js
// ============================================================================

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const BSON = require('bson');

// Percorso del file BSON (relativo a questa cartella backend/)
const BSON_PATH = path.join(
  __dirname,
  '..',         // esce da backend/
  'dump',       // entra in dump/
  'dump',       // dentro c'e' un'altra cartella dump (struttura mongodump)
  'shelfy_db',
  'books.bson'
);

// ----------------------------------------------------------------------------
// Step 1+2: legge il file e parsa i documenti BSON
// Un file BSON e' una sequenza concatenata di documenti.
// Ogni documento inizia con un int32 LE che indica la sua dimensione totale.
// ----------------------------------------------------------------------------
function parseBsonFile(filePath) {
  const data = fs.readFileSync(filePath);
  const docs = [];
  let offset = 0;

  while (offset < data.length) {
    const size = data.readInt32LE(offset);
    if (size <= 0 || offset + size > data.length) break;
    const slice = data.slice(offset, offset + size);
    docs.push(BSON.deserialize(slice));
    offset += size;
  }

  return docs;
}

// ----------------------------------------------------------------------------
// Funzione principale (async per usare await)
// ----------------------------------------------------------------------------
async function main() {
  // 1+2. Lettura BSON
  console.log('Lettura del file:', BSON_PATH);
  const docs = parseBsonFile(BSON_PATH);
  console.log(`   -> ${docs.length} documenti trovati`);

  // 3. Connessione a MongoDB
  console.log('Connessione a:', process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log('   -> connesso al DB:', mongoose.connection.name);

  // 4. Svuota la collection (in caso di re-import)
  const collection = mongoose.connection.db.collection('books');
  const deleted = await collection.deleteMany({});
  console.log(`   -> rimossi ${deleted.deletedCount} documenti preesistenti`);

  // 5. Inserisce tutti i nuovi documenti
  const result = await collection.insertMany(docs);
  console.log(`   -> inseriti ${result.insertedCount} documenti`);

  // Chiudi la connessione e termina
  await mongoose.disconnect();
  console.log('\nFatto! La collection books contiene ora', result.insertedCount, 'libri.');
}

// Esegui main e gestisce eventuali errori
main().catch((err) => {
  console.error('\nERRORE:', err.message);
  console.error(err);
  process.exit(1);
});
