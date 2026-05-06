import express from "express";
import connectDB from "./db.js";
import cors from "cors";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

let db;

app.get("/books", async (req, res, next) => {
  try {
    const booksCollection = db.collection("books");

    const { q = "", field = "title" } = req.query;

    // No query → return everything
    if (!q.trim()) {
      const books = await booksCollection.find({}).toArray();
      return res.json(books);
    }

    // field must be one of the two allowed values — never trust client input directly
    const allowedFields = ["title", "author"];
    const searchField = allowedFields.includes(field) ? field : "title";

    const filter = {
      [searchField]: { $regex: q.trim(), $options: "i" },
    };

    const books = await booksCollection.find(filter).toArray();
    res.json(books);
  } catch (err) {
    next(err);
  }
});
app.post("/books", async (req, res, next) => {
  try {
    const { title, author, year, genre, description } = req.body || {};

    if (!title?.trim() || !author?.trim()) {
      return res
        .status(400)
        .json({ error: "title e author sono obbligatori" });
    }

    const doc = {
      title: title.trim(),
      author: author.trim(),
      year: year ? Number(year) : null,
      genre: genre ? String(genre).trim() : null,
      description: description ? String(description).trim() : null,
      createdAt: new Date(),
    };

    const result = await db.collection("books").insertOne(doc);

    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    next(err);
  }
});
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
