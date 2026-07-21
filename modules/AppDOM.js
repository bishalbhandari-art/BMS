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
      processingList.sort((a, b) => a.bookAge - b.bookAge);
    if (sortBy === "age-desc")
      processingList.sort((a, b) => b.bookAge - a.bookAge);

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

      let originalIndex = rawBooksArr.findIndex(
        (b) => b.ISBN === currentBook.ISBN,
      );

      grid.innerHTML += `
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 class="font-semibold text-lg mb-2">${currentBook.title}</h3>
          <p class="text-sm mb-1">Author: ${currentBook.author}</p>
          <p class="text-sm mb-1">ISBN: ${currentBook.ISBN}</p>
          <p class="text-sm mb-1">Genre: ${currentBook.genre}</p>
          <p class="text-sm mb-1">Publication: ${new Date(currentBook.publicationDate).getFullYear()}</p>
          <p class="text-sm mb-4">Book Age: ${currentBook.bookAge} yrs</p>
          <p class="text-sm font-semibold text-green-600 mb-4">Promo Price: $${currentBook.discountedPrice}</p>
          <button class="edit-action-btn w-8 h-8 rounded border bg-green-100 hover:bg-green-200" data-index="${originalIndex}">✍️</button>
          <button class="delete-action-btn w-8 h-8 rounded border bg-red-100 hover:bg-red-200" data-index="${originalIndex}">🗑️</button>
        </div>
      `;
      printedCount++;
    }

    document.getElementById("noBooksView").style.display =
      printedCount === 0 ? "block" : "none";
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
        book.discountedPrice = systemDB.books[editIndex].discountedPrice;
        systemDB.books[editIndex] = book;
      }
      FormUI.reset();
      systemDB.updateAllStats();
    } catch (error) {
      alert(`${error.message} - configuration context unsaved.`);
    } finally {
      target.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

document.getElementById("booksGrid").addEventListener("click", function (e) {
  const targetBtn = e.target.closest("button");
  if (!targetBtn) return;

  const index = parseInt(targetBtn.getAttribute("data-index"), 10);

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
