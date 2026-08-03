import { BaseBook, EBook, PrintedBook } from "./book.js";
import FormUI from "./FormUi.js";
import { systemDB, editIndex, setEditIndex } from "../index.js";

export default class AppDOM {
  static renderGrid(rawBooksArr) {
    const grid = document.getElementById("booksGrid");
    grid.innerHTML = "";

    let searchValue = document
      .getElementById("searchInput")
      .value.toLowerCase();
    let selectedGenre = document.getElementById("filterGenre").value;
    let sortBy = document.getElementById("sortBy").value;

    let processingList = [...rawBooksArr];

    if (sortBy === "dateAdded") processingList.reverse();
    if (sortBy === "title")
      processingList.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "age-asc")
      processingList.sort((a, b) => a.getBookAge() - b.getBookAge());
    if (sortBy === "age-desc")
      processingList.sort((a, b) => b.getBookAge() - a.getBookAge());

    let printedCount = 0;

    for (let i = 0; i < processingList.length; i++) {
      let currentBook = processingList[i];

      if (
        !String(currentBook.title).toLowerCase().includes(searchValue) &&
        !String(currentBook.author).toLowerCase().includes(searchValue) &&
        !String(currentBook.ISBN).includes(searchValue)
      )
        continue;

      if (selectedGenre !== "All" && currentBook.genre !== selectedGenre)
        continue;

      const card = document.createElement("div");
      card.className = "bg-white rounded-xl p-4 shadow-sm border border-slate-200";

      const titleEl = document.createElement("h3");
      titleEl.className = "font-semibold text-lg mb-2";
      titleEl.textContent = currentBook.title;
      card.appendChild(titleEl);

      const authorEl = document.createElement("p");
      authorEl.className = "text-sm mb-1";
      authorEl.textContent = "Author: " + currentBook.author;
      card.appendChild(authorEl);

      const isbnEl = document.createElement("p");
      isbnEl.className = "text-sm mb-1";
      isbnEl.textContent = "ISBN: " + currentBook.ISBN;
      card.appendChild(isbnEl);

      const genreEl = document.createElement("p");
      genreEl.className = "text-sm mb-1";
      genreEl.textContent = "Genre: " + currentBook.genre;
      card.appendChild(genreEl);

      const pubYear = new Date(currentBook.publicationDate).getFullYear();
      const pubEl = document.createElement("p");
      pubEl.className = "text-sm mb-1";
      pubEl.textContent = "Publication: " + (isNaN(pubYear) ? "N/A" : pubYear);
      card.appendChild(pubEl);

      const ageEl = document.createElement("p");
      ageEl.className = "text-sm mb-4";
      ageEl.textContent = "Book Age: " + currentBook.getBookAge() + " yrs";
      card.appendChild(ageEl);

      const priceEl = document.createElement("p");
      priceEl.className = "text-sm font-semibold text-green-600 mb-4";
      priceEl.textContent = "Promo Price: $" + currentBook.discountedPrice;
      card.appendChild(priceEl);

      const editBtn = document.createElement("button");
      editBtn.className = "edit-action-btn w-8 h-8 rounded border bg-green-100 hover:bg-green-200 mr-2";
      editBtn.setAttribute("data-id", currentBook.id);
      editBtn.textContent = "✍️";
      card.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-action-btn w-8 h-8 rounded border bg-red-100 hover:bg-red-200";
      deleteBtn.setAttribute("data-id", currentBook.id);
      deleteBtn.textContent = "🗑️";
      card.appendChild(deleteBtn);

      grid.appendChild(card);
      printedCount++;
    }

    const countEl = document.getElementById("collection-count");
    if (countEl) countEl.textContent = printedCount + " books";
    const noBooksView = document.getElementById("noBooksView");
    if (noBooksView) noBooksView.style.display = printedCount === 0 ? "block" : "none";
  }
}
document
  .getElementById("Bookform")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    //Extract values from the form inputs
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const isbn = document.getElementById("ISBN").value.trim();
    const pubDate = document.getElementById("publicationDate").value;
    const genre = document.getElementById("genre").value;

    // Instantiate EBook or PrintedBook subclass instead of generic Book
    let book =
      genre === "Science Fiction" || genre === "Mystery"
        ? new EBook(title, author, isbn, pubDate, genre)
        : new PrintedBook(title, author, isbn, pubDate, genre);
    if (!FormUI.validate(book)) return;

    let confirmMsg =
      editIndex === -1
        ? `Do you want to add "${book.title}"?`
        : `Do you want to update "${book.title}"?`;
    if (!confirm(confirmMsg)) return;

    const submitBtn = document.querySelector("#submitBtn");
    const target = submitBtn.querySelector("span") || submitBtn;
    const originalText = target.textContent;

    target.textContent = "Connecting to server...";
    submitBtn.disabled = true;

    try {
      await systemDB.saveToServer(book);
      if (editIndex === -1) {
        systemDB.books.push(book);
      } else {
        const existingBook = systemDB.books[editIndex];
        if (existingBook) {
          book.id = existingBook.id;
          book.price = existingBook.price;
          if (book instanceof EBook && existingBook instanceof EBook) {
            book.fileSizeMB = existingBook.fileSizeMB;
          } else if (book instanceof PrintedBook && existingBook instanceof PrintedBook) {
            book.weightInGrams = existingBook.weightInGrams;
          }
        }
        systemDB.books[editIndex] = book;
      }
      FormUI.reset();
      systemDB.updateAllStats();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
      alert(msg + " - Changes could not be saved.");
    } finally {
      target.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

document.getElementById("booksGrid").addEventListener("click", function (e) {
  const targetBtn = e.target.closest("button");
  if (!targetBtn) return;

  const bookId = targetBtn.getAttribute("data-id");
  const index = systemDB.books.findIndex((b) => b.id === bookId);
  if (index === -1) return;

  if (targetBtn.classList.contains("edit-action-btn")) {
    FormUI.populateForEdit(index);
  } else if (targetBtn.classList.contains("delete-action-btn")) {
    if (confirm(`Do you want to delete "${systemDB.books[index].title}"?`)) {
      if (editIndex === index) FormUI.reset();
      systemDB.books.splice(index, 1);
      systemDB.updateAllStats();
    }
  }
});

// Real-Time Filter Event Listeners
document
  .getElementById("searchInput")
  .addEventListener("input", () => AppDOM.renderGrid(systemDB.books));
document
  .getElementById("filterGenre")
  .addEventListener("change", () => AppDOM.renderGrid(systemDB.books));
document
  .getElementById("sortBy")
  .addEventListener("change", () => AppDOM.renderGrid(systemDB.books));
document.getElementById("cancelBtn").addEventListener("click", FormUI.reset);

// Real-time Input Validation Reset Triggers
["title", "author", "ISBN", "publicationDate"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    const errEl = document.getElementById(`error-${id}`);
    if (errEl) errEl.textContent = "";
  });
});
document.getElementById("genre").addEventListener("change", () => {
  const errEl = document.getElementById("error-genre");
  if (errEl) errEl.textContent = "";
});
