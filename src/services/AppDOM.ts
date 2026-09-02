import { BaseBook } from "../models/book.js";
import { sortData } from "../utils/genericUtils.js";
import { SortOption } from "../types/bookTypes.js";
import type { IRenderer } from "../interfaces/IRenderer.js";

// SRP: Responsible only for rendering the book grid to the DOM
// LSP: Uses standardized book.isbn — no dual ISBN/isbn access
export default class AppDOM implements IRenderer {
  render(rawBooksArr: BaseBook[]): void {
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

    let printedCount = 0;

    for (const currentBook of processingList) {
      const isbnVal: string = currentBook.isbn; // LSP fix: single standardized property

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
      pubEl.textContent = `Publication: ${Number.isNaN(pubYear) ? "N/A" : pubYear}`;
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

    const countEl = document.getElementById("collection-count") as HTMLElement | null;
    if (countEl) countEl.textContent = `${printedCount} books`;
    const noBooksView = document.getElementById("noBooksView") as HTMLElement | null;
    if (noBooksView) noBooksView.style.display = printedCount === 0 ? "block" : "none";
  }
}
