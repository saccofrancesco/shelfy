import Navbar from "./components/Navbar";
import BookCard from "./components/BookCard";

const book = {
  title: "Delitto e castigo",
  author: "Fëdor Dostoevskij",
  year: 1866,
  genre: "Psicologico",
  description:
    "La tormentata coscienza di un giovane che ha commesso un omicidio.",
};

function App() {
  return (
    <>
      <Navbar />
      <BookCard book={book} />
    </>
  );
}

export default App;
