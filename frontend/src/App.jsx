import { useState } from "react";
import Navbar from "./components/Navbar";
import BooksContainer from "./components/BooksContainer";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title"); // "title" | "author"
  const [refreshKey, setRefreshKey] = useState(0);

  function handleBookAdded() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        searchField={searchField}
        onFieldChange={(newField) => {
          setSearchField(newField);
        }}
        onAdded={handleBookAdded}
      />
      <BooksContainer
        searchQuery={searchQuery}
        searchField={searchField}
        refreshKey={refreshKey}
      />
    </>
  );
}

export default App;
