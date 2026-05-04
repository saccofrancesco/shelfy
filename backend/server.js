import express from "express";
import connectDB from "./db.js";
import cors from "cors";

const PORT = 3000;
const app = express();

app.use(express.json());

app.use(cors());

app.get("/books", async (req, res, next) => {
  try {
    const booksCollection = db.collection("books");
    const filter = {};
    const books = await booksCollection.find(filter).toArray();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

let db;

async function startServer() {
  try {
    db = await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
