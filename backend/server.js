import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "./db.js";
import {
  buildBooksFilter,
  normalizeBookPayload,
  parseObjectId,
} from "./books.js";

const PORT = Number(process.env.PORT ?? 3000);
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";
const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TTL ?? "15m";
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_TTL ?? "30d";
const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(cors());

let db;

function getBooksCollection() {
  return db.collection("books");
}

function getAdminUsersCollection() {
  return db.collection("admin_users");
}

function getRefreshTokensCollection() {
  return db.collection("refresh_tokens");
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), username: user.username, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL },
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), tokenType: "refresh" },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL },
  );
}

function verifyAccessToken(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing access token" });
  }

  try {
    req.auth = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
}

async function storeRefreshToken(userId, token) {
  const decoded = jwt.decode(token);
  if (!decoded?.exp) return;

  await getRefreshTokensCollection().insertOne({
    userId,
    token,
    expiresAt: new Date(decoded.exp * 1000),
    createdAt: new Date(),
  });
}

async function revokeRefreshToken(token) {
  await getRefreshTokensCollection().deleteOne({ token });
}

app.post("/auth/login", async (req, res, next) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const user = await getAdminUsersCollection().findOne({
      username: String(username).trim(),
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordOk = await bcrypt.compare(String(password), user.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await storeRefreshToken(user._id.toString(), refreshToken);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role ?? "admin",
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const tokenRecord = await getRefreshTokensCollection().findOne({
      token: refreshToken,
    });

    if (!payload || !tokenRecord) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await getAdminUsersCollection().findOne({
      _id: parseObjectId(payload.sub),
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const accessToken = signAccessToken(user);
    res.json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role ?? "admin",
      },
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

app.post("/auth/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});

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

app.post("/books", verifyAccessToken, async (req, res, next) => {
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

app.put("/books/:id", verifyAccessToken, async (req, res, next) => {
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

app.delete("/books/:id", verifyAccessToken, async (req, res, next) => {
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
