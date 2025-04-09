const STORAGE_KEY = "BOOK_SHELF";
const RENDER_EVENT = "render-book";
const NEW_BOOK_SUMBIT_FORM = document.getElementById("bookForm");

window.addEventListener("load", () => {
  if (typeof Storage === "undefined") {
    alert("No Web Storage Found");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, () => {
  const INCOMPLETE_SHELF = document.getElementById("incompleteBookList");
  INCOMPLETE_SHELF.innerHTML = "";

  const COMPLETED_SHELF = document.getElementById("completeBookList");
  COMPLETED_SHELF.innerHTML = "";

  const books = getBooks();
  books.forEach((book) => {
    if (book.isComplete === false) {
      INCOMPLETE_SHELF.append(generateBookInShelf(book));
    } else {
      COMPLETED_SHELF.append(generateBookInShelf(book));
    }
  });
});

NEW_BOOK_SUMBIT_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  const BOOK_ID = new Date().getTime();
  const BOOK_TITLE = document.getElementById("bookFormTitle").value;
  const BOOK_AUTHOR = document.getElementById("bookFormAuthor").value;
  const BOOK_YEAR_RELEASED = document.getElementById("bookFormYear").value;
  const BOOK_STATUS = document.getElementById("bookFormIsComplete").checked;

  const BOOK_DATA = {
    id: BOOK_ID,
    title: BOOK_TITLE,
    author: BOOK_AUTHOR,
    year: parseInt(BOOK_YEAR_RELEASED),
    isComplete: BOOK_STATUS,
  };

  putBooks(BOOK_DATA);
  document.dispatchEvent(new Event(RENDER_EVENT));
});

const checkStorage = () => {
  return typeof Storage !== "undefined";
};

const putBooks = (BOOK_DATA) => {
  if (checkStorage()) {
    let books = [];
    if (localStorage.getItem(STORAGE_KEY) !== null) {
      books = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }

    books.push(BOOK_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
};

const getBooks = () => {
  if (checkStorage()) {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } else {
    return [];
  }
};

const generateBookInShelf = (BOOK) => {
  const BOOK_CONTAINER = document.createElement("div");
  BOOK_CONTAINER.setAttribute("class", "book-item");
  BOOK_CONTAINER.setAttribute("data-bookid", BOOK.id);
  BOOK_CONTAINER.setAttribute("data-testid", "bookItem");

  const BOOK_TITLE = document.createElement("h3");
  BOOK_TITLE.setAttribute("data-testid", "bookItemTitle");
  BOOK_TITLE.textContent = BOOK.title;

  const BOOK_AUTHOR = document.createElement("p");
  BOOK_AUTHOR.setAttribute("data-testid", "bookItemAuthor");
  BOOK_AUTHOR.textContent = `Penulis: ${BOOK.author}`;

  const BOOK_YEAR_RELEASED = document.createElement("p");
  BOOK_YEAR_RELEASED.setAttribute("data-testid", "bookItemYear");
  BOOK_YEAR_RELEASED.textContent = `Tahun: ${BOOK.year}`;

  const BUTTON_CONTAINER = document.createElement("div");
  BUTTON_CONTAINER.setAttribute("class", "button-div");

  const FINISH_BUTTON = document.createElement("button");
  FINISH_BUTTON.textContent = "Selesai dibaca";
  FINISH_BUTTON.setAttribute("data-testid", "bookItemIsCompleteButton");
  FINISH_BUTTON.addEventListener("click", () => {
    changeBookStatus(BOOK.id);
  });

  const DELETE_BUTTON = document.createElement("button");
  DELETE_BUTTON.textContent = "Hapus Buku";
  DELETE_BUTTON.setAttribute("data-testid", "bookItemDeleteButton");
  DELETE_BUTTON.addEventListener("click", () => {
    deleteBook(BOOK.id);
  });

  const EDIT_BUTTON = document.createElement("button");
  EDIT_BUTTON.textContent = "Edit Buku";
  EDIT_BUTTON.setAttribute("data-testid", "bookItemEditButton");
  EDIT_BUTTON.addEventListener("click", () => {
    editBook(BOOK.id);
  });

  BUTTON_CONTAINER.append(FINISH_BUTTON, DELETE_BUTTON, EDIT_BUTTON);
  BOOK_CONTAINER.append(
    BOOK_TITLE,
    BOOK_AUTHOR,
    BOOK_YEAR_RELEASED,
    BUTTON_CONTAINER
  );
  return BOOK_CONTAINER;
};

const deleteBook = (BOOK_ID) => {
  const TARGETED_BOOK_INDEX = findBookIndex(BOOK_ID);
  if (TARGETED_BOOK_INDEX === -1) return;
  const BOOKS = getBooks();
  console.log(`Book Deleted: ${BOOKS[TARGETED_BOOK_INDEX].id}`);
  BOOKS.splice(BOOKS[TARGETED_BOOK_INDEX], 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(BOOKS));
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const changeBookStatus = (BOOK_ID) => {
  const TARGETED_BOOK_INDEX = findBookIndex(BOOK_ID);
  if (TARGETED_BOOK_INDEX === -1) return;
  const BOOKS = getBooks();
  console.log(
    `Book : ${BOOKS[TARGETED_BOOK_INDEX].title} Status Changed from ${BOOKS[TARGETED_BOOK_INDEX].isComplete} to ${!BOOKS[TARGETED_BOOK_INDEX].isComplete}`
  );
  BOOKS[TARGETED_BOOK_INDEX].isComplete =
    !BOOKS[TARGETED_BOOK_INDEX].isComplete;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(BOOKS));
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const findBookIndex = (BOOK_ID) => {
  BOOKS = getBooks();
  for (let i = 0; i < BOOKS.length; i++) {
    if (BOOKS[i].id === BOOK_ID) {
      return i;
    }
  }
  return -1;
};

const editBook = (BOOK_ID) => {
  const NEW_TITLE = prompt(
    "Tuliskan nama buku (Kosongkan bila tidak ingin mengubah)"
  );
  const NEW_AUTHOR = prompt(
    "Isi nama penulis (Kosongkan bila tidak ingin mengubah)"
  );
  const NEW_YEAR = prompt(
    "Tuliskan tahun terbit buku (Kosongkan bila tidak ingin mengubah)"
  );

  const TARGETED_BOOK_INDEX = findBookIndex(BOOK_ID);
  if (TARGETED_BOOK_INDEX === -1) return;
  const BOOKS = getBooks();
  if (NEW_TITLE !== null && NEW_TITLE !== "")
    BOOKS[TARGETED_BOOK_INDEX].title = NEW_TITLE;
  if (NEW_AUTHOR !== null && NEW_AUTHOR !== "")
    BOOKS[TARGETED_BOOK_INDEX].author = NEW_AUTHOR;
  if (NEW_YEAR !== null && NEW_YEAR !== "")
    BOOKS[TARGETED_BOOK_INDEX].year = NEW_YEAR;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(BOOKS));
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const SEARCH_FORM = document.getElementById("searchBook");
SEARCH_FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  const SEARCH_INPUT = document.getElementById("searchBookTitle").value;
  const FILTERED_BOOKS = searchBook(SEARCH_INPUT);
  const INCOMPLETE_SHELF = document.getElementById("incompleteBookList");
  INCOMPLETE_SHELF.innerHTML = "";
  const COMPLETED_SHELF = document.getElementById("completeBookList");
  COMPLETED_SHELF.innerHTML = "";
  FILTERED_BOOKS.forEach((book) => {
    if (book.isComplete === false) {
      INCOMPLETE_SHELF.append(generateBookInShelf(book));
    } else {
      COMPLETED_SHELF.append(generateBookInShelf(book));
    }
  });
});
function searchBook(INPUT) {
  const BOOKS = getBooks();
  const FILTERED_BOOKS = BOOKS.filter((BOOK) => {
    return (
      BOOK.title.toLowerCase().includes(INPUT.toLowerCase()) ||
      BOOK.author.toLowerCase().includes(INPUT.toLowerCase())
    );
  });
  return FILTERED_BOOKS;
}
