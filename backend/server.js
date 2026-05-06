import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import { ObjectId } from "mongodb";
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
    const booksCollection = db.collection("books");
    const { title, author, year, genre, description, coverUrl } = req.body;
    if (!title || !author) {
      return res.status(400).json({
        error: "title and author are required",
      });
    }
    const newBook = {
      title: title.trim(),
      author: author.trim(),
      year: year ? Number(year) : null,
      genre: genre ? genre.trim() : "",
      description: description ? description.trim() : "",
      coverUrl: coverUrl ? coverUrl.trim() : "",
    };
    const result = await booksCollection.insertOne(newBook);
    res.status(201).json({
      message: "Book created",
      book: {
        _id: result.insertedId,
        ...newBook,
      },
    });
  } catch (err) {
    next(err);
  }
});
app.put("/books/:id", async (req, res, next) => {
  try {
    const booksCollection = db.collection("books");
    const id = new ObjectId(req.params.id);
    const { title, author, year, genre, description, coverUrl } = req.body;

    const updates = {};
    if (title)       updates.title       = title.trim();
    if (author)      updates.author      = author.trim();
    if (year)        updates.year        = Number(year);
    if (genre)       updates.genre       = genre.trim();
    if (description) updates.description = description.trim();
    if (coverUrl)    updates.coverUrl    = coverUrl.trim();

    const result = await booksCollection.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book updated", book: result });
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
