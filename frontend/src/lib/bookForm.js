export function createEmptyBookForm() {
  return {
    title: "",
    author: "",
    year: "",
    genre: "",
    description: "",
  };
}

export function bookToForm(book) {
  if (!book) {
    return createEmptyBookForm();
  }

  return {
    title: book.title || "",
    author: book.author || "",
    year: book.year || "",
    genre: book.genre || "",
    description: book.description || "",
  };
}
