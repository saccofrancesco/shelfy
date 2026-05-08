import { ObjectId } from "mongodb";

const SEARCH_FIELDS = new Set(["title", "author"]);

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalString(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return "";
  }

  return trimString(value);
}

function normalizeYear(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return { error: "year must be a positive integer" };
  }

  return parsed;
}

export function parseObjectId(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}

export function buildBooksFilter(query) {
  const rawQuery = trimString(query.q);
  if (!rawQuery) {
    return {};
  }

  const field = SEARCH_FIELDS.has(query.field) ? query.field : "title";
  const escapedQuery = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return {
    [field]: {
      $regex: escapedQuery,
      $options: "i",
    },
  };
}

export function normalizeBookPayload(body, { partial = false } = {}) {
  const errors = {};
  const book = {};
  const fields = ["title", "author", "year", "genre", "description", "coverUrl"];
  let sawAnyField = false;

  for (const field of fields) {
    if (!hasOwn(body, field)) {
      continue;
    }

    sawAnyField = true;

    const value = body[field];

    if (field === "year") {
      const normalizedYear = normalizeYear(value);
      if (normalizedYear && typeof normalizedYear === "object") {
        errors.year = normalizedYear.error;
        continue;
      }

      book.year = normalizedYear;
      continue;
    }

    const normalizedValue = normalizeOptionalString(value);

    if ((field === "title" || field === "author") && !normalizedValue) {
      errors[field] = `${field} is required`;
      continue;
    }

    book[field] = normalizedValue;
  }

  if (!partial) {
    if (!hasOwn(body, "title") || !book.title) {
      errors.title = "title is required";
    }

    if (!hasOwn(body, "author") || !book.author) {
      errors.author = "author is required";
    }

    book.year ??= null;
    book.genre ??= "";
    book.description ??= "";
    book.coverUrl ??= "";
  } else if (!sawAnyField) {
    errors.book = "provide at least one field to update";
  }

  return {
    book,
    errors,
  };
}
