import { useState } from "react";
import Navbar from "./components/Navbar";
import BooksContainer from "./components/BooksContainer";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title"); // "title" | "author"

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        searchField={searchField}
        onFieldChange={(newField) => {
          setSearchField(newField);
          setSearchQuery(""); // clear text when switching mode
        }}
      />
      <BooksContainer searchQuery={searchQuery} searchField={searchField} />
    </>
  );
}

export default App;
