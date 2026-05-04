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
