import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import {
  buildBooksFilter,
  normalizeBookPayload,
  parseObjectId,
} from "./books.js";

const PORT = Number(process.env.PORT ?? 3000);
const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(cors());

let db;

function getBooksCollection() {
  return db.collection("books");
}

app.get("/books", async (req, res, next) => {
  try {
    const filter = buildBooksFilter(req.query);
    const books = await getBooksCollection()
      .find(filter)
      .sort({ title: 1, author: 1 })
      .toArray();

    res.json(books);
  } catch (err) {
    next(err);
  }
});

app.post("/books", async (req, res, next) => {
  try {
    const { book, errors } = normalizeBookPayload(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: "Invalid book data",
        details: errors,
      });
    }

    const result = await getBooksCollection().insertOne(book);

    res.status(201).json({
      message: "Book created",
      book: {
        _id: result.insertedId,
        ...book,
      },
    });
  } catch (err) {
    next(err);
  }
});

app.put("/books/:id", async (req, res, next) => {
  try {
    const id = parseObjectId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid book id" });
    }

    const { book, errors } = normalizeBookPayload(req.body, {
      partial: true,
    });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: "Invalid book data",
        details: errors,
      });
    }

    const updatedBook = await getBooksCollection().findOneAndUpdate(
      { _id: id },
      { $set: book },
      { returnDocument: "after" },
    );

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book updated", book: updatedBook });
  } catch (err) {
    next(err);
  }
});

app.delete("/books/:id", async (req, res, next) => {
  try {
    const id = parseObjectId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid book id" });
    }

    const result = await getBooksCollection().deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
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
