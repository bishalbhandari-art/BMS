import { BaseBook, EBook, PrintedBook } from "../models/book.js";
import FormUI from "./FormUi.js";
import { systemDB, editIndex } from "../main.js";
import { sortData } from "../utils/genericUtils.js";
import { SortOption } from "../types/bookTypes.js";

export default class AppDOM {
  static renderGrid(rawBooksArr: BaseBook[]): void {
    const grid = document.getElementById("booksGrid") as HTMLElement | null;
    if (!grid) return;

    grid.innerHTML = "";

    const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;
    const filterGenre = document.getElementById("filterGenre") as HTMLSelectElement | null;
    const sortByEl = document.getElementById("sortBy") as HTMLSelectElement | null;

    const searchValue: string = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedGenre: string = filterGenre ? filterGenre.value : "All";
    const sortBy: string = sortByEl ? sortByEl.value : SortOption.DATE_ADDED;

    let processingList: BaseBook[] = [...rawBooksArr];

    if (sortBy === SortOption.DATE_ADDED) {
      processingList.reverse();
    } else if (sortBy === SortOption.TITLE) {
      processingList = sortData(processingList, (a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === SortOption.AGE_ASC) {
      processingList = sortData(processingList, (a, b) => a.bookAge - b.bookAge);
    } else if (sortBy === SortOption.AGE_DESC) {
      processingList = sortData(processingList, (a, b) => b.bookAge - a.bookAge);
    }

    let printedCount: number = 0;

    for (let i = 0; i < processingList.length; i++) {
      let currentBook: BaseBook = processingList[i]!;

      const isbnVal: string = currentBook.ISBN || currentBook.isbn || "";

      if (
        !String(currentBook.title).toLowerCase().includes(searchValue) &&
        !String(currentBook.author).toLowerCase().includes(searchValue) &&
        !String(isbnVal).includes(searchValue)
      ) {
        continue;
      }

      if (selectedGenre !== "All" && currentBook.genre !== selectedGenre) {
        continue;
      }

      const pubYear: number = new Date(currentBook.publicationDate).getFullYear();

      // Safe DOM Element creation (Prevents Stored XSS)
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl p-4 shadow-sm border border-slate-200";

      const titleEl = document.createElement("h3");
      titleEl.className = "font-semibold text-lg mb-2";
      titleEl.textContent = currentBook.title;
      card.appendChild(titleEl);

      const authorEl = document.createElement("p");
      authorEl.className = "text-sm mb-1";
      authorEl.textContent = `Author: ${currentBook.author}`;
      card.appendChild(authorEl);

      const isbnEl = document.createElement("p");
      isbnEl.className = "text-sm mb-1";
      isbnEl.textContent = `ISBN: ${isbnVal}`;
      card.appendChild(isbnEl);

      const genreEl = document.createElement("p");
      genreEl.className = "text-sm mb-1";
      genreEl.textContent = `Genre: ${currentBook.genre}`;
      card.appendChild(genreEl);

      const pubEl = document.createElement("p");
      pubEl.className = "text-sm mb-1";
      pubEl.textContent = `Publication: ${pubYear}`;
      card.appendChild(pubEl);

      const ageEl = document.createElement("p");
      ageEl.className = "text-sm mb-4";
      ageEl.textContent = `Book Age: ${currentBook.bookAge} yrs`;
      card.appendChild(ageEl);

      const priceEl = document.createElement("p");
      priceEl.className = "text-sm font-semibold text-green-600 mb-4";
      priceEl.textContent = `Promo Price: $${currentBook.discountedPrice}`;
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

    const noBooksView = document.getElementById("noBooksView") as HTMLElement | null;
    if (noBooksView) {
      noBooksView.style.display = printedCount === 0 ? "block" : "none";
    }
  }
}

// Global Event Listeners setup
const bookForm = document.getElementById("Bookform") as HTMLFormElement | null;
if (bookForm) {
  bookForm.addEventListener("submit", async function (e: SubmitEvent) {
    e.preventDefault();

    const titleInput = document.getElementById("title") as HTMLInputElement;
    const authorInput = document.getElementById("author") as HTMLInputElement;
    const isbnInput = document.getElementById("ISBN") as HTMLInputElement;
    const pubDateInput = document.getElementById("publicationDate") as HTMLInputElement;
    const genreSelect = document.getElementById("genre") as HTMLSelectElement;

    const title: string = titleInput.value.trim();
    const author: string = authorInput.value.trim();
    const isbn: string = isbnInput.value.trim();
    const pubDate: string = pubDateInput.value;
    const genre: string = genreSelect.value;

    const randomPrice: number = Math.floor(Math.random() * 51) + 10;

    let book: BaseBook =
      genre === "Science Fiction" || genre === "Mystery"
        ? new EBook(title, author, isbn, pubDate, genre, randomPrice)
        : new PrintedBook(title, author, isbn, pubDate, genre, randomPrice);

    if (!FormUI.validate(book)) return;

    let confirmMsg: string =
      editIndex === -1
        ? `Do you want to add "${book.title}"?`
        : `Do you want to update "${book.title}"?`;
    if (!confirm(confirmMsg)) return;

    const submitBtn = document.querySelector("#submitBtn") as HTMLButtonElement | null;
    if (!submitBtn) return;

    const target = (submitBtn.querySelector("span") || submitBtn) as HTMLElement;
    const originalText: string = target.textContent || "";

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
    } catch (error: any) {
      alert(`${error.message} - configuration context unsaved.`);
    } finally {
      target.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

const booksGrid = document.getElementById("booksGrid") as HTMLElement | null;
if (booksGrid) {
  booksGrid.addEventListener("click", function (e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const targetBtn = target.closest("button") as HTMLButtonElement | null;
    if (!targetBtn) return;

    const bookId = targetBtn.getAttribute("data-id");
    if (!bookId) return;

    const targetIndex = systemDB.books.findIndex((b) => b.id === bookId);
    if (targetIndex === -1) return;

    if (targetBtn.classList.contains("edit-action-btn")) {
      FormUI.populateForEdit(targetIndex);
    } else if (targetBtn.classList.contains("delete-action-btn")) {
      const selectedBook = systemDB.books[targetIndex];
      if (selectedBook && confirm(`Do you want to delete "${selectedBook.title}"?`)) {
        if (editIndex === targetIndex) FormUI.reset();
        systemDB.books.splice(targetIndex, 1);
        systemDB.updateAllStats();
      }
    }
  });
}

// Real-Time Filter Event Listeners
const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;
if (searchInput) {
  searchInput.addEventListener("input", () => AppDOM.renderGrid(systemDB.books));
}

const filterGenre = document.getElementById("filterGenre") as HTMLSelectElement | null;
if (filterGenre) {
  filterGenre.addEventListener("change", () => AppDOM.renderGrid(systemDB.books));
}

const sortBy = document.getElementById("sortBy") as HTMLSelectElement | null;
if (sortBy) {
  sortBy.addEventListener("change", () => AppDOM.renderGrid(systemDB.books));
}

const cancelBtn = document.getElementById("cancelBtn") as HTMLButtonElement | null;
if (cancelBtn) {
  cancelBtn.addEventListener("click", FormUI.reset);
}

// Real-time Input Validation Reset Triggers
["title", "author", "ISBN", "publicationDate"].forEach((id: string) => {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (el) {
    el.addEventListener("input", () => {
      const errEl = document.getElementById(`error-${id}`) as HTMLElement | null;
      if (errEl) errEl.textContent = "";
    });
  }
});

const genreEl = document.getElementById("genre") as HTMLSelectElement | null;
if (genreEl) {
  genreEl.addEventListener("change", () => {
    const errEl = document.getElementById("error-genre") as HTMLElement | null;
    if (errEl) errEl.textContent = "";
  });
}
